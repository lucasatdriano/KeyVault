'use server';

import { authService } from '../../containers/services';
import { ActionResult } from '../../types/action';
import { getAuditContext } from '../../utils/audit-context';

export async function logoutAction(): Promise<ActionResult<void | null>> {
    try {
        const audit = await getAuditContext();

        const result = await authService.logout(audit);

        return {
            success: true,
            data: result,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Erro interno do servidor.',
            data: null,
        };
    }
}
