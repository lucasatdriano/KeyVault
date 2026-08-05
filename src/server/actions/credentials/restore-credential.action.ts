'use server';

import { authService, credentialService } from '../../containers/services';
import { ActionResult } from '../../types/action';
import { getAuditContext } from '../../utils/audit-context';

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
