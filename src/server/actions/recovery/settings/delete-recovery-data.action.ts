'use server';

import {
    authService,
    recoverySettingsService,
} from '@/src/server/containers/services';
import { ActionResult } from '@/src/server/types/action';

export async function deleteRecoveryDataAction(): Promise<ActionResult<null>> {
    try {
        const user = await authService.requireAuth();

        await recoverySettingsService.deleteRecoveryData(user.id);

        return {
            success: true,
            message: 'Dados de recuperação removidos com sucesso.',
            data: null,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Erro interno ao remover dados de recuperação.',
            data: null,
        };
    }
}
