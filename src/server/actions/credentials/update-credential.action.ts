'use server';

import { authService, credentialService } from '../../containers/services';
import { ActionResult } from '../../types/action';
import { Credential } from '@/src/generated/prisma/client';
import { UpdateCredentialData } from '../../types/repository/credential';

export async function updateCredentialAction(
    data: UpdateCredentialData,
): Promise<ActionResult<Credential | null>> {
    try {
        await authService.requireAuth();

        const credential = await credentialService.update(data);

        return {
            success: true,
            message: 'Credencial atualizada.',
            data: credential,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erro interno.',
            data: null,
        };
    }
}
