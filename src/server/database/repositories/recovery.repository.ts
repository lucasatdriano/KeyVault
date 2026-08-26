import {
    PrismaClient,
    RecoveryChallenge,
    RecoveryMethod,
    RecoveryQuestion,
    RecoverySession,
    RecoveryType,
} from '@/src/generated/prisma/client';

import {
    CreateRecoveryChallengeData,
    CreateRecoveryMethodData,
    CreateRecoveryQuestionData,
    CreateRecoverySessionData,
    RecoverySessionWithChallenges,
    UpdateRecoveryMethodData,
    UpdateRecoverySessionData,
} from '../../types/repository/recovery';

export class RecoveryRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async findMethodsByUserId(userId: string): Promise<RecoveryMethod[]> {
        return this.prisma.recoveryMethod.findMany({
            where: {
                userId,
            },
            orderBy: {
                type: 'asc',
            },
        });
    }

    async findEnabledMethods(userId: string): Promise<RecoveryMethod[]> {
        return this.prisma.recoveryMethod.findMany({
            where: {
                userId,
                enabled: true,
            },
            orderBy: {
                type: 'asc',
            },
        });
    }

    async countEnabledMethods(userId: string): Promise<number> {
        return this.prisma.recoveryMethod.count({
            where: {
                userId,
                enabled: true,
            },
        });
    }

    async findMethod(
        userId: string,
        type: RecoveryType,
    ): Promise<RecoveryMethod | null> {
        return this.prisma.recoveryMethod.findUnique({
            where: {
                userId_type: {
                    userId,
                    type,
                },
            },
        });
    }

    async createMethod(
        data: CreateRecoveryMethodData,
    ): Promise<RecoveryMethod> {
        return this.prisma.recoveryMethod.create({
            data,
        });
    }

    async createDefaultMethods(userId: string): Promise<void> {
        await this.prisma.recoveryMethod.createMany({
            data: [
                {
                    userId,
                    type: RecoveryType.EMAIL,
                    enabled: false,
                },
                {
                    userId,
                    type: RecoveryType.QUESTIONS,
                    enabled: false,
                },
                {
                    userId,
                    type: RecoveryType.RECOVERY_KEY,
                    enabled: false,
                },
            ],
            skipDuplicates: true,
        });
    }

    async updateMethod(
        userId: string,
        type: RecoveryType,
        data: UpdateRecoveryMethodData,
    ): Promise<RecoveryMethod> {
        return this.prisma.recoveryMethod.update({
            where: {
                userId_type: {
                    userId,
                    type,
                },
            },
            data,
        });
    }

    async findQuestions(userId: string): Promise<RecoveryQuestion[]> {
        return this.prisma.recoveryQuestion.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
    }

    async countQuestions(userId: string): Promise<number> {
        return this.prisma.recoveryQuestion.count({
            where: {
                userId,
            },
        });
    }

    async createQuestion(
        data: CreateRecoveryQuestionData,
    ): Promise<RecoveryQuestion> {
        return this.prisma.recoveryQuestion.create({
            data,
        });
    }

    async deleteQuestions(userId: string): Promise<void> {
        await this.prisma.recoveryQuestion.deleteMany({
            where: {
                userId,
            },
        });
    }

    async createSession(
        data: CreateRecoverySessionData,
    ): Promise<RecoverySession> {
        return this.prisma.recoverySession.create({
            data,
        });
    }

    async findSession(
        id: string,
    ): Promise<RecoverySessionWithChallenges | null> {
        return this.prisma.recoverySession.findUnique({
            where: {
                id,
            },
            include: {
                challenges: {
                    orderBy: {
                        step: 'asc',
                    },
                },
            },
        });
    }

    async findSessionByTokenHash(
        tokenHash: string,
    ): Promise<RecoverySessionWithChallenges | null> {
        return this.prisma.recoverySession.findFirst({
            where: {
                tokenHash,
            },
            include: {
                challenges: {
                    orderBy: {
                        step: 'asc',
                    },
                },
            },
        });
    }

    async updateSession(
        id: string,
        data: UpdateRecoverySessionData,
    ): Promise<RecoverySession> {
        return this.prisma.recoverySession.update({
            where: {
                id,
            },
            data,
        });
    }

    async deleteSession(id: string): Promise<RecoverySession> {
        return this.prisma.recoverySession.delete({
            where: {
                id,
            },
        });
    }

    async createChallenge(
        data: CreateRecoveryChallengeData,
    ): Promise<RecoveryChallenge> {
        return this.prisma.recoveryChallenge.create({
            data,
        });
    }

    async findChallenge(
        sessionId: string,
        type: RecoveryType,
    ): Promise<RecoveryChallenge | null> {
        return this.prisma.recoveryChallenge.findFirst({
            where: {
                sessionId,
                type,
            },
        });
    }

    async findChallengeByStep(
        sessionId: string,
        step: number,
    ): Promise<RecoveryChallenge | null> {
        return this.prisma.recoveryChallenge.findUnique({
            where: {
                sessionId_step: {
                    sessionId,
                    step,
                },
            },
        });
    }

    async findChallengeByTokenHash(
        tokenHash: string,
    ): Promise<RecoveryChallenge | null> {
        return this.prisma.recoveryChallenge.findFirst({
            where: {
                tokenHash,
            },
        });
    }

    async findActiveSessionByTokenHash(
        tokenHash: string,
    ): Promise<RecoverySessionWithChallenges | null> {
        return this.prisma.recoverySession.findFirst({
            where: {
                tokenHash,
                expiresAt: {
                    gt: new Date(),
                },
                completedAt: null,
            },
            include: {
                challenges: {
                    orderBy: {
                        step: 'asc',
                    },
                },
            },
        });
    }

    async completeChallenge(id: string): Promise<RecoveryChallenge> {
        return this.prisma.recoveryChallenge.update({
            where: {
                id,
            },
            data: {
                completedAt: new Date(),
            },
        });
    }

    async deleteExpiredSessions(): Promise<number> {
        const result = await this.prisma.recoverySession.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });

        return result.count;
    }

    async deleteExpiredChallenges(): Promise<number> {
        const result = await this.prisma.recoveryChallenge.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });

        return result.count;
    }
}
