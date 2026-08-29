'use server';

import { RecoveryDataPayload } from '@/src/shared/types/recovery';

import {
    authService,
    recoverySettingsService,
} from '@/src/server/containers/services';
import { getAuditContext } from '@/src/server/utils/audit-context';
import { ActionResult } from '@/src/server/types/action';

export async function generateRecoveryKeyAction(
    recoveryData: RecoveryDataPayload,
): Promise<ActionResult<string | null>> {
    try {
        const user = await authService.requireAuth();
        const audit = await getAuditContext();

        const recoveryKey = await recoverySettingsService.generateRecoveryKey(
            user.id,
            recoveryData,
            audit,
        );

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
