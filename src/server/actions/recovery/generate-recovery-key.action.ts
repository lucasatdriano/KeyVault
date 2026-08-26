'use server';

import {
    authService,
    recoverySettingsService,
} from '../../containers/services';
import { ActionResult } from '../../types/action';
import { getAuditContext } from '../../utils/audit-context';

export async function generateRecoveryKeyAction(): Promise<
    ActionResult<string | null>
> {
    try {
        const user = await authService.requireAuth();

        const audit = await getAuditContext();

        const recoveryKey = await recoverySettingsService.generateRecoveryKey(
            user.id,
            audit,
        );

        console.log(recoveryKey);

        return {
            success: true,
            message: 'Chave de recuperação gerada com sucesso.',
            data: recoveryKey,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Erro interno ao gerar chave de recuperação.',
            data: null,
        };
    }
}
