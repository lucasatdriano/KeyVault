'use server';

import { authService, credentialService } from '../../containers/services';
import { ActionResult } from '../../types/action';
import { Credential } from '@/src/generated/prisma/client';
import { FindCredentialsOptions } from '../../types/repository/credential';
import { PaginatedResponse } from '@/src/shared/types/pagination';

export async function getCredentialsAction(
    params: FindCredentialsOptions = {},
): Promise<ActionResult<PaginatedResponse<Credential> | null>> {
    try {
        const user = await authService.requireAuth();

        const credentials = await credentialService.getUserCredentials(
            user.id,
            params,
        );

        return {
            success: true,
            message: 'Credenciais recuperadas.',
            data: credentials,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erro interno.',
            data: null,
        };
    }
}
