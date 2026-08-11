'use server';

import { User } from '@/src/generated/prisma/client';
import { authService, userService } from '../../containers/services';
import { ActionResult } from '../../types/action';
import { UserWithRecoveryMethod } from '../../types/repository/user';

export async function getProfileAction(): Promise<
    ActionResult<UserWithRecoveryMethod | null>
> {
    try {
        const user = await authService.requireAuth();

        const result = await userService.getProfile(user.id);

        return {
            success: true,
            message: '...',
            data: result,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erro interno.',
            data: null,
        };
    }
}
