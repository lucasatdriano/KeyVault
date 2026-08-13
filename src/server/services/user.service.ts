import { AuditAction, User } from '@/src/generated/prisma/client';

import { UserRepository } from '../database/repositories/user.repository';
import { RecoveryRepository } from '../database/repositories/recovery.repository';
import { AuditService } from './audit.service';

import { AuditContext } from '../types/service/audit';
import { validateNameData } from '../validators/user/name.validator';
import { generateRandomHex, generateSha256 } from '@/src/shared/crypto/random';
import { EmailService } from './auth/email.service';
import { AuthRepository } from '../database/repositories/auth.repository';
import { EmailVerificationRepository } from '../database/repositories/emailVerification.repository';
import { validateEmailData } from '../validators/user/email.validator';
import { verifyPassword } from '../crypto/passwordHasher';
import { ChangeEmailData, RegisterResult } from '../types/service/auth';
import { ChangeUserData } from '@/src/shared/types/profile';

export class UserService {
    private readonly EMAIL_VERIFICATION_DURATION = 15 * 60 * 1000;

    constructor(
        private readonly userRepository: UserRepository,
        private readonly authRepository: AuthRepository,
        private readonly recoveryRepository: RecoveryRepository,
        private readonly emailVerificationRepository: EmailVerificationRepository,
        private readonly emailService: EmailService,
        private readonly auditService: AuditService,
    ) {}

    async getProfile(userId: string) {
        if (!userId) {
            throw new Error('userId inválido.');
        }

        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new Error('Usuário não encontrado.');
        }

        const recoveryMethods =
            await this.recoveryRepository.findMethodsByUserId(userId);

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                emailVerified: user.emailVerified,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            recoveryMethods,
        };
    }

    async updateProfile(
        userId: string,
        data: ChangeUserData,
        audit?: AuditContext,
    ): Promise<User> {
        if (!userId) {
            throw new Error('userId inválido.');
        }

        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new Error('Usuário não encontrado.');
        }

        if (data.name === undefined) {
            throw new Error('Nenhuma alteração informada.');
        }

        validateNameData(data.name);

        const normalizedName = data.name.trim();

        if (normalizedName === user.name) {
            return user;
        }

        const updatedUser = await this.userRepository.updateName(
            userId,
            normalizedName,
        );

        await this.auditService.createLog({
            userId,
            action: AuditAction.UPDATE_PROFILE,
            browser: audit?.browser,
            os: audit?.os,
            device: audit?.device,
            ip: audit?.ip,
        });

        return updatedUser;
    }

    async updateEmail(
        userId: string,
        data: ChangeEmailData,
        audit?: AuditContext,
    ): Promise<RegisterResult> {
        if (!userId) {
            throw new Error('userId inválido.');
        }

        if (data.newEmail === undefined) {
            throw new Error('Nenhuma alteração informada.');
        }

        validateEmailData(data.newEmail);

        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new Error('Usuário não encontrado.');
        }

        const existingUser = await this.userRepository.findByEmail(
            data.newEmail,
        );

        if (existingUser && existingUser.id !== userId) {
            throw new Error('Este e-mail já está em uso por outro usuário.');
        }

        const normalizedNewEmail = data.newEmail.trim().toLowerCase();

        if (normalizedNewEmail === user.email) {
            throw new Error('O novo e-mail é igual ao atual.');
        }

        const validPassword = await verifyPassword({
            password: data.password,
            hash: user.passwordHash,
        });

        if (!validPassword) {
            throw new Error('Senha atual incorreta.');
        }

        await this.userRepository.updateEmail(userId, normalizedNewEmail);

        await this.authRepository.updateEmailVerification(userId, false);

        await this.emailVerificationRepository.invalidateByUserId(userId);

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

        // await this.emailService.sendEmailVerification(
        //     normalizedNewEmail,
        //     user.name,
        //     verificationToken,
        // );

        await this.auditService.createLog({
            userId,
            action: AuditAction.CHANGE_EMAIL,
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
}
