'use server';

import { RecoveryDataPayload } from '@/src/shared/types/recovery';

import {
    authService,
    recoverySettingsService,
} from '@/src/server/containers/services';
import { ActionResult } from '@/src/server/types/action';

export async function updateRecoveryDataAction(
    recoveryData: RecoveryDataPayload,
): Promise<ActionResult<null>> {
    try {
        const user = await authService.requireAuth();

        await recoverySettingsService.updateRecoveryData(user.id, recoveryData);

        return {
            success: true,
            message: 'Dados de recuperação atualizados com sucesso.',
            data: null,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Erro interno ao atualizar dados de recuperação.',
            data: null,
        };
    }
}
