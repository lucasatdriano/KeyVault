'use server';

import { RecoveryQuestion } from '@/src/generated/prisma/client';

import {
    authService,
    recoverySettingsService,
} from '../../containers/services';
import { ActionResult } from '../../types/action';

export async function getRecoveryQuestionsAction(): Promise<
    ActionResult<RecoveryQuestion[] | null>
> {
    try {
        const user = await authService.requireAuth();

        const questions = await recoverySettingsService.getQuestions(user.id);

        return {
            success: true,
            message: 'Perguntas de recuperação obtidas com sucesso.',
            data: questions,
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
