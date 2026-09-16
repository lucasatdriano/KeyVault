'use server';

import { RecoveryDataPayload } from '@/src/shared/types/recovery';

import { recoveryFlowService } from '@/src/server/containers/services';
import { ActionResult } from '@/src/server/types/action';

export async function getRecoveryDataForResetAction(
    token: string,
): Promise<ActionResult<RecoveryDataPayload | null>> {
    try {
        const recoveryData =
            await recoveryFlowService.getRecoveryDataForReset(token);

        return {
            success: true,
            data: recoveryData,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Erro ao buscar dados de recuperação.',
            data: null,
        };
    }
}
