'use server';

import { authService, userService } from '../../containers/services';
import { ProfileWithRecoveryMethods } from '../../types/repository/user';
import { ActionResult } from '../../types/action';

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
