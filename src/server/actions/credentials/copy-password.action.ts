'use server';

import { authService, credentialService } from '../../containers/services';
import { ActionResult } from '../../types/action';
import { getAuditContext } from '../../utils/audit-context';

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
