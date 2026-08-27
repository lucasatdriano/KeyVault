import { RecoveryType } from '@/src/generated/prisma/client';

import {
    RECOVERY_MAX_ATTEMPTS,
    RECOVERY_ORDER,
} from '@/src/shared/constants/recovery/recovery.constants';

import { generateRandomHex, generateSha256 } from '@/src/shared/crypto/random';

import { RecoveryRepository } from '@/src/server/database/repositories/recovery.repository';
import { AuthRepository } from '@/src/server/database/repositories/auth.repository';

import {
    hashPassword,
    verifyPassword,
} from '@/src/server/crypto/passwordHasher';

import { RecoverySessionService } from '@/src/server/services/recovery/recovery-session.service';

import { decryptString } from '@/src/shared/crypto/cipher';

import { UserRepository } from '../../database/repositories/user.repository';

import {
    decryptRecoveryDataKey,
    decryptRecoveryVaultKey,
} from '@/src/shared/crypto/recovery';

import { DEFAULT_ARGON2_PARAMS } from '@/src/shared/constants/crypto/argon2.constants';

import { validateNewPasswordData } from '../../validators/auth/auth.validator';

import { encryptVaultKey } from '@/src/shared/crypto/vault';

export class RecoveryFlowService {
    private readonly SESSION_DURATION = 15 * 60 * 1000;

    constructor(
        private readonly recoveryRepository: RecoveryRepository,
        private readonly authRepository: AuthRepository,
        private readonly userRepository: UserRepository,
        private readonly recoverySessionService: RecoverySessionService,
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

        const enabledMethods = await this.recoveryRepository.findEnabledMethods(
            user.id,
        );

        const methods = RECOVERY_ORDER.filter((type) =>
            enabledMethods.some((method) => method.type === type),
        );

        if (methods.length === 0) {
            throw new Error('Nenhum método de recuperação está habilitado.');
        }

        await this.recoveryRepository.expireExpiredSessions();

        const expiresAt = new Date(Date.now() + this.SESSION_DURATION);

        const token = generateRandomHex(32);

        const tokenHash = await generateSha256(token);

        const session = await this.recoveryRepository.createSession({
            userId: user.id,
            tokenHash,
            expiresAt,
            currentStep: 0,
            completedSteps: 0,
        });

        for (let step = 0; step < methods.length; step++) {
            const type = methods[step];

            await this.recoveryRepository.createChallenge({
                sessionId: session.id,
                type,
                step,
                expiresAt,
                attempts: 0,
                maxAttempts: RECOVERY_MAX_ATTEMPTS[type],
            });
        }

        return {
            token,
            totalSteps: methods.length,
            currentStep: session.currentStep,
            nextMethod: methods[0],
            expiresAt,
        };
    }

    async getCurrentRecoveryChallenge(token: string) {
        const { session, challenge } =
            await this.recoverySessionService.getCurrentChallenge(token);

        return {
            currentStep: session.currentStep,
            completedSteps: session.completedSteps,
            totalSteps: session.challenges.length,
            type: challenge.type,
            attempts: challenge.attempts,
            maxAttempts: challenge.maxAttempts,
            remainingAttempts: Math.max(
                challenge.maxAttempts - challenge.attempts,
                0,
            ),
            expiresAt: session.expiresAt,
        };
    }

    async verifyRecoveryKeyChallenge(token: string, recoveryKey: string) {
        return this.verifySecretChallenge(
            token,
            recoveryKey.trim(),
            RecoveryType.RECOVERY_KEY,
            'Chave de recuperação',
        );
    }

    async verifyRecoveryPasswordChallenge(
        token: string,
        recoveryPassword: string,
    ) {
        return this.verifySecretChallenge(
            token,
            recoveryPassword,
            RecoveryType.RECOVERY_PASSWORD,
            'Senha de recuperação',
        );
    }

