'use server';

import { authService } from '@/src/server/containers/services';
import { ActionResult } from '@/src/server/types/action';

export async function deleteAccountAction(): Promise<
    ActionResult<void | null>
> {
    try {
        const user = await authService.requireAuth();

        const result = await authService.deleteAccount(user.id);

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
