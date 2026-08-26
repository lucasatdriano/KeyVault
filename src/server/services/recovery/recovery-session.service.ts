import {
    RecoverySessionStatus,
    RecoveryType,
} from '@/src/generated/prisma/client';

import { generateSha256 } from '@/src/shared/crypto/random';

import { RecoveryRepository } from '@/src/server/database/repositories/recovery.repository';

export class RecoverySessionService {
    constructor(private readonly recoveryRepository: RecoveryRepository) {}

    async getCurrentChallenge(token: string, expectedType?: RecoveryType) {
        if (!token?.trim()) {
            throw new Error('Token de recuperação inválido.');
        }

        const tokenHash = await generateSha256(token);

        const session =
            await this.recoveryRepository.findSessionByTokenHash(tokenHash);

        if (!session) {
            throw new Error('Sessão de recuperação inválida.');
        }

        if (session.status === RecoverySessionStatus.COMPLETED) {
            throw new Error('Esta recuperação já foi concluída.');
        }

        if (session.status === RecoverySessionStatus.FAILED) {
            throw new Error(
                'Esta sessão de recuperação falhou. Inicie uma nova recuperação.',
            );
        }

        if (session.status === RecoverySessionStatus.EXPIRED) {
            throw new Error(
                'Esta sessão de recuperação expirou. Inicie uma nova recuperação.',
            );
        }

        if (session.expiresAt <= new Date()) {
            await this.recoveryRepository.updateSession(session.id, {
                status: RecoverySessionStatus.EXPIRED,
            });

            throw new Error(
                'Esta sessão de recuperação expirou. Inicie uma nova recuperação.',
            );
        }

        if (session.status !== RecoverySessionStatus.ACTIVE) {
            throw new Error('Esta sessão de recuperação não está disponível.');
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

        if (challenge.expiresAt <= new Date()) {
            await this.recoveryRepository.updateSession(session.id, {
                status: RecoverySessionStatus.EXPIRED,
            });

            throw new Error('Esta sessão de recuperação expirou.');
        }

        if (challenge.attempts >= challenge.maxAttempts) {
            await this.recoveryRepository.updateSession(session.id, {
                status: RecoverySessionStatus.FAILED,
            });

            throw new Error('O número máximo de tentativas foi atingido.');
        }

        if (expectedType && challenge.type !== expectedType) {
            throw new Error('Este não é o método de recuperação atual.');
        }

        return {
            session,
            challenge,
        };
    }

    async completeCurrentChallenge(sessionId: string, challengeId: string) {
        const session = await this.recoveryRepository.findSession(sessionId);

        if (!session) {
            throw new Error('Sessão de recuperação não encontrada.');
        }

        if (session.status !== RecoverySessionStatus.ACTIVE) {
            throw new Error('Esta sessão de recuperação não está ativa.');
        }

        if (session.expiresAt <= new Date()) {
            await this.recoveryRepository.updateSession(session.id, {
                status: RecoverySessionStatus.EXPIRED,
            });

            throw new Error('Esta sessão de recuperação expirou.');
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
            status: isCompleted
                ? RecoverySessionStatus.COMPLETED
                : RecoverySessionStatus.ACTIVE,
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

    async registerFailedAttempt(sessionId: string, challengeId: string) {
        const session = await this.recoveryRepository.findSession(sessionId);

        if (!session) {
            throw new Error('Sessão de recuperação não encontrada.');
        }

        if (session.status !== RecoverySessionStatus.ACTIVE) {
            throw new Error('Esta sessão de recuperação não está ativa.');
        }

        const challenge = session.challenges.find(
            (item) => item.id === challengeId,
        );

        if (!challenge) {
            throw new Error('Desafio de recuperação não encontrado.');
        }

        if (challenge.step !== session.currentStep) {
            throw new Error('Este não é o desafio de recuperação atual.');
        }

        const attempts = challenge.attempts + 1;

        const failed = attempts >= challenge.maxAttempts;

        await this.recoveryRepository.updateChallenge(challenge.id, {
            attempts,
        });

        if (failed) {
            await this.recoveryRepository.updateSession(session.id, {
                status: RecoverySessionStatus.FAILED,
            });
        }

        return {
            attempts,
            maxAttempts: challenge.maxAttempts,

            remainingAttempts: Math.max(challenge.maxAttempts - attempts, 0),

            failed,
        };
    }
}
