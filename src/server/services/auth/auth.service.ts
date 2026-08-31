import { AuditAction, User } from '@/src/generated/prisma/client';

import { DEFAULT_ARGON2_PARAMS } from '@/src/shared/constants/crypto/argon2.constants';
import { ACCESS_TOKEN_DURATION } from '@/src/shared/constants/auth/auth.constants';
import { generateRandomHex, generateSha256 } from '@/src/shared/crypto/random';
import { changeMasterPassword } from '@/src/shared/crypto/vault';
import { ChangePasswordData } from '@/src/shared/types/auth';

import { AuthRepository } from '@/src/server/database/repositories/auth.repository';
import { EmailVerificationRepository } from '@/src/server/database/repositories/emailVerification.repository';
import { RecoverySettingsService } from '@/src/server/services/recovery/recovery-settings.service';
import { CategoryService } from '@/src/server/services/category.service';
import { SessionService } from '@/src/server/services/auth/session.service';
import { AuditService } from '@/src/server/services/audit.service';
import { EmailService } from '@/src/server/services/auth/email.service';
import { JWTService } from '@/src/server/services/auth/jwt.service';
import {
    hashPassword,
    verifyPassword,
} from '@/src/server/crypto/passwordHasher';
import {
    deleteAccessToken,
    getAccessToken,
    setAccessToken,
} from '@/src/server/auth/cookies';
import {
    validateChangePasswordData,
    validateLoginData,
    validateRegisterData,
} from '@/src/server/validators/auth/auth.validator';
import { AuditContext } from '@/src/server/types/service/audit';
import {
    LoginData,
    RegisterData,
    LoginResult,
    RegisterResult,
    VerifyEmailResult,
} from '@/src/server/types/service/auth';

export class AuthService {
    private readonly EMAIL_VERIFICATION_DURATION = 15 * 60 * 1000;

    constructor(
        private readonly authRepository: AuthRepository,
        private readonly emailVerificationRepository: EmailVerificationRepository,
        private readonly sessionService: SessionService,
        private readonly emailService: EmailService,
        private readonly jwtService: JWTService,
        private readonly auditService: AuditService,
        private readonly recoverySettingsService: RecoverySettingsService,
        private readonly categoryService: CategoryService,
    ) {}

