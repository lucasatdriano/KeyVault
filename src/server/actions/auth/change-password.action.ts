'use server';

import { authService } from '../../containers/services';
import { ActionResult } from '../../types/action';
import { ChangePasswordData } from '../../types/service/auth';
import { getAuditContext } from '../../utils/audit-context';

export async function changePasswordAction(
    data: ChangePasswordData,
): Promise<ActionResult<void | null>> {
    try {
        const user = await authService.requireAuth();
        const audit = await getAuditContext();

        const result = await authService.changePassword(user.id, data, audit);

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
