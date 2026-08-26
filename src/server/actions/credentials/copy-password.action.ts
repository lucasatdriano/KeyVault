'use server';

import {
    authService,
    credentialService,
} from '@/src/server/containers/services';
import { getAuditContext } from '@/src/server/utils/audit-context';
import { ActionResult } from '@/src/server/types/action';

export async function copyPasswordAction(
    credentialId: string,
): Promise<ActionResult<null>> {
    try {
        await authService.requireAuth();
        const audit = await getAuditContext();

        await credentialService.copyPassword(credentialId, audit);

        return {
            success: true,
            message: 'Copiado para a área de transferência.',
            data: null,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erro interno.',
            data: null,
        };
    }
}
