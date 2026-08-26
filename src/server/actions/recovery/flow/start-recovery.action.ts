'use server';

import { recoveryFlowService } from '@/src/server/containers/services';
import { ActionResult } from '@/src/server/types/action';
import { StartRecoveryResult } from '@/src/server/types/service/recovery';

export async function startRecoveryAction(
    email: string,
): Promise<ActionResult<StartRecoveryResult | null>> {
    try {
        const result = await recoveryFlowService.startRecovery(email);

        return {
            success: true,
            message: 'Recuperação iniciada com sucesso.',
            data: result,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Erro interno ao iniciar recuperação.',
            data: null,
        };
    }
}
