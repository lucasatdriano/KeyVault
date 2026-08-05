import {
    Credential,
    Prisma,
    PrismaClient,
} from '@/src/generated/prisma/client';
import { PaginatedResponse } from '@/src/shared/types/pagination';
import {
    CreateCredentialData,
    CredentialWithCategory,
    FindCredentialsOptions,
    UpdateCredentialData,
} from '../../types/repository/credential';
import { getThirtyDaysAgo } from '../../utils/date';

export class CredentialRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async create(data: CreateCredentialData): Promise<Credential> {
        return this.prisma.credential.create({
            data,
        });
    }

    async findById(
        id: string,
        includeDeleted = false,
    ): Promise<Credential | null> {
        return this.prisma.credential.findFirst({
            where: {
                id,

                ...(includeDeleted
                    ? {}
                    : {
                          deletedAt: null,
                      }),
            },
        });
    }

    async findByUser(
        userId: string,
        options: FindCredentialsOptions = {},
    ): Promise<PaginatedResponse<CredentialWithCategory>> {
        const {
            page = 1,
            limit = 20,
            categoryId,
            favorite,
            search,
            deleted = false,
        } = options;

        const where: Prisma.CredentialWhereInput = {
            userId,

            ...(deleted
                ? {
                      deletedAt: {
                          not: null,
                          gte: getThirtyDaysAgo(),
                      },
                  }
                : {
                      deletedAt: null,
                  }),

            ...(categoryId && {
                categoryId,
            }),

            ...(favorite !== undefined && {
                favorite,
            }),

            ...(search && {
                OR: [
                    {
                        resourceSearchHash: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                ],
            }),
        };

        const [data, total] = await this.prisma.$transaction([
            this.prisma.credential.findMany({
                where,
                orderBy: deleted
                    ? {
                          deletedAt: 'desc',
                      }
                    : {
                          updatedAt: 'desc',
                      },
                include: {
                    category: true,
                },
                skip: (page - 1) * limit,
                take: limit,
            }),

            this.prisma.credential.count({
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

    async update(id: string, data: UpdateCredentialData): Promise<Credential> {
        return this.prisma.credential.update({
            where: {
                id,
            },
            data,
        });
    }

    async updateFavorite(id: string, favorite: boolean): Promise<Credential> {
        return this.prisma.credential.update({
            where: {
                id,
            },
            data: {
                favorite,
            },
        });
    }

    async softDelete(id: string): Promise<Credential> {
        return this.prisma.credential.update({
            where: {
                id,
            },
            data: {
                deletedAt: new Date(),
            },
        });
    }

    async restore(id: string): Promise<Credential> {
        return this.prisma.credential.update({
            where: {
                id,
            },

            data: {
                deletedAt: null,
            },
        });
    }

    async countByUser(userId: string): Promise<number> {
        return this.prisma.credential.count({
            where: {
                userId,
            },
        });
    }

    async exists(id: string, userId: string): Promise<boolean> {
        const credential = await this.prisma.credential.findFirst({
            where: {
                id,
                userId,
            },
            select: {
                id: true,
            },
        });

        return !!credential;
    }
}
