'use server';

import { authService } from '@/src/server/containers/services';
import { getAuditContext } from '@/src/server/utils/audit-context';
import { ActionResult } from '@/src/server/types/action';
import { RegisterData, RegisterResult } from '@/src/server/types/service/auth';

export async function registerAction(
    data: RegisterData,
): Promise<ActionResult<RegisterResult | null>> {
    try {
        const audit = await getAuditContext();

        const result = await authService.register(data, audit);

        return {
            success: true,
            message: 'Cadastro realizado com sucesso.',
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
