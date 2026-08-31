'use server';

import {
    authService,
    credentialService,
} from '@/src/server/containers/services';
import { getAuditContext } from '@/src/server/utils/audit-context';
import { ActionResult } from '@/src/server/types/action';
import { CredentialWithCategory } from '@/src/server/types/repository/credential';

export async function exportCredentialsAction(): Promise<
    ActionResult<CredentialWithCategory[] | null>
> {
    try {
        const user = await authService.requireAuth();
        const audit = await getAuditContext();

        const result = await credentialService.getAllUserCredentials(
            user.id,
            audit,
        );

        return {
            success: true,
            data: result,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erro interno.',
            data: null,
        };
    }
}
