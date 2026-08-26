'use server';

import { RecoveryMethod } from '@/src/generated/prisma/client';

import {
    authService,
    recoverySettingsService,
} from '@/src/server/containers/services';
import { ActionResult } from '@/src/server/types/action';

export async function getRecoveryMethodsAction(): Promise<
    ActionResult<RecoveryMethod[] | null>
> {
    try {
        const user = await authService.requireAuth();

        const methods = await recoverySettingsService.getMethods(user.id);

        return {
            success: true,
            message: 'Métodos de recuperação obtidos com sucesso.',
            data: methods,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Erro interno ao obter métodos de recuperação.',
            data: null,
        };
    }
}
