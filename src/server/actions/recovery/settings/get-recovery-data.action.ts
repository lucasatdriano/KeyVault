'use server';

import { RecoveryDataPayload } from '@/src/shared/types/recovery';

import {
    authService,
    recoverySettingsService,
} from '@/src/server/containers/services';
import { ActionResult } from '@/src/server/types/action';

export async function getRecoveryDataAction(): Promise<
    ActionResult<RecoveryDataPayload | null>
> {
    try {
        const user = await authService.requireAuth();

        const recoveryData = await recoverySettingsService.getRecoveryData(
            user.id,
        );

        return {
            success: true,
            data: recoveryData,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Erro ao buscar dados de recuperação.',
            data: null,
        };
    }
}
