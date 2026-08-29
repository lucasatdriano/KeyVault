import { Category } from '@/src/generated/prisma/client';

import { CategoryRepository } from '@/src/server/database/repositories/category.repository';
import { validateUserId } from '@/src/server/validators/user/user.validator';
import {
    CreateCategoryData,
    UpdateCategoryData,
} from '@/src/server/types/repository/category';

export class CategoryService {
    constructor(private readonly categoryRepository: CategoryRepository) {}

    async create(data: CreateCategoryData): Promise<Category> {
        validateUserId(data.userId);

        if (!data.cipherText) {
            throw new Error('Categoria inválida.');
        }

        return this.categoryRepository.create(data);
    }

    async createMany(
        userId: string,
        categories: Omit<CreateCategoryData, 'userId'>[],
    ): Promise<void> {
        validateUserId(userId);

        if (!categories.length) {
            return;
        }

        await this.categoryRepository.createMany(
            categories.map((category) => ({
                userId,
                cipherText: category.cipherText,
                iv: category.iv,
            })),
        );
    }

    async getById(id: string): Promise<Category | null> {
        if (!id) {
            throw new Error('id inválido.');
        }

        return this.categoryRepository.findById(id);
    }

    async getUserCategories(userId: string): Promise<Category[]> {
        validateUserId(userId);

        return this.categoryRepository.findByUser(userId);
    }

    async update(data: UpdateCategoryData): Promise<Category> {
        if (!data.id) {
            throw new Error('id inválido.');
        }

        return this.categoryRepository.update(data.id, data);
    }

    async delete(id: string): Promise<void> {
        if (!id) {
            throw new Error('id inválido.');
        }

        const credentialCount =
            await this.categoryRepository.countCredentials(id);

        if (credentialCount > 0) {
            throw new Error('Esta categoria possui credenciais vinculadas.');
        }

        await this.categoryRepository.delete(id);
    }

    async exists(id: string, userId: string): Promise<boolean> {
        if (!id || !userId) {
            return false;
        }

        return this.categoryRepository.exists(id, userId);
    }
}
