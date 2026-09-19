'use server';

import {
    authService,
    recoverySettingsService,
} from '@/src/server/containers/services';
import { ActionResult } from '@/src/server/types/action';

export async function verifyRecoveryPasswordAction(
    recoveryPassword: string,
): Promise<ActionResult<boolean | null>> {
    try {
        const user = await authService.requireAuth();

        const isValid = await recoverySettingsService.verifyRecoveryPassword(
            user.id,
            recoveryPassword,
        );

        return {
            success: true,
            data: isValid,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Erro ao verificar a senha de recuperação.',
            data: null,
        };
    }
}
