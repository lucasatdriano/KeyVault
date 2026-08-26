import { RecoveryType } from '@/src/generated/prisma/client';

import { RECOVERY_ORDER } from '@/src/shared/constants/recovery/recovery.constants';
import { generateRandomHex, generateSha256 } from '@/src/shared/crypto/random';

import { RecoveryRepository } from '../../database/repositories/recovery.repository';
import { AuthRepository } from '../../database/repositories/auth.repository';
import { verifyPassword } from '../../crypto/passwordHasher';

export class RecoveryFlowService {
    private readonly SESSION_DURATION = 15 * 60 * 1000;

    constructor(
        private readonly recoveryRepository: RecoveryRepository,
        private readonly authRepository: AuthRepository,
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

        await this.recoveryRepository.deleteExpiredSessions();

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
            await this.recoveryRepository.createChallenge({
                sessionId: session.id,
                type: methods[step],
                step,
                expiresAt,
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
        const { session, challenge } = await this.getCurrentChallenge(token);

        return {
            currentStep: session.currentStep,

            completedSteps: session.completedSteps,

            totalSteps: session.challenges.length,

            type: challenge.type,

            expiresAt: session.expiresAt,
        };
    }

    async verifyRecoveryKeyChallenge(token: string, recoveryKey: string) {
        const { session, challenge } = await this.getCurrentChallenge(
            token,
            RecoveryType.RECOVERY_KEY,
        );

        const method = await this.recoveryRepository.findMethod(
            session.userId,
            RecoveryType.RECOVERY_KEY,
        );

        if (!method || !method.enabled || !method.secretHash) {
            throw new Error('Chave de recuperação indisponível.');
        }

        const isValid = await verifyPassword({
            password: recoveryKey.trim(),
            hash: method.secretHash,
        });

        if (!isValid) {
            throw new Error('Chave de recuperação inválida.');
        }

        return this.completeCurrentChallenge(session.id, challenge.id);
    }

    async getRecoveryQuestionsChallenge(token: string) {
        const { session } = await this.getCurrentChallenge(
            token,
            RecoveryType.QUESTIONS,
        );

        const questions = await this.recoveryRepository.findQuestions(
            session.userId,
        );

        if (questions.length === 0) {
            throw new Error('Nenhuma pergunta de recuperação foi encontrada.');
        }

        return {
            currentStep: session.currentStep,

            completedSteps: session.completedSteps,

            totalSteps: session.challenges.length,

            questions: questions.map((question) => ({
                id: question.id,

                questionCipherText: question.questionCipherText,

                questionIv: question.questionIv,
            })),
        };
    }

    async verifyQuestionsChallenge(token: string, answers: string[]) {
        const { session, challenge } = await this.getCurrentChallenge(
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
            const answer = answers[index];

            if (!answer?.trim()) {
                throw new Error('Todas as perguntas precisam ser respondidas.');
            }

            const normalizedAnswer = answer.trim().toLowerCase();

            const isValid = await verifyPassword({
                password: normalizedAnswer,

                hash: questions[index].answerHash,
            });

            if (!isValid) {
                throw new Error('Uma ou mais respostas estão incorretas.');
            }
        }

        return this.completeCurrentChallenge(session.id, challenge.id);
    }

    private async getCurrentChallenge(
        token: string,
        expectedType?: RecoveryType,
    ) {
        if (!token?.trim()) {
            throw new Error('Token de recuperação inválido.');
        }

        const tokenHash = await generateSha256(token);

        const session =
            await this.recoveryRepository.findActiveSessionByTokenHash(
                tokenHash,
            );

        if (!session) {
            throw new Error('Sessão de recuperação inválida ou expirada.');
        }

        const challenge = session.challenges.find(
            (item) => item.step === session.currentStep,
        );

        if (!challenge) {
            throw new Error(
                'Nenhum método de recuperação pendente foi encontrado.',
            );
        }

        if (challenge.completedAt) {
            throw new Error('Este método de recuperação já foi concluído.');
        }

        if (expectedType && challenge.type !== expectedType) {
            throw new Error('Este não é o método de recuperação atual.');
        }

        return {
            session,
            challenge,
        };
    }

    private async completeCurrentChallenge(
        sessionId: string,
        challengeId: string,
    ) {
        const session = await this.recoveryRepository.findSession(sessionId);

        if (!session) {
            throw new Error('Sessão de recuperação não encontrada.');
        }

        if (session.completedAt) {
            throw new Error('Esta recuperação já foi concluída.');
        }

        const challenge = session.challenges.find(
            (item) => item.id === challengeId,
        );

        if (!challenge) {
            throw new Error('Desafio de recuperação não encontrado.');
        }

        if (challenge.completedAt) {
            throw new Error('Este desafio já foi concluído.');
        }

        if (challenge.step !== session.currentStep) {
            throw new Error('Este não é o desafio de recuperação atual.');
        }

        await this.recoveryRepository.completeChallenge(challenge.id);

        const completedSteps = session.completedSteps + 1;

        const totalSteps = session.challenges.length;

        const isCompleted = completedSteps >= totalSteps;

        const nextStep = isCompleted
            ? session.currentStep
            : session.currentStep + 1;

        await this.recoveryRepository.updateSession(session.id, {
            currentStep: nextStep,
            completedSteps,

            completedAt: isCompleted ? new Date() : null,
        });

        const nextChallenge = isCompleted
            ? null
            : session.challenges.find((item) => item.step === nextStep);

        return {
            completed: isCompleted,

            nextMethod: nextChallenge?.type ?? null,

            currentStep: nextStep,

            completedSteps,

            totalSteps,

            expiresAt: session.expiresAt,
        };
    }
}
