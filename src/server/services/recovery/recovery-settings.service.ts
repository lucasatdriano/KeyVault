import { AuditAction, RecoveryType } from '@/src/generated/prisma/client';

import { DEFAULT_ARGON2_PARAMS } from '@/src/shared/constants/crypto/argon2.constants';
import { generateRandomHex } from '@/src/shared/crypto/random';

import { RecoveryRepository } from '../../database/repositories/recovery.repository';
import { hashPassword, verifyPassword } from '../../crypto/passwordHasher';
import { validateUserId } from '../../validators/user/user.validator';
import { AuditService } from '../audit.service';
import { AuditContext } from '../../types/service/audit';
import { RecoveryQuestionData } from '../../types/repository/recovery';

export class RecoverySettingsService {
    constructor(
        private readonly recoveryRepository: RecoveryRepository,
        private readonly auditService: AuditService,
    ) {}

    async createDefaultMethods(userId: string) {
        validateUserId(userId);

        const recoveryTypes = Object.values(RecoveryType);

        for (const type of recoveryTypes) {
            const existingMethod = await this.recoveryRepository.findMethod(
                userId,
                type,
            );

            if (existingMethod) {
                continue;
            }

            await this.recoveryRepository.createMethod({
                userId,
                type,
                enabled: false,
                secretHash: null,
            });
        }
    }

    async getEnabledMethods(userId: string) {
        validateUserId(userId);

        return this.recoveryRepository.findEnabledMethods(userId);
    }

    async getMethods(userId: string) {
        validateUserId(userId);

        return this.recoveryRepository.findMethodsByUserId(userId);
    }

    async enableMethod(
        userId: string,
        type: RecoveryType,
        audit?: AuditContext,
    ) {
        validateUserId(userId);

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
        validateUserId(userId);

        const method = await this.recoveryRepository.findMethod(userId, type);

        if (!method) {
            throw new Error('Método de recuperação não encontrado.');
        }

        if (!method.enabled) {
            return method;
        }

        const updated = await this.recoveryRepository.updateMethod(
            userId,
            type,
            {
                enabled: false,

                secretHash:
                    type === RecoveryType.RECOVERY_KEY
                        ? null
                        : method.secretHash,
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
        validateUserId(userId);

        return this.recoveryRepository.findQuestions(userId);
    }

    async configureQuestions(
        userId: string,
        questions: RecoveryQuestionData[],
        audit?: AuditContext,
    ) {
        validateUserId(userId);

        if (questions.length === 0) {
            throw new Error(
                'É necessário informar pelo menos uma pergunta de recuperação.',
            );
        }

        const method = await this.recoveryRepository.findMethod(
            userId,
            RecoveryType.QUESTIONS,
        );

        if (!method) {
            throw new Error('Método de recuperação não encontrado.');
        }

        await this.recoveryRepository.deleteQuestions(userId);

        for (const question of questions) {
            const normalizedAnswer = question.answer.trim().toLowerCase();

            const answerHash = await hashPassword({
                password: normalizedAnswer,
                params: DEFAULT_ARGON2_PARAMS,
            });

            await this.recoveryRepository.createQuestion({
                userId,
                questionCipherText: question.questionCipherText,
                questionIv: question.questionIv,
                answerHash,
            });
        }

        const updated = await this.recoveryRepository.updateMethod(
            userId,
            RecoveryType.QUESTIONS,
            {
                enabled: true,
            },
        );

        if (!method.enabled) {
            await this.auditService.createLog({
                userId,
                action: AuditAction.ENABLE_RECOVERY_METHOD,
                browser: audit?.browser,
                os: audit?.os,
                device: audit?.device,
                ip: audit?.ip,
            });
        }

        return updated;
    }

    async generateRecoveryKey(
        userId: string,
        audit?: AuditContext,
    ): Promise<string> {
        validateUserId(userId);

        const recoveryKey = this.generateRecoveryKeyValue();

        const secretHash = await hashPassword({
            password: recoveryKey,
            params: DEFAULT_ARGON2_PARAMS,
        });

        const method = await this.recoveryRepository.findMethod(
            userId,
            RecoveryType.RECOVERY_KEY,
        );

        if (!method) {
            throw new Error('Método de recuperação não encontrado.');
        }

        await this.recoveryRepository.updateMethod(
            userId,
            RecoveryType.RECOVERY_KEY,
            {
                enabled: true,
                secretHash,
            },
        );

        await this.auditService.createLog({
            userId,
            action: AuditAction.GENERATE_RECOVERY_KEY,
            browser: audit?.browser,
            os: audit?.os,
            device: audit?.device,
            ip: audit?.ip,
        });

        if (!method.enabled) {
            await this.auditService.createLog({
                userId,
                action: AuditAction.ENABLE_RECOVERY_METHOD,
                browser: audit?.browser,
                os: audit?.os,
                device: audit?.device,
                ip: audit?.ip,
            });
        }

        return recoveryKey;
    }

    async validateRecoveryKey(
        userId: string,
        recoveryKey: string,
    ): Promise<boolean> {
        validateUserId(userId);

        const method = await this.recoveryRepository.findMethod(
            userId,
            RecoveryType.RECOVERY_KEY,
        );

        if (!method || !method.enabled || !method.secretHash) {
            return false;
        }

        return verifyPassword({
            password: recoveryKey,
            hash: method.secretHash,
        });
    }

    private generateRecoveryKeyValue(): string {
        const segments = Array.from({ length: 3 }, () =>
            generateRandomHex(3).toUpperCase(),
        );

        return `KV-${segments.join('-')}`;
    }
}
