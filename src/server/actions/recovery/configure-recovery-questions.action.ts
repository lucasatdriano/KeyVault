'use server';

import { RecoveryMethod } from '@/src/generated/prisma/client';

import {
    authService,
    recoverySettingsService,
} from '../../containers/services';
import { ActionResult } from '../../types/action';
import { RecoveryQuestionData } from '../../types/repository/recovery';
import { getAuditContext } from '../../utils/audit-context';

export async function configureRecoveryQuestionsAction(
    questions: RecoveryQuestionData[],
): Promise<ActionResult<RecoveryMethod | null>> {
    try {
        const user = await authService.requireAuth();

        const audit = await getAuditContext();

        const method = await recoverySettingsService.configureQuestions(
            user.id,
            questions,
            audit,
        );

        return {
            success: true,
            message: 'Perguntas de recuperação configuradas com sucesso.',
            data: method,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Erro interno ao configurar perguntas de recuperação.',
            data: null,
        };
    }
}
