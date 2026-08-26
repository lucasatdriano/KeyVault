'use server';

import { recoveryFlowService } from '@/src/server/containers/services';
import { ActionResult } from '@/src/server/types/action';
import { RecoveryChallengeResult } from '@/src/server/types/service/recovery';

export async function verifyRecoveryPasswordChallengeAction(
    token: string,
    recoveryPassword: string,
): Promise<ActionResult<RecoveryChallengeResult | null>> {
    try {
        const result =
            await recoveryFlowService.verifyRecoveryPasswordChallenge(
                token,
                recoveryPassword,
            );

        return {
            success: true,
            message: result.completed
                ? 'Recuperação concluída com sucesso.'
                : 'Senha de recuperação validada com sucesso.',
            data: result,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Erro interno ao validar senha de recuperação.',
            data: null,
        };
    }
}
