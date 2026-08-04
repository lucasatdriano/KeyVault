import { ACCESS_TOKEN_DURATION } from '@/src/shared/constants/auth/auth.constants';
import { DEFAULT_ARGON2_PARAMS } from '@/src/shared/constants/crypto/argon2.constants';
import { hashPassword, verifyPassword } from '../../crypto/passwordHasher';
import {
    ChangePasswordData,
    LoginData,
    RegisterData,
    LoginResult,
    RegisterResult,
} from '../../types/service/auth';
import { JWTService } from './jwt.service';
import { AuditService } from '../audit.service';
import { AuthRepository } from '../../database/repositories/auth.repository';
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

export class AuthService {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly jwtService: JWTService,
        private readonly auditService: AuditService,
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
            emailVerified: true,
            passwordHash: passwordHash,
            encryptedVaultKey: JSON.stringify(data.encryptedVaultKey),
        });

        await this.categoryService.createMany(user.id, data.categories);

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
        };
    }

    async login(data: LoginData, audit?: AuditContext): Promise<LoginResult> {
        validateLoginData(data);

        const user = await this.authRepository.findUserByEmail(data.email);

        if (!user) {
            throw new Error('Email ou senha inválidos.');
        }

        const passwordData = user.passwordHash;

        const validPassword = await verifyPassword({
            password: data.password,
            hash: passwordData,
        });

        const validEmail = user.emailVerified;

        if (!validPassword || !validEmail) {
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
                emailVerified: true,
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
        data: ChangePasswordData,
        audit?: AuditContext,
    ): Promise<void> {
        validateChangePasswordData(data);

        const user = await this.authRepository.findUserById(data.userId);

        if (!user) {
            throw new Error('Usuário não encontrado.');
        }

        const passwordData = user.passwordHash;

        const validPassword = await verifyPassword({
            password: data.currentPassword,
            hash: passwordData,
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

        await this.authRepository.updatePassword(
            user.id,
            JSON.stringify(newPasswordHash),
        );

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

    async verifyEmail(userId: string, audit?: AuditContext): Promise<void> {
        await this.authRepository.updateEmailVerification(userId, true);

        await this.auditService.createLog({
            userId,
            action: AuditAction.VERIFY_EMAIL,
            browser: audit?.browser,
            os: audit?.os,
            device: audit?.device,
            ip: audit?.ip,
        });
    }
}
