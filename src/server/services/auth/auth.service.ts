import { ACCESS_TOKEN_DURATION } from '@/src/shared/constants/auth/auth.constants';
import { DEFAULT_ARGON2_PARAMS } from '@/src/shared/constants/crypto/argon2.constants';

import { AuthRepository } from '../../database/repositories/auth.repository';
import { hashPassword, verifyPassword } from '../../crypto/passwordHasher';
import { AuditService } from '../audit.service';
import { JWTService } from './jwt.service';
import {
    LoginData,
    RegisterData,
    LoginResult,
    RegisterResult,
    ChangePasswordData,
    VerifyEmailResult,
} from '../../types/service/auth';

import {
    deleteAccessToken,
    getAccessToken,
    setAccessToken,
} from '../../auth/cookies';

import { changeMasterPassword } from '@/src/shared/crypto/vault';

import { AuditAction, User } from '@/src/generated/prisma/client';

import {
    validateChangePasswordData,
    validateLoginData,
    validateRegisterData,
} from '../../validators/auth/auth.validator';

import { AuditContext } from '../../types/service/audit';
import { CategoryService } from '../category.service';
import { generateRandomHex, generateSha256 } from '@/src/shared/crypto/random';

import { EmailVerificationRepository } from '../../database/repositories/emailVerification.repository';
import { EmailService } from './email.service';
import { RecoverySettingsService } from '../recovery/recovery-settings.service';

export class AuthService {
    private readonly EMAIL_VERIFICATION_DURATION = 15 * 60 * 1000;

    constructor(
        private readonly authRepository: AuthRepository,
        private readonly emailVerificationRepository: EmailVerificationRepository,
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

        const duration =
            data.sessionExpiration ?? ACCESS_TOKEN_DURATION.MINUTES_30;

        const token = await this.jwtService.generateAccessToken(
            user.id,
            user.email,
            duration,
        );

        await setAccessToken(token, duration);

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
            },
            encryptedVaultKey: JSON.parse(user.encryptedVaultKey),
        };
    }

    async logout(audit?: AuditContext): Promise<void> {
        const user = await this.getCurrentUser();

        if (!user) {
            await deleteAccessToken();
            return;
        }

        await this.logoutByUserId(user.id, audit);
    }

    async logoutByUserId(userId: string, audit?: AuditContext): Promise<void> {
        const user = await this.authRepository.findUserById(userId);

        if (!user) {
            return;
        }

        await this.auditService.createLog({
            userId,
            action: AuditAction.LOGOUT,
            browser: audit?.browser,
            os: audit?.os,
            device: audit?.device,
            ip: audit?.ip,
        });

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
}
