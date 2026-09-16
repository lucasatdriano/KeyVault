import { RecoveryType } from '@/src/generated/prisma/client';

import {
    RECOVERY_MAX_ATTEMPTS,
    RECOVERY_ORDER,
} from '@/src/shared/constants/recovery/recovery.constants';
import { DEFAULT_ARGON2_PARAMS } from '@/src/shared/constants/crypto/argon2.constants';
import { generateRandomHex, generateSha256 } from '@/src/shared/crypto/random';
import { deriveArgon2Key } from '@/src/shared/crypto/argon2';
import { decryptString } from '@/src/shared/crypto/cipher';

import { RecoveryRepository } from '@/src/server/database/repositories/recovery.repository';
import { AuthRepository } from '@/src/server/database/repositories/auth.repository';
import { UserRepository } from '@/src/server/database/repositories/user.repository';
import { RecoverySessionService } from '@/src/server/services/recovery/recovery-session.service';
import {
    hashPassword,
    verifyPassword,
} from '@/src/server/crypto/passwordHasher';
import { validateNewPasswordData } from '@/src/server/validators/auth/auth.validator';

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

        if (!normalizedEmail) {
            throw new Error('E-mail inválido.');
        }

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

    async getRecoveryDataForReset(token: string) {
        const session =
            await this.recoverySessionService.getCompletedSessionByToken(token);

        const recoveryData = await this.recoveryRepository.findRecoveryData(
            session.userId,
        );

        if (!recoveryData) {
            throw new Error('Dados de recuperação não encontrados.');
        }

        if (
            !recoveryData.vaultKeyCipherText ||
            !recoveryData.vaultKeyIv ||
            !recoveryData.salt
        ) {
            throw new Error(
                'A chave do cofre não está disponível para recuperação.',
            );
        }

        return {
            salt: recoveryData.salt,
            vaultKeyCipherText: recoveryData.vaultKeyCipherText,
            vaultKeyIv: recoveryData.vaultKeyIv,
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
            recoveryPassword.trim(),
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

        if (questions.length < 2) {
            throw new Error(
                'As perguntas de recuperação não estão configuradas corretamente.',
            );
        }

        const user = await this.userRepository.findById(session.userId);

        if (!user) {
            throw new Error('Usuário não encontrado.');
        }

        const questionEncryptionKey = await this.deriveQuestionEncryptionKey(
            user.email,
        );

        try {
            const decryptedQuestions = await Promise.all(
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
            questionEncryptionKey.fill(0);
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

        if (questions.length < 2) {
            throw new Error(
                'As perguntas de recuperação não estão configuradas corretamente.',
            );
        }

        if (answers.length !== questions.length) {
            throw new Error('Todas as perguntas precisam ser respondidas.');
        }

        for (let index = 0; index < questions.length; index++) {
            const answer = answers[index]?.trim().toLowerCase();

            if (!answer) {
                throw new Error('Todas as perguntas precisam ser respondidas.');
            }

            const isValid = await verifyPassword({
                password: answer,
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

    async resetPassword(
        token: string,
        newPassword: string,
        newEncryptedVault: string,
    ) {
        validateNewPasswordData(newPassword);

        if (!newEncryptedVault?.trim()) {
            throw new Error('Vault Key criptografada não encontrada.');
        }

        const session =
            await this.recoverySessionService.getCompletedSessionByToken(token);

        if (session.completedSteps !== session.challenges.length) {
            throw new Error('A recuperação ainda não foi concluída.');
        }

        const user = await this.authRepository.findUserById(session.userId);

        if (!user) {
            throw new Error('Usuário não encontrado.');
        }

        const newPasswordHash = await hashPassword({
            password: newPassword,
            params: DEFAULT_ARGON2_PARAMS,
        });

        await this.authRepository.updatePassword(user.id, newPasswordHash);

        await this.authRepository.updateVaultKey(user.id, newEncryptedVault);

        await this.recoverySessionService.completeRecovery(session.id);

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

    private async deriveQuestionEncryptionKey(
        email: string,
    ): Promise<Uint8Array> {
        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail) {
            throw new Error('E-mail inválido.');
        }

        const keyMaterial = `keyvault:recovery:questions:${normalizedEmail}`;

        const encoder = new TextEncoder();

        const salt = encoder.encode('keyvault:recovery:questions:v1');

        return deriveArgon2Key({
            password: keyMaterial,
            salt,
            params: DEFAULT_ARGON2_PARAMS,
            hashLength: 32,
        });
    }
}
