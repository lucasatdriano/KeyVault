'use server';

import { recoveryFlowService } from '@/src/server/containers/services';
import { ActionResult } from '@/src/server/types/action';
import { RecoveryQuestionsChallengeResult } from '@/src/server/types/service/recovery';

export async function getRecoveryQuestionsChallengeAction(
    token: string,
): Promise<ActionResult<RecoveryQuestionsChallengeResult | null>> {
    try {
        const result =
            await recoveryFlowService.getRecoveryQuestionsChallenge(token);

        return {
            success: true,
            message: 'Perguntas de recuperação obtidas com sucesso.',
            data: result,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Erro interno ao obter perguntas de recuperação.',
            data: null,
        };
    }
}
