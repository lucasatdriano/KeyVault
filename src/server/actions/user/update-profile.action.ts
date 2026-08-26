'use server';

import { User } from '@/src/generated/prisma/client';

import { authService, userService } from '../../containers/services';
import { ActionResult } from '../../types/action';
import { getAuditContext } from '../../utils/audit-context';

export async function updateUserNameAction(
    name: string,
): Promise<ActionResult<User | null>> {
    try {
        const user = await authService.requireAuth();
        const audit = await getAuditContext();

        const updatedUser = await userService.updateProfile(
            user.id,
            { name },
            audit,
        );

        return {
            success: true,
            message: 'Nome atualizado com sucesso.',
            data: updatedUser,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Erro interno ao atualizar nome.',
            data: null,
        };
    }
}
