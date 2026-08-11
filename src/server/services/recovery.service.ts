import { AuditAction, RecoveryType } from '@/src/generated/prisma/client';

import { generateRandomHex, generateSha256 } from '@/src/shared/crypto/random';

import { RecoveryRepository } from '../database/repositories/recovery.repository';
import { AuthRepository } from '../database/repositories/auth.repository';
import { AuditService } from './audit.service';
import { AuditContext } from '../types/service/audit';

export class RecoveryService {
    private readonly SESSION_DURATION = 15 * 60 * 1000;

    constructor(
        private readonly recoveryRepository: RecoveryRepository,
        private readonly authRepository: AuthRepository,
        private readonly auditService: AuditService,
    ) {}

    async startRecovery(email: string) {
        const normalizedEmail = email.trim().toLowerCase();

        const user = await this.authRepository.findUserByEmail(normalizedEmail);

        if (!user) {
            throw new Error('Não foi possível iniciar a recuperação.');
        }

        if (!user.isRecoverable) {
            throw new Error('A recuperação da conta não está disponível.');
        }

        const methods = await this.recoveryRepository.findEnabledMethods(
            user.id,
        );

        if (methods.length === 0) {
            throw new Error('Nenhum método de recuperação está habilitado.');
        }

        const expiresAt = new Date(Date.now() + this.SESSION_DURATION);

        const token = generateRandomHex(32);

        const tokenHash = await generateSha256(token);

        const session = await this.recoveryRepository.createSession({
            userId: user.id,
            tokenHash,
            expiresAt,
        });

        return {
            sessionId: session.id,
            totalSteps: methods.length,
            currentStep: 0,
            nextMethod: methods[0].type,
            expiresAt,
        };
    }

    async getEnabledMethods(userId: string) {
        this.validateUserId(userId);

        return this.recoveryRepository.findEnabledMethods(userId);
    }

    async getMethods(userId: string) {
        this.validateUserId(userId);

        return this.recoveryRepository.findMethodsByUserId(userId);
    }

    async enableMethod(
        userId: string,
        type: RecoveryType,
        audit?: AuditContext,
    ) {
        this.validateUserId(userId);

        const method = await this.recoveryRepository.findMethod(userId, type);

        if (!method) {
            throw new Error('Método de recuperação não encontrado.');
        }

        if (method.enabled) {
            return method;
        }

        const updated = await this.recoveryRepository.updateMethod(
            userId,
            type,
            {
                enabled: true,
            },
        );

        await this.auditService.createLog({
            userId,
            action: AuditAction.ENABLE_RECOVERY_METHOD,
            browser: audit?.browser,
            os: audit?.os,
            device: audit?.device,
            ip: audit?.ip,
        });

        return updated;
    }

    async disableMethod(
        userId: string,
        type: RecoveryType,
        audit?: AuditContext,
    ) {
        this.validateUserId(userId);

        const method = await this.recoveryRepository.findMethod(userId, type);

        if (!method) {
            throw new Error('Método de recuperação não encontrado.');
        }

        if (!method.enabled) {
            return method;
        }

        const enabledCount =
            await this.recoveryRepository.countEnabledMethods(userId);

        if (enabledCount <= 1) {
            throw new Error(
                'É necessário manter pelo menos um método de recuperação habilitado.',
            );
        }

        const updated = await this.recoveryRepository.updateMethod(
            userId,
            type,
            {
                enabled: false,
            },
        );

        await this.auditService.createLog({
            userId,
            action: AuditAction.DISABLE_RECOVERY_METHOD,
            browser: audit?.browser,
            os: audit?.os,
            device: audit?.device,
            ip: audit?.ip,
        });

        return updated;
    }

    async getQuestions(userId: string) {
        this.validateUserId(userId);

        return this.recoveryRepository.findQuestions(userId);
    }

    private validateUserId(userId: string): void {
        if (!userId) {
            throw new Error('userId inválido.');
        }
    }
}
