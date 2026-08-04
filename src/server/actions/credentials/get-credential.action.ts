'use server';

import { credentialService } from '../../containers/services';
import { ActionResult } from '../../types/action';
import { Credential } from '@/src/generated/prisma/client';

export async function getCredentialAction(
    id: string,
): Promise<ActionResult<Credential | null>> {
    try {
        const credential = await credentialService.getById(id);

        return {
            success: true,
            message: 'Credencial encontrada.',
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
