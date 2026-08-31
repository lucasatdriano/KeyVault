'use server';

import {
    authService,
    credentialService,
} from '@/src/server/containers/services';
import { getAuditContext } from '@/src/server/utils/audit-context';
import { CreateCredentialData } from '@/src/server/types/repository/credential';
import { ActionResult } from '@/src/server/types/action';

export async function importCredentialsAction(
    credentials: CreateCredentialData[],
): Promise<ActionResult<{ count: number } | null>> {
    try {
        const user = await authService.requireAuth();
        const audit = await getAuditContext();

        const count = await credentialService.createMany(
            user.id,
            credentials.map((credential) => ({
                ...credential,
                userId: user.id,
            })),
            audit,
        );

        return {
            success: true,
            data: count,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erro interno.',
            data: null,
        };
    }
}
