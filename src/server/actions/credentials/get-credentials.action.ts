'use server';

import { PaginatedResponse } from '@/src/shared/types/pagination';

import { authService, credentialService } from '../../containers/services';
import { ActionResult } from '../../types/action';
import {
    CredentialWithCategory,
    FindCredentialsOptions,
} from '../../types/repository/credential';

export async function getCredentialsAction(
    params: FindCredentialsOptions = {},
): Promise<ActionResult<PaginatedResponse<CredentialWithCategory> | null>> {
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
