'use server';

import { authService } from '@/src/server/containers/services';
import { ActionResult } from '@/src/server/types/action';

export async function updateSessionExpirationAction(
    sessionExpiration: number,
): Promise<ActionResult<null>> {
    try {
        const user = await authService.requireAuth();

        await authService.updateSessionExpiration(user.id, sessionExpiration);

        return {
            success: true,
            data: null,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erro interno.',
            data: null,
        };
    }
}
