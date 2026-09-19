import { AuditAction, RecoveryType } from '@/src/generated/prisma/client';

import { DEFAULT_ARGON2_PARAMS } from '@/src/shared/constants/crypto/argon2.constants';
import { decryptString, encryptString } from '@/src/shared/crypto/cipher';
import { deriveQuestionEncryptionKey } from '@/src/shared/crypto/recovery';
import { mapRecoveryType } from '@/src/shared/utils/recovery/recovery.mapper';
import { RecoveryDataPayload } from '@/src/shared/types/recovery';

import { RecoveryRepository } from '@/src/server/database/repositories/recovery.repository';
import { AuditService } from '@/src/server/services/audit.service';
import {
    hashPassword,
    verifyPassword,
} from '@/src/server/crypto/passwordHasher';
import { validateUserId } from '@/src/server/validators/user/user.validator';
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

        if (type === RecoveryType.QUESTIONS) {
            await this.recoveryRepository.deleteQuestions(userId);
        }

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
            recoveryMethodId: method.id,
            resource: mapRecoveryType(type),
            browser: audit?.browser,
            os: audit?.os,
            device: audit?.device,
            ip: audit?.ip,
        });

        return updated;
    }

    async getDecryptedQuestions(userId: string, userEmail: string) {
        validateUserId(userId);

        const questions = await this.recoveryRepository.findQuestions(userId);

        const questionEncryptionKey =
            await deriveQuestionEncryptionKey(userEmail);

        try {
            return await Promise.all(
                questions.map(async (question) => ({
                    id: question.id,
                    question: await decryptString(
                        {
                            cipherText: question.questionCipherText,
                            iv: question.questionIv,
                        },
                        questionEncryptionKey,
                    ),
                })),
            );
        } finally {
            questionEncryptionKey.fill(0);
        }
    }

    async configureQuestions(
        userId: string,
        userEmail: string,
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

        const questionEncryptionKey =
            await deriveQuestionEncryptionKey(userEmail);

        try {
            await this.recoveryRepository.deleteQuestions(userId);

            for (const question of questions) {
                const normalizedQuestion = question.question.trim();
                const normalizedAnswer = question.answer.trim().toLowerCase();

                if (!normalizedQuestion) {
                    throw new Error(
                        'Todas as perguntas precisam possuir uma pergunta válida.',
                    );
                }

                if (!normalizedAnswer) {
                    throw new Error(
                        'Todas as perguntas precisam possuir uma resposta.',
                    );
                }

                const encryptedQuestion = await encryptString(
                    normalizedQuestion,
                    questionEncryptionKey,
                );

                const answerHash = await hashPassword({
                    password: normalizedAnswer,
                    params: DEFAULT_ARGON2_PARAMS,
                });

                await this.recoveryRepository.createQuestion({
                    userId,
                    questionCipherText: encryptedQuestion.cipherText,
                    questionIv: encryptedQuestion.iv,
                    answerHash,
                });
            }
        } finally {
            questionEncryptionKey.fill(0);
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
                recoveryMethodId: method.id,
                resource: mapRecoveryType(method.type),
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
                recoveryMethodId: method.id,
                resource: mapRecoveryType(method.type),
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
        recoveryKeyHash: string,
        audit?: AuditContext,
    ) {
        validateUserId(userId);

        if (!recoveryKeyHash?.trim()) {
            throw new Error('Hash da chave de recuperação não encontrado.');
        }

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
                secretHash: recoveryKeyHash,
            },
        );

        await this.auditService.createLog({
            userId,
            action: AuditAction.GENERATE_RECOVERY_KEY,
            recoveryMethodId: method.id,
            resource: mapRecoveryType(method.type),
            browser: audit?.browser,
            os: audit?.os,
            device: audit?.device,
            ip: audit?.ip,
        });

        if (!method.enabled) {
            await this.auditService.createLog({
                userId,
                action: AuditAction.ENABLE_RECOVERY_METHOD,
                recoveryMethodId: method.id,
                resource: mapRecoveryType(method.type),
                browser: audit?.browser,
                os: audit?.os,
                device: audit?.device,
                ip: audit?.ip,
            });
        }
    }

    async updateRecoveryData(
        userId: string,
        recoveryData: RecoveryDataPayload,
    ) {
        validateUserId(userId);

        if (!recoveryData.salt) {
            throw new Error('Salt de recuperação não encontrado.');
        }

        if (!recoveryData.vaultKeyCipherText) {
            throw new Error('Vault Key de recuperação não encontrada.');
        }

        if (!recoveryData.vaultKeyIv) {
            throw new Error('IV da Vault Key de recuperação não encontrado.');
        }

        return this.recoveryRepository.upsertRecoveryData(userId, {
            salt: recoveryData.salt,
            vaultKeyCipherText: recoveryData.vaultKeyCipherText,
            vaultKeyIv: recoveryData.vaultKeyIv,
        });
    }

    async deleteRecoveryData(userId: string) {
        validateUserId(userId);

        const enabledCount =
            await this.recoveryRepository.countEnabledMethods(userId);

        if (enabledCount > 0) {
            throw new Error(
                'Não é possível remover os dados de recuperação enquanto houver métodos habilitados.',
            );
        }

        await this.recoveryRepository.deleteRecoveryData(userId);
    }

    async verifyRecoveryPassword(
        userId: string,
        recoveryPassword: string,
    ): Promise<boolean> {
        validateUserId(userId);

        const method = await this.recoveryRepository.findMethod(
            userId,
            RecoveryType.RECOVERY_PASSWORD,
        );

        if (!method?.enabled || !method.secretHash) {
            throw new Error('Senha de recuperação indisponível.');
        }

        return verifyPassword({
            password: recoveryPassword.trim(),
            hash: method.secretHash,
        });
    }

    async verifyRecoveryKey(
        userId: string,
        recoveryKey: string,
    ): Promise<boolean> {
        validateUserId(userId);

        const method = await this.recoveryRepository.findMethod(
            userId,
            RecoveryType.RECOVERY_KEY,
        );

        if (!method?.enabled || !method.secretHash) {
            throw new Error('Chave de recuperação indisponível.');
        }

        return verifyPassword({
            password: recoveryKey.trim(),
            hash: method.secretHash,
        });
    }

    async verifyQuestionsAnswers(
        userId: string,
        answers: string[],
    ): Promise<boolean> {
        validateUserId(userId);

        const questions = await this.recoveryRepository.findQuestions(userId);

        if (questions.length < 2 || answers.length !== questions.length) {
            return false;
        }

        for (let index = 0; index < questions.length; index++) {
            const answer = answers[index]?.trim().toLowerCase();

            if (!answer) {
                return false;
            }

            const isValid = await verifyPassword({
                password: answer,
                hash: questions[index].answerHash,
            });

            if (!isValid) {
                return false;
            }
        }

        return true;
    }
}
