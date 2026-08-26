'use server';

import { Credential } from '@/src/generated/prisma/client';

import {
    authService,
    credentialService,
} from '@/src/server/containers/services';
import { getAuditContext } from '@/src/server/utils/audit-context';
import { UpdateCredentialData } from '@/src/server/types/repository/credential';
import { ActionResult } from '@/src/server/types/action';

export async function updateCredentialAction(
    data: UpdateCredentialData,
): Promise<ActionResult<Credential | null>> {
    try {
        await authService.requireAuth();
        const audit = await getAuditContext();

        const credential = await credentialService.update(data, audit);

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
