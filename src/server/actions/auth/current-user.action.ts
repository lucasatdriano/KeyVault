'use server';

import { User } from '@/src/generated/prisma/client';

import { authService } from '@/src/server/containers/services';
import { ActionResult } from '@/src/server/types/action';

export async function currentUserAction(): Promise<ActionResult<User | null>> {
    try {
        const result = await authService.getCurrentUser();

        return {
            success: true,
            data: result,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Erro interno do servidor.',
            data: null,
        };
    }
}
