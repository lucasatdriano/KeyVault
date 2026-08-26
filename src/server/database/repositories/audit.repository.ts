import {
    AuditAction,
    AuditLog,
    Prisma,
    PrismaClient,
} from '@/src/generated/prisma/client';

import { PaginatedResponse } from '@/src/shared/types/pagination';

import {
    CreateAuditLogData,
    FindUserLogsOptions,
} from '@/src/server/types/repository/audit';

export class AuditRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async create(data: CreateAuditLogData): Promise<AuditLog> {
        return this.prisma.auditLog.create({
            data,
        });
    }

    async findByUser(
        userId: string,
        options: FindUserLogsOptions = {},
    ): Promise<PaginatedResponse<AuditLog>> {
        const {
            page = 1,
            limit = 20,
            action,
            credentialId,
            resourceSearchHash,
        } = options;

        const where: Prisma.AuditLogWhereInput = {
            userId,

            ...(action && {
                action,
            }),

            ...(credentialId && {
                credentialId,
            }),

            ...(resourceSearchHash && {
                resourceSearchHash,
            }),
        };

        const [data, total] = await this.prisma.$transaction([
            this.prisma.auditLog.findMany({
                where,
                orderBy: {
                    createdAt: 'desc',
                },
                skip: (page - 1) * limit,
                take: limit,
            }),

            this.prisma.auditLog.count({
                where,
            }),
        ]);

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findCredentialsByIds(ids: string[]) {
        if (ids.length === 0) {
            return [];
        }

        return this.prisma.credential.findMany({
            where: {
                id: {
                    in: ids,
                },
            },

            select: {
                id: true,
                cipherText: true,
                iv: true,
            },
        });
    }

    async findById(id: string): Promise<AuditLog | null> {
        return this.prisma.auditLog.findUnique({
            where: {
                id,
            },
        });
    }

    async countByAction(userId: string) {
        return this.prisma.auditLog.groupBy({
            by: ['action'],
            where: {
                userId,
            },
            _count: true,
        });
    }

    async deleteOlderThan(
        date: Date,
        actions?: AuditAction[],
    ): Promise<number> {
        const result = await this.prisma.auditLog.deleteMany({
            where: {
                createdAt: {
                    lt: date,
                },

                ...(actions?.length && {
                    action: {
                        in: actions,
                    },
                }),
            },
        });

        return result.count;
    }
}
