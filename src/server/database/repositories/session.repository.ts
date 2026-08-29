import { PrismaClient, SessionStatus } from '@/src/generated/prisma/client';

export class SessionRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async create(userId: string, expiresAt: Date) {
        return this.prisma.session.create({
            data: {
                userId,
                expiresAt,
            },
        });
    }

    async findById(id: string) {
        return this.prisma.session.findUnique({
            where: {
                id,
            },
        });
    }

    async findActiveById(id: string) {
        return this.prisma.session.findFirst({
            where: {
                id,
                status: SessionStatus.ACTIVE,
            },
        });
    }

    async logout(id: string) {
        return this.prisma.session.update({
            where: {
                id,
            },
            data: {
                status: SessionStatus.LOGGED_OUT,
                endedAt: new Date(),
            },
        });
    }

    async expire(id: string) {
        return this.prisma.session.update({
            where: {
                id,
            },
            data: {
                status: SessionStatus.EXPIRED,
                endedAt: new Date(),
            },
        });
    }

    async findExpiredActiveSessions(now = new Date()) {
        return this.prisma.session.findMany({
            where: {
                status: SessionStatus.ACTIVE,
                expiresAt: {
                    lte: now,
                },
            },
        });
    }
}
