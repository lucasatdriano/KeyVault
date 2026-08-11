import { AuditAction, User } from '@/src/generated/prisma/client';

import { UserRepository } from '../database/repositories/user.repository';
import { RecoveryRepository } from '../database/repositories/recovery.repository';
import { AuditService } from './audit.service';

import { UpdateUserData } from '../types/repository/user';
import { AuditContext } from '../types/service/audit';

export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly recoveryRepository: RecoveryRepository,
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
        data: UpdateUserData,
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

        this.validateName(data.name);

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

    private validateName(name: string): void {
        if (typeof name !== 'string') {
            throw new Error('Nome inválido.');
        }

        const normalized = name.trim();

        if (normalized.length < 2) {
            throw new Error('Nome deve ter pelo menos 2 caracteres.');
        }

        if (normalized.length > 100) {
            throw new Error('Nome deve ter no máximo 100 caracteres.');
        }
    }
}
