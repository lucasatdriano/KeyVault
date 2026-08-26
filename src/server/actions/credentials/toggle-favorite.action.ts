'use server';

import { Credential } from '@/src/generated/prisma/client';

import { authService, credentialService } from '../../containers/services';
import { ActionResult } from '../../types/action';

export async function toggleFavoriteAction(
    id: string,
): Promise<ActionResult<Credential | null>> {
    try {
        await authService.requireAuth();

        const credential = await credentialService.toggleFavorite(id);

        return {
            success: true,
            message: 'Favorito atualizado.',
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
