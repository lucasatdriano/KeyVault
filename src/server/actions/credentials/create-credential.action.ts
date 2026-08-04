'use server';

import { authService, credentialService } from '../../containers/services';
import { ActionResult } from '../../types/action';
import { Credential } from '@/src/generated/prisma/client';
import { CreateCredentialData } from '../../types/repository/credential';

export async function createCredentialAction(
    data: Omit<CreateCredentialData, 'userId'>,
): Promise<ActionResult<Credential | null>> {
    try {
        const user = await authService.requireAuth();

        const credential = await credentialService.create({
            ...data,
            userId: user.id,
        });

        return {
            success: true,
            message: 'Credencial criada.',
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
