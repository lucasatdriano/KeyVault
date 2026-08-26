'use server';

import { authService } from '@/src/server/containers/services';
import { getAuditContext } from '@/src/server/utils/audit-context';
import { ActionResult } from '@/src/server/types/action';
import { LoginData, LoginResult } from '@/src/server/types/service/auth';

export async function loginAction(
    data: LoginData,
): Promise<ActionResult<LoginResult | null>> {
    try {
        const audit = await getAuditContext();

        const result = await authService.login(data, audit);

        return {
            success: true,
            message: 'Login realizado com sucesso.',
            data: result,
        };
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : 'Erro interno do servidor.';

        return {
            success: false,
            error: message,
            data: null,
        };
    }
}
