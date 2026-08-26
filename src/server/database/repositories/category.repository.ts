import { Category, PrismaClient } from '@/src/generated/prisma/client';

import {
    CreateCategoryData,
    UpdateCategoryData,
} from '../../types/repository/category';

export class CategoryRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async create(data: CreateCategoryData): Promise<Category> {
        return this.prisma.category.create({
            data,
        });
    }

    async createMany(data: CreateCategoryData[]): Promise<void> {
        await this.prisma.category.createMany({
            data,
        });
    }

    async findById(id: string): Promise<Category | null> {
        return this.prisma.category.findUnique({
            where: {
                id,
            },
        });
    }

    async findByUser(userId: string): Promise<Category[]> {
        return this.prisma.category.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
    }

    async update(id: string, data: UpdateCategoryData): Promise<Category> {
        return this.prisma.category.update({
            where: {
                id,
            },
            data,
        });
    }

    async delete(id: string): Promise<Category> {
        return this.prisma.category.delete({
            where: {
                id,
            },
        });
    }

    async countCredentials(categoryId: string): Promise<number> {
        return this.prisma.credential.count({
            where: {
                categoryId,
            },
        });
    }

    async exists(id: string, userId: string): Promise<boolean> {
        const category = await this.prisma.category.findFirst({
            where: {
                id,
                userId,
            },
            select: {
                id: true,
            },
        });

        return !!category;
    }
}
