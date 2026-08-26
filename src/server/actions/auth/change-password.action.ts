'use server';

import { authService } from '@/src/server/containers/services';
import { getAuditContext } from '@/src/server/utils/audit-context';
import { ChangePasswordData } from '@/src/server/types/service/auth';
import { ActionResult } from '@/src/server/types/action';

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
