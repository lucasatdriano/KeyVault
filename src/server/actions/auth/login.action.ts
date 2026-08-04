'use server';

import { authService } from '../../containers/services';
import { ActionResult } from '../../types/action';
import { LoginData, LoginResult } from '../../types/service/auth';
import { getAuditContext } from '../../utils/audit-context';

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
