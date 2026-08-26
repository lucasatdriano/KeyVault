'use server';

import { RecoveryMethod } from '@/src/generated/prisma/client';

import {
    authService,
    recoverySettingsService,
} from '@/src/server/containers/services';
import { getAuditContext } from '@/src/server/utils/audit-context';
import { ActionResult } from '@/src/server/types/action';
import { RecoveryQuestionData } from '@/src/server/types/service/recovery';

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
