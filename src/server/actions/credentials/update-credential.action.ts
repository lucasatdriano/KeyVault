'use server';

import { Credential } from '@/src/generated/prisma/client';

import { authService, credentialService } from '../../containers/services';
import { ActionResult } from '../../types/action';
import { UpdateCredentialData } from '../../types/repository/credential';
import { getAuditContext } from '../../utils/audit-context';

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
