'use server';

import { authService, credentialService } from '../../containers/services';
import { ActionResult } from '../../types/action';

export async function deleteCredentialAction(
    id: string,
): Promise<ActionResult<null>> {
    try {
        await authService.requireAuth();

        await credentialService.delete(id);

        return {
            success: true,
            message: 'Credencial removida.',
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
