'use server';

import { recoveryFlowService } from '@/src/server/containers/services';
import { ActionResult } from '@/src/server/types/action';
import { RecoveryChallengeResult } from '@/src/server/types/service/recovery';

export async function verifyRecoveryKeyChallengeAction(
    token: string,
    recoveryKey: string,
): Promise<ActionResult<RecoveryChallengeResult | null>> {
    try {
        const result = await recoveryFlowService.verifyRecoveryKeyChallenge(
            token,
            recoveryKey,
        );

        return {
            success: true,
            message: result.completed
                ? 'Recuperação concluída com sucesso.'
                : 'Chave de recuperação validada com sucesso.',
            data: result,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Erro interno ao validar chave de recuperação.',
            data: null,
        };
    }
}
