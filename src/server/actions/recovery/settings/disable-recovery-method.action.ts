'use server';

import { RecoveryMethod, RecoveryType } from '@/src/generated/prisma/client';

import {
    authService,
    recoverySettingsService,
} from '@/src/server/containers/services';
import { getAuditContext } from '@/src/server/utils/audit-context';
import { ActionResult } from '@/src/server/types/action';

export async function disableRecoveryMethodAction(
    type: RecoveryType,
): Promise<ActionResult<RecoveryMethod | null>> {
    try {
        const user = await authService.requireAuth();
        const audit = await getAuditContext();

        const method = await recoverySettingsService.disableMethod(
            user.id,
            type,
            audit,
        );

        return {
            success: true,
            message: 'Método de recuperação desabilitado com sucesso.',
            data: method,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Erro interno ao desabilitar método de recuperação.',
            data: null,
        };
    }
}
