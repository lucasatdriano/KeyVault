import {
    PrismaClient,
    RecoveryChallenge,
    RecoveryData,
    RecoveryMethod,
    RecoveryQuestion,
    RecoverySession,
    RecoverySessionStatus,
    RecoveryType,
} from '@/src/generated/prisma/client';

import {
    CreateRecoveryMethodData,
    UpdateRecoveryMethodData,
    CreateRecoveryDataData,
    CreateRecoveryQuestionData,
    CreateRecoverySessionData,
    UpdateRecoverySessionData,
    CreateRecoveryChallengeData,
    UpdateRecoveryChallengeData,
    RecoverySessionWithChallenges,
    UpdateRecoveryDataData,
} from '@/src/server/types/repository/recovery';

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
                    type: RecoveryType.RECOVERY_PASSWORD,
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

    async findRecoveryData(userId: string): Promise<RecoveryData | null> {
        return this.prisma.recoveryData.findUnique({
            where: {
                userId,
            },
        });
    }

    async createRecoveryData(
        data: CreateRecoveryDataData,
    ): Promise<RecoveryData> {
        return this.prisma.recoveryData.create({
            data,
        });
    }

    async updateRecoveryData(
        userId: string,
        data: UpdateRecoveryDataData,
    ): Promise<RecoveryData> {
        return this.prisma.recoveryData.update({
            where: {
                userId,
            },
            data,
        });
    }

    async deleteRecoveryData(userId: string): Promise<RecoveryData> {
        return this.prisma.recoveryData.delete({
            where: {
                userId,
            },
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

    async findActiveSessionByTokenHash(
        tokenHash: string,
    ): Promise<RecoverySessionWithChallenges | null> {
        return this.prisma.recoverySession.findFirst({
            where: {
                tokenHash,

                status: RecoverySessionStatus.ACTIVE,

                expiresAt: {
                    gt: new Date(),
                },
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

    async updateSessionStatus(
        id: string,
        status: RecoverySessionStatus,
    ): Promise<RecoverySession> {
        return this.prisma.recoverySession.update({
            where: {
                id,
            },
            data: {
                status,

                completedAt:
                    status === RecoverySessionStatus.COMPLETED
                        ? new Date()
                        : undefined,
            },
        });
    }

    async completeSession(id: string): Promise<RecoverySession> {
        return this.prisma.recoverySession.update({
            where: {
                id,
            },
            data: {
                status: RecoverySessionStatus.COMPLETED,
                completedAt: new Date(),
            },
        });
    }

    async failSession(id: string): Promise<RecoverySession> {
        return this.prisma.recoverySession.update({
            where: {
                id,
            },
            data: {
                status: RecoverySessionStatus.FAILED,
            },
        });
    }

    async expireSession(id: string): Promise<RecoverySession> {
        return this.prisma.recoverySession.update({
            where: {
                id,
            },
            data: {
                status: RecoverySessionStatus.EXPIRED,
            },
        });
    }

    async expireExpiredSessions(): Promise<number> {
        const result = await this.prisma.recoverySession.updateMany({
            where: {
                status: RecoverySessionStatus.ACTIVE,

                expiresAt: {
                    lt: new Date(),
                },
            },
            data: {
                status: RecoverySessionStatus.EXPIRED,
            },
        });

        return result.count;
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
        return this.prisma.recoveryChallenge.findUnique({
            where: {
                sessionId_type: {
                    sessionId,
                    type,
                },
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

    async incrementChallengeAttempts(id: string): Promise<RecoveryChallenge> {
        return this.prisma.recoveryChallenge.update({
            where: {
                id,
            },
            data: {
                attempts: {
                    increment: 1,
                },
            },
        });
    }

    async updateChallenge(
        id: string,
        data: UpdateRecoveryChallengeData,
    ): Promise<RecoveryChallenge> {
        return this.prisma.recoveryChallenge.update({
            where: {
                id,
            },
            data,
        });
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

    async deleteOldSessions(before: Date): Promise<number> {
        const result = await this.prisma.recoverySession.deleteMany({
            where: {
                status: {
                    in: [
                        RecoverySessionStatus.COMPLETED,
                        RecoverySessionStatus.FAILED,
                        RecoverySessionStatus.EXPIRED,
                    ],
                },

                updatedAt: {
                    lt: before,
                },
            },
        });

        return result.count;
    }
}
