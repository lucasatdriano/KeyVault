'use server';

import { RegisterData } from '@/src/shared/types/auth';
import { authService } from '../../containers/services';
import { ActionResult } from '../../types/action';
import { RegisterResult } from '../../types/service/auth';
import { getAuditContext } from '../../utils/audit-context';

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
