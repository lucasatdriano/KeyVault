'use server';

import { authService } from '../../containers/services';
import { ActionResult } from '../../types/action';
import { ChangePasswordData } from '../../types/service/auth';

export async function changePasswordAction(
    data: ChangePasswordData,
): Promise<ActionResult<void | null>> {
    try {
        const result = await authService.changePassword(data);

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
                    : 'Erro interno do servidor.',
            data: null,
        };
    }
}
