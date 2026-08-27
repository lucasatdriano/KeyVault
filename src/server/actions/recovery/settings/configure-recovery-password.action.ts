'use server';

import { RecoveryMethod } from '@/src/generated/prisma/client';

import {
    authService,
    recoverySettingsService,
} from '@/src/server/containers/services';
import { getAuditContext } from '@/src/server/utils/audit-context';
import { RecoveryDataPayload } from '@/src/shared/types/recovery';
import { ActionResult } from '@/src/server/types/action';

export async function configureRecoveryPasswordAction(
    recoveryPassword: string,
    recoveryData: RecoveryDataPayload,
): Promise<ActionResult<RecoveryMethod | null>> {
    try {
        const user = await authService.requireAuth();
        const audit = await getAuditContext();

        const method = await recoverySettingsService.configureRecoveryPassword(
            user.id,
            recoveryPassword,
            recoveryData,
            audit,
        );

        return {
            success: true,
            message: 'Senha de recuperação configurada com sucesso.',
            data: method,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Erro interno ao configurar senha de recuperação.',
            data: null,
        };
    }
}
