'use server';

import { ChangeEmailData } from '@/src/shared/types/auth';

import { authService, userService } from '@/src/server/containers/services';
import { getAuditContext } from '@/src/server/utils/audit-context';
import { ActionResult } from '@/src/server/types/action';
import { RegisterResult } from '@/src/server/types/service/auth';

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
