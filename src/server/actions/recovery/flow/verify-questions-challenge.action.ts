'use server';

import { recoveryFlowService } from '@/src/server/containers/services';
import { ActionResult } from '@/src/server/types/action';
import { RecoveryChallengeResult } from '@/src/server/types/service/recovery';

export async function verifyQuestionsChallengeAction(
    token: string,
    answers: string[],
): Promise<ActionResult<RecoveryChallengeResult | null>> {
    try {
        const result = await recoveryFlowService.verifyQuestionsChallenge(
            token,
            answers,
        );

        return {
            success: true,
            message: result.completed
                ? 'Recuperação concluída com sucesso.'
                : 'Perguntas de recuperação validadas com sucesso.',
            data: result,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Erro interno ao validar perguntas de recuperação.',
            data: null,
        };
    }
}