    async register(
        data: RegisterData,
        audit?: AuditContext,
    ): Promise<RegisterResult> {
        validateRegisterData(data);

        const existingUser = await this.authRepository.findUserByEmail(
            data.email,
        );

        if (existingUser) {
            throw new Error('Email já cadastrado.');
        }

        const passwordHash = await hashPassword({
            password: data.password,
            params: DEFAULT_ARGON2_PARAMS,
        });

        const user = await this.authRepository.createUser({
            name: data.name,
            email: data.email,
            passwordHash,
            encryptedVaultKey: JSON.stringify(data.encryptedVaultKey),
        });

        await this.recoverySettingsService.createDefaultMethods(user.id);

        await this.categoryService.createMany(user.id, data.categories);

        const verificationToken = generateRandomHex(32);

        const tokenHash = await generateSha256(verificationToken);

        const expiresAt = new Date(
            Date.now() + this.EMAIL_VERIFICATION_DURATION,
        );

        await this.emailVerificationRepository.create({
            userId: user.id,
            tokenHash,
            expiresAt,
            isEmailChange: false,
        });

        await this.auditService.createLog({
            userId: user.id,
            action: AuditAction.REGISTER,
            browser: audit?.browser,
            os: audit?.os,
            device: audit?.device,
            ip: audit?.ip,
        });

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                emailVerified: user.emailVerified,
            },
            verificationToken,
        };
    }

    async login(data: LoginData, audit?: AuditContext): Promise<LoginResult> {
        validateLoginData(data);

        const user = await this.authRepository.findUserByEmail(data.email);

        if (!user) {
            throw new Error('Email ou senha inválidos.');
        }

        const validPassword = await verifyPassword({
            password: data.password,
            hash: user.passwordHash,
        });

        if (!validPassword || !user.emailVerified) {
            throw new Error('Email ou senha inválidos.');
        }

        const duration = user.sessionExpiration;

        const expiresAt = new Date(Date.now() + duration * 1000);

        const session = await this.sessionService.create(user.id, expiresAt);

        const token = await this.jwtService.generateAccessToken(
            user.id,
            user.email,
            duration,
            session.id,
        );

        await setAccessToken(token);

        await this.auditService.createLog({
            userId: user.id,
            action: AuditAction.LOGIN,
            browser: audit?.browser,
            os: audit?.os,
            device: audit?.device,
            ip: audit?.ip,
        });

        await this.auditService.cleanup();

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                emailVerified: user.emailVerified,
                sessionExpiration: user.sessionExpiration,
            },
            encryptedVaultKey: JSON.parse(user.encryptedVaultKey),
        };
    }

    async logout(audit?: AuditContext): Promise<void> {
        const token = await getAccessToken();

        if (!token) {
            return;
        }

        const payload = this.jwtService.decodeAccessToken(token);

        if (!payload?.sessionId) {
            await deleteAccessToken();
            return;
        }

        await this.sessionService.logout(payload.sessionId, audit);

        await deleteAccessToken();
    }

    async getCurrentUser(): Promise<User | null> {
        const token = await getAccessToken();

        if (!token) {
            return null;
        }

        const result = await this.jwtService.verifyAccessToken(token);

        if (!result.valid || !result.payload) {
            return null;
        }

        return this.authRepository.findUserById(result.payload.sub);
    }

    async requireAuth(): Promise<User> {
        const user = await this.getCurrentUser();

        if (!user) {
            throw new Error('Não autenticado.');
        }

        return user;
    }

    async changePassword(
        userId: string,
        data: ChangePasswordData,
        audit?: AuditContext,
    ): Promise<void> {
        validateChangePasswordData(data);

        const user = await this.authRepository.findUserById(userId);

        if (!user) {
            throw new Error('Usuário não encontrado.');
        }

        const validPassword = await verifyPassword({
            password: data.currentPassword,
            hash: user.passwordHash,
        });

        if (!validPassword) {
            throw new Error('Senha atual incorreta.');
        }

        const encryptedVault = JSON.parse(user.encryptedVaultKey);

        const newEncryptedVault = await changeMasterPassword(
            encryptedVault,
            data.currentPassword,
            data.newPassword,
            DEFAULT_ARGON2_PARAMS,
        );

        const newPasswordHash = await hashPassword({
            password: data.newPassword,
            params: DEFAULT_ARGON2_PARAMS,
        });

        await this.authRepository.updatePassword(user.id, newPasswordHash);

        await this.authRepository.updateVaultKey(
            user.id,
            JSON.stringify(newEncryptedVault),
        );

        await this.auditService.createLog({
            userId: user.id,
            action: AuditAction.CHANGE_MASTER_PASSWORD,
            browser: audit?.browser,
            os: audit?.os,
            device: audit?.device,
            ip: audit?.ip,
        });

        await deleteAccessToken();
    }

    async updateSessionExpiration(
        userId: string,
        sessionExpiration: number,
    ): Promise<void> {
        const allowedValues = [
            ACCESS_TOKEN_DURATION.MINUTES_30,
            ACCESS_TOKEN_DURATION.HOUR_1,
            ACCESS_TOKEN_DURATION.HOURS_2,
        ];

        if (!allowedValues.includes(sessionExpiration)) {
            throw new Error('Tempo de sessão inválido.');
        }

        await this.authRepository.updateSessionExpiration(
            userId,
            sessionExpiration,
        );
    }

    async verifyEmail(
        token: string,
        audit?: AuditContext,
    ): Promise<VerifyEmailResult> {
        if (!token) {
            throw new Error('Token de verificação não informado.');
        }

        const tokenHash = await generateSha256(token);

        const verification =
            await this.emailVerificationRepository.findByTokenHash(tokenHash);

        if (!verification) {
            throw new Error('Token de verificação inválido.');
        }

        if (verification.expiresAt < new Date()) {
            throw new Error('Token de verificação expirado.');
        }

        const user = await this.authRepository.findUserById(
            verification.userId,
        );

        if (!user) {
            throw new Error('Usuário não encontrado.');
        }

        if (user.emailVerified) {
            return {
                userId: user.id,
                requiresLogout: false,
            };
        }

        await this.authRepository.updateEmailVerification(user.id, true);

        await this.emailVerificationRepository.markAsUsed(verification.id);

        await this.auditService.createLog({
            userId: user.id,
            action: AuditAction.VERIFY_EMAIL,
            browser: audit?.browser,
            os: audit?.os,
            device: audit?.device,
            ip: audit?.ip,
        });

        return {
            userId: user.id,
            requiresLogout: verification.isEmailChange,
        };
    }

    async resendEmailVerification(email: string): Promise<void> {
        const normalizedEmail = email.trim().toLowerCase();

        const user = await this.authRepository.findUserByEmail(normalizedEmail);

        if (!user) {
            throw new Error(
                'Não foi possível reenviar o e-mail de verificação.',
            );
        }

        if (user.emailVerified) {
            throw new Error('O e-mail já foi verificado.');
        }

        await this.emailVerificationRepository.invalidateByUserId(user.id);

        const verificationToken = generateRandomHex(32);
        const tokenHash = await generateSha256(verificationToken);

        const expiresAt = new Date(
            Date.now() + this.EMAIL_VERIFICATION_DURATION,
        );

        await this.emailVerificationRepository.create({
            userId: user.id,
            tokenHash,
            expiresAt,
            isEmailChange: true,
        });

        await this.emailService.sendEmailVerification(
            user.email,
            user.name,
            verificationToken,
        );
    }

    async deleteAccount(userId: string): Promise<void> {
        const user = await this.authRepository.findUserById(userId);

        if (!user) {
            throw new Error('Usuário não encontrado.');
        }

        await this.authRepository.deleteUser(user.id);

        await deleteAccessToken();
    }
}
