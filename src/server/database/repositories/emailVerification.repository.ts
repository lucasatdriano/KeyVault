import { PrismaClient, EmailVerification } from '@/src/generated/prisma/client';

import { CreateEmailVerificationData } from '@/src/server/types/repository/emailVerification';

export class EmailVerificationRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async create(
        data: CreateEmailVerificationData,
    ): Promise<EmailVerification> {
        return this.prisma.emailVerification.create({
            data: {
                userId: data.userId,
                tokenHash: data.tokenHash,
                expiresAt: data.expiresAt,
                isEmailChange: data.isEmailChange,
            },
        });
    }

    async findByTokenHash(
        tokenHash: string,
    ): Promise<EmailVerification | null> {
        return this.prisma.emailVerification.findFirst({
            where: {
                tokenHash,
                usedAt: null,
            },
        });
    }

    async markAsUsed(id: string): Promise<EmailVerification> {
        return this.prisma.emailVerification.update({
            where: {
                id,
            },
            data: {
                usedAt: new Date(),
            },
        });
    }

    async findLatestByUserId(
        userId: string,
    ): Promise<EmailVerification | null> {
        return this.prisma.emailVerification.findFirst({
            where: {
                userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async invalidateByUserId(userId: string): Promise<void> {
        await this.prisma.emailVerification.updateMany({
            where: {
                userId,
                usedAt: null,
            },
            data: {
                usedAt: new Date(),
            },
        });
    }

    async deleteExpired(): Promise<void> {
        await this.prisma.emailVerification.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });
    }
}
