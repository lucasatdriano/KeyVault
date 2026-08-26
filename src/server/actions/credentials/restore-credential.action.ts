'use server';

import {
    authService,
    credentialService,
} from '@/src/server/containers/services';
import { getAuditContext } from '@/src/server/utils/audit-context';
import { ActionResult } from '@/src/server/types/action';

export async function restoreCredentialAction(
    id: string,
): Promise<ActionResult<null>> {
    try {
        await authService.requireAuth();
        const audit = await getAuditContext();

        await credentialService.restoreCredential(id, audit);

        return {
            success: true,
            message: 'Credencial restaurada.',
            data: null,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Erro ao restaurar credencial.',
            data: null,
        };
    }
}
