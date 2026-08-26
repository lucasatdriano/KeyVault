'use server';

import { authService, userService } from '@/src/server/containers/services';
import { ActionResult } from '@/src/server/types/action';
import { ProfileWithRecoveryMethods } from '@/src/server/types/repository/user';

export async function getProfileAction(): Promise<
    ActionResult<ProfileWithRecoveryMethods | null>
> {
    try {
        const user = await authService.requireAuth();

        const profile = await userService.getProfile(user.id);

        return {
            success: true,
            message: 'Perfil obtido com sucesso.',
            data: profile,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Erro interno ao buscar perfil.',
            data: null,
        };
    }
}
