'use server';

import { recoveryFlowService } from '@/src/server/containers/services';

export async function resetPasswordAction(token: string, newPassword: string) {
    try {
        const result = await recoveryFlowService.resetPassword(
            token,
            newPassword,
        );

        return {
            success: true,
            data: result,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Não foi possível redefinir a senha.',
        };
    }
}
