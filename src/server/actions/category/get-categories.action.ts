'use server';

import { Category } from '@/src/generated/prisma/client';

import { authService, categoryService } from '../../containers/services';
import { ActionResult } from '../../types/action';

export async function getCategoriesAction(): Promise<
    ActionResult<Category[] | null>
> {
    try {
        const user = await authService.requireAuth();

        const categories = await categoryService.getUserCategories(user.id);

        return {
            success: true,
            message: 'Categorias recuperadas.',
            data: categories,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erro interno.',
            data: null,
        };
    }
}
