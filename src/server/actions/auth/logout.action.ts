'use server';

import { authService } from '../../containers/services';
import { ActionResult } from '../../types/action';

export async function logoutAction(): Promise<ActionResult<void | null>> {
    try {
        const result = await authService.logout();

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
