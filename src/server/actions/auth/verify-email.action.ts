'use server';

import { deleteAccessToken } from '@/src/server/auth/cookies';
import { authService } from '@/src/server/containers/services';
import { getAuditContext } from '@/src/server/utils/audit-context';
import { ActionResult } from '@/src/server/types/action';
import { VerifyEmailResult } from '@/src/server/types/service/auth';

export async function verifyEmailAction(
    token: string,
): Promise<ActionResult<VerifyEmailResult | null>> {
    try {
        const audit = await getAuditContext();

        const result = await authService.verifyEmail(token, audit);

        if (result.requiresLogout) {
            await deleteAccessToken();
        }

        return {
            success: true,
            message: 'E-mail verificado com sucesso.',
            data: result,
        };
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : 'Erro interno do servidor.';

        return {
            success: false,
            error: message,
            data: null,
        };
    }
}

export async function resendEmailVerificationAction(
    email: string,
): Promise<ActionResult<null>> {
    try {
        await authService.resendEmailVerification(email);

        return {
            success: true,
            message: 'E-mail de verificação enviado com sucesso.',
            data: null,
        };
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : 'Erro interno do servidor.';

        return {
            success: false,
            error: message,
            data: null,
        };
    }
}
