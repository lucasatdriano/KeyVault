'use server';

import { Credential } from '@/src/generated/prisma/client';

import { credentialService } from '@/src/server/containers/services';
import { ActionResult } from '@/src/server/types/action';

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
