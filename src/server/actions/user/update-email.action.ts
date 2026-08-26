'use server';

import { authService, userService } from '../../containers/services';
import { ChangeEmailData, RegisterResult } from '../../types/service/auth';
import { ActionResult } from '../../types/action';
import { getAuditContext } from '../../utils/audit-context';

export async function updateEmailAction(
    data: ChangeEmailData,
): Promise<ActionResult<RegisterResult | null>> {
    try {
        const user = await authService.requireAuth();
        const audit = await getAuditContext();

        const result = await userService.updateEmail(user.id, data, audit);

        return {
            success: true,
            message: 'E-mail atualizado com sucesso.',
            data: result,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Erro interno ao atualizar e-mail.',
            data: null,
        };
    }
}
