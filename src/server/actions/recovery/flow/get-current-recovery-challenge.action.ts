'use server';

import { recoveryFlowService } from '@/src/server/containers/services';
import { ActionResult } from '@/src/server/types/action';
import { CurrentRecoveryChallengeResult } from '@/src/server/types/service/recovery';

export async function getCurrentRecoveryChallengeAction(
    token: string,
): Promise<ActionResult<CurrentRecoveryChallengeResult | null>> {
    try {
        const result =
            await recoveryFlowService.getCurrentRecoveryChallenge(token);

        return {
            success: true,
            message: 'Desafio de recuperação obtido com sucesso.',
            data: result,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Erro interno ao obter desafio de recuperação.',
            data: null,
        };
    }
}
