'use server';

import { authService, credentialService } from '../../containers/services';
import { ActionResult } from '../../types/action';

export async function copyPasswordAction(
    credentialId: string,
): Promise<ActionResult<null>> {
    try {
        await authService.requireAuth();

        await credentialService.copyPassword(credentialId);

        return {
            success: true,
            message: 'Cópia registrada.',
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
