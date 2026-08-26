'use server';

import {
    authService,
    credentialService,
} from '@/src/server/containers/services';
import { getAuditContext } from '@/src/server/utils/audit-context';
import { ActionResult } from '@/src/server/types/action';

export async function deleteCredentialAction(
    id: string,
): Promise<ActionResult<null>> {
    try {
        await authService.requireAuth();
        const audit = await getAuditContext();

        await credentialService.delete(id, audit);

        return {
            success: true,
            message: 'Credencial movida para lixeira.',
            data: null,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Erro ao excluir credencial.',
            data: null,
        };
    }
}
