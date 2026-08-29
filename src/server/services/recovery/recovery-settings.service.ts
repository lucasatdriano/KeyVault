import { AuditAction, RecoveryType } from '@/src/generated/prisma/client';

import { DEFAULT_ARGON2_PARAMS } from '@/src/shared/constants/crypto/argon2.constants';
import { generateRecoveryKey } from '@/src/shared/crypto/random';
import { decryptRecoveryDataKey } from '@/src/shared/crypto/recovery';
import { decryptString, encryptString } from '@/src/shared/crypto/cipher';
import { mapRecoveryType } from '@/src/shared/utils/recovery/recovery.mapper';
import { RecoveryDataPayload } from '@/src/shared/types/recovery';

import { RecoveryRepository } from '@/src/server/database/repositories/recovery.repository';
import { UserRepository } from '@/src/server/database/repositories/user.repository';
import { AuditService } from '@/src/server/services/audit.service';
import { hashPassword } from '@/src/server/crypto/passwordHasher';
import { validateUserId } from '@/src/server/validators/user/user.validator';
import { AuditContext } from '@/src/server/types/service/audit';
import { RecoveryQuestionData } from '@/src/server/types/service/recovery';

export class RecoverySettingsService {
    constructor(
        private readonly recoveryRepository: RecoveryRepository,
        private readonly userRepository: UserRepository,
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
            recoveryMethodId: method.id,
            resource: mapRecoveryType(type),
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
            recoveryMethodId: method.id,
            resource: mapRecoveryType(type),
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

    async getDecryptedQuestions(userId: string) {
        validateUserId(userId);

        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new Error('Usuário não encontrado.');
        }

        const recoveryData =
            await this.recoveryRepository.findRecoveryData(userId);

        if (!recoveryData) {
            throw new Error('Dados de recuperação não encontrados.');
        }

        const recoveryDataKey = await decryptRecoveryDataKey({
            encryptedDataKey: recoveryData.encryptedDataKey,
            iv: recoveryData.iv,
            salt: recoveryData.salt,
            email: user.email,
        });

        try {
            const questions =
                await this.recoveryRepository.findQuestions(userId);

            return Promise.all(
                questions.map(async (question) => {
                    const decryptedQuestion = await decryptString(
                        {
                            cipherText: question.questionCipherText,
                            iv: question.questionIv,
                        },
                        recoveryDataKey,
                    );

                    return {
                        id: question.id,
                        question: decryptedQuestion,
                    };
                }),
            );
        } finally {
            recoveryDataKey.fill(0);
        }
    }

    async configureQuestions(
        userId: string,
        questions: RecoveryQuestionData[],
        recoveryData: RecoveryDataPayload,
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

        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new Error('Usuário não encontrado.');
        }

        const existingRecoveryData =
            await this.recoveryRepository.findRecoveryData(userId);

        let recoveryDataKey: Uint8Array;

        if (!existingRecoveryData) {
            await this.createRecoveryDataIfNeeded(userId, recoveryData);

            recoveryDataKey = await decryptRecoveryDataKey({
                encryptedDataKey: recoveryData.encryptedDataKey,
                iv: recoveryData.iv,
                salt: recoveryData.salt,
                email: user.email,
            });
        } else {
            recoveryDataKey = await decryptRecoveryDataKey({
                encryptedDataKey: existingRecoveryData.encryptedDataKey,
                iv: existingRecoveryData.iv,
                salt: existingRecoveryData.salt,
                email: user.email,
            });
        }

        try {
            await this.recoveryRepository.deleteQuestions(userId);

            for (const question of questions) {
                const normalizedAnswer = question.answer.trim().toLowerCase();

                if (!normalizedAnswer) {
                    throw new Error(
                        'Todas as perguntas precisam possuir uma resposta.',
                    );
                }

                const encryptedQuestion = await encryptString(
                    question.question,
                    recoveryDataKey,
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
        } finally {
            recoveryDataKey.fill(0);
        }
    }

    async configureRecoveryPassword(
        userId: string,
        recoveryPassword: string,
        recoveryData: RecoveryDataPayload,
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

        await this.createRecoveryDataIfNeeded(userId, recoveryData);

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
        recoveryData: RecoveryDataPayload,
        audit?: AuditContext,
    ): Promise<string> {
        validateUserId(userId);

        const method = await this.recoveryRepository.findMethod(
            userId,
            RecoveryType.RECOVERY_KEY,
        );

        if (!method) {
            throw new Error('Método de recuperação não encontrado.');
        }

        await this.createRecoveryDataIfNeeded(userId, recoveryData);

        const recoveryKey = generateRecoveryKey();

        const secretHash = await hashPassword({
            password: recoveryKey,
            params: DEFAULT_ARGON2_PARAMS,
        });

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

        return recoveryKey;
    }

    private async createRecoveryDataIfNeeded(
        userId: string,
        recoveryData: RecoveryDataPayload,
    ) {
        const existingRecoveryData =
            await this.recoveryRepository.findRecoveryData(userId);

        if (existingRecoveryData) {
            return existingRecoveryData;
        }

        return this.recoveryRepository.createRecoveryData({
            userId,
            encryptedDataKey: recoveryData.encryptedDataKey,
            iv: recoveryData.iv,
            salt: recoveryData.salt,
            vaultKeyCipherText: recoveryData.vaultKeyCipherText,
            vaultKeyIv: recoveryData.vaultKeyIv,
        });
    }
}
