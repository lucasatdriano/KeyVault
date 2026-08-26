import { AuditAction, RecoveryType } from '@/src/generated/prisma/client';

import { DEFAULT_ARGON2_PARAMS } from '@/src/shared/constants/crypto/argon2.constants';
import { generateRecoveryKey } from '@/src/shared/crypto/random';

import { RecoveryRepository } from '@/src/server/database/repositories/recovery.repository';
import { hashPassword } from '@/src/server/crypto/passwordHasher';
import { validateUserId } from '@/src/server/validators/user/user.validator';
import { AuditService } from '@/src/server/services/audit.service';
import { AuditContext } from '@/src/server/types/service/audit';
import { RecoveryQuestionData } from '@/src/server/types/service/recovery';

export class RecoverySettingsService {
    constructor(
        private readonly recoveryRepository: RecoveryRepository,
        private readonly auditService: AuditService,
    ) {}

    async createDefaultMethods(userId: string) {
        validateUserId(userId);

        await this.recoveryRepository.createDefaultMethods(userId);
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

        if (
            type === RecoveryType.RECOVERY_KEY ||
            type === RecoveryType.RECOVERY_PASSWORD
        ) {
            if (!method.secretHash) {
                throw new Error(
                    'Configure o método de recuperação antes de habilitá-lo.',
                );
            }
        }

        if (type === RecoveryType.QUESTIONS) {
            const questionsCount =
                await this.recoveryRepository.countQuestions(userId);

            if (questionsCount === 0) {
                throw new Error(
                    'Configure as perguntas de recuperação antes de habilitá-las.',
                );
            }
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

        const shouldClearSecret =
            type === RecoveryType.RECOVERY_KEY ||
            type === RecoveryType.RECOVERY_PASSWORD;

        const updated = await this.recoveryRepository.updateMethod(
            userId,
            type,
            {
                enabled: false,
                secretHash: shouldClearSecret ? null : method.secretHash,
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

    async configureRecoveryPassword(
        userId: string,
        recoveryPassword: string,
        audit?: AuditContext,
    ) {
        validateUserId(userId);

        const normalizedPassword = recoveryPassword.trim();

        if (!normalizedPassword) {
            throw new Error('A senha de recuperação é obrigatória.');
        }

        const method = await this.recoveryRepository.findMethod(
            userId,
            RecoveryType.RECOVERY_PASSWORD,
        );

        if (!method) {
            throw new Error('Método de recuperação não encontrado.');
        }

        const secretHash = await hashPassword({
            password: normalizedPassword,
            params: DEFAULT_ARGON2_PARAMS,
        });

        const updated = await this.recoveryRepository.updateMethod(
            userId,
            RecoveryType.RECOVERY_PASSWORD,
            {
                enabled: true,
                secretHash,
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

        const recoveryKey = generateRecoveryKey();

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
}