    async getRecoveryQuestionsChallenge(token: string) {
        const { session, challenge } =
            await this.recoverySessionService.getCurrentChallenge(
                token,
                RecoveryType.QUESTIONS,
            );

        const questions = await this.recoveryRepository.findQuestions(
            session.userId,
        );

        if (questions.length === 0) {
            throw new Error('Nenhuma pergunta de recuperação foi encontrada.');
        }

        const user = await this.userRepository.findById(session.userId);

        if (!user) {
            throw new Error('Usuário não encontrado.');
        }

        const recoveryData = await this.recoveryRepository.findRecoveryData(
            session.userId,
        );

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
            const decryptedQuestions = await Promise.all(
                questions.map(async (question) => ({
                    id: question.id,

                    question: await decryptString(
                        {
                            cipherText: question.questionCipherText,
                            iv: question.questionIv,
                        },
                        recoveryDataKey,
                    ),
                })),
            );

            return {
                currentStep: session.currentStep,

                completedSteps: session.completedSteps,

                totalSteps: session.challenges.length,

                attempts: challenge.attempts,

                maxAttempts: challenge.maxAttempts,

                remainingAttempts: Math.max(
                    challenge.maxAttempts - challenge.attempts,
                    0,
                ),

                questions: decryptedQuestions,
            };
        } finally {
            recoveryDataKey.fill(0);
        }
    }

    async verifyQuestionsChallenge(token: string, answers: string[]) {
        const { session, challenge } =
            await this.recoverySessionService.getCurrentChallenge(
                token,
                RecoveryType.QUESTIONS,
            );

        const questions = await this.recoveryRepository.findQuestions(
            session.userId,
        );

        if (questions.length === 0) {
            throw new Error('Nenhuma pergunta de recuperação foi encontrada.');
        }

        if (answers.length !== questions.length) {
            throw new Error('Todas as perguntas precisam ser respondidas.');
        }

        for (let index = 0; index < questions.length; index++) {
            const answer = answers[index]?.trim();

            if (!answer) {
                throw new Error('Todas as perguntas precisam ser respondidas.');
            }

            const isValid = await verifyPassword({
                password: answer.toLowerCase(),

                hash: questions[index].answerHash,
            });

            if (!isValid) {
                return this.handleFailedAttempt(
                    session.id,
                    challenge.id,
                    'Uma ou mais respostas estão incorretas.',
                );
            }
        }

        return this.recoverySessionService.completeCurrentChallenge(
            session.id,
            challenge.id,
        );
    }

    async resetPassword(token: string, newPassword: string) {
        validateNewPasswordData(newPassword);

        const session =
            await this.recoverySessionService.getCompletedSessionByToken(token);

        const user = await this.authRepository.findUserById(session.userId);

        if (!user) {
            throw new Error('Usuário não encontrado.');
        }

        const recoveryData = await this.recoveryRepository.findRecoveryData(
            user.id,
        );

        if (!recoveryData) {
            throw new Error('Dados de recuperação não encontrados.');
        }

        if (!recoveryData.vaultKeyCipherText || !recoveryData.vaultKeyIv) {
            throw new Error(
                'A chave do cofre não está disponível para recuperação.',
            );
        }

        const recoveryDataKey = await decryptRecoveryDataKey({
            encryptedDataKey: recoveryData.encryptedDataKey,
            iv: recoveryData.iv,
            salt: recoveryData.salt,
            email: user.email,
        });

        try {
            const vaultKey = await decryptRecoveryVaultKey(
                {
                    cipherText: recoveryData.vaultKeyCipherText,
                    iv: recoveryData.vaultKeyIv,
                },
                recoveryDataKey,
            );

            try {
                const newEncryptedVault = await encryptVaultKey(
                    vaultKey,
                    newPassword,
                    DEFAULT_ARGON2_PARAMS,
                );

                const newPasswordHash = await hashPassword({
                    password: newPassword,
                    params: DEFAULT_ARGON2_PARAMS,
                });

                await this.authRepository.updatePassword(
                    user.id,
                    newPasswordHash,
                );

                await this.authRepository.updateVaultKey(
                    user.id,
                    JSON.stringify(newEncryptedVault),
                );

                await this.recoverySessionService.completeRecovery(session.id);
            } finally {
                vaultKey.fill(0);
            }
        } finally {
            recoveryDataKey.fill(0);
        }

        return {
            success: true,
        };
    }

    private async verifySecretChallenge(
        token: string,
        secret: string,
        type: RecoveryType,
        label: string,
    ) {
        if (!secret) {
            throw new Error(`${label} é obrigatória.`);
        }

        const { session, challenge } =
            await this.recoverySessionService.getCurrentChallenge(token, type);

        const method = await this.recoveryRepository.findMethod(
            session.userId,
            type,
        );

        if (!method || !method.enabled || !method.secretHash) {
            throw new Error(`${label} indisponível.`);
        }

        const isValid = await verifyPassword({
            password: secret,
            hash: method.secretHash,
        });

        if (!isValid) {
            return this.handleFailedAttempt(
                session.id,
                challenge.id,
                `${label} inválida.`,
            );
        }

        return this.recoverySessionService.completeCurrentChallenge(
            session.id,
            challenge.id,
        );
    }

    private async handleFailedAttempt(
        sessionId: string,
        challengeId: string,
        message: string,
    ): Promise<never> {
        const result = await this.recoverySessionService.registerFailedAttempt(
            sessionId,
            challengeId,
        );

        if (result.failed) {
            throw new Error(
                'O número máximo de tentativas foi atingido. Inicie uma nova recuperação.',
            );
        }

        throw new Error(
            `${message} Você ainda possui ${result.remainingAttempts} tentativa(s).`,
        );
    }
}
