'use server';

import {
    authService,
    recoverySettingsService,
} from '@/src/server/containers/services';
import { getAuditContext } from '@/src/server/utils/audit-context';
import { ActionResult } from '@/src/server/types/action';

export async function generateRecoveryKeyAction(
    recoveryKeyHash: string,
): Promise<ActionResult<null>> {
    try {
        if (!recoveryKeyHash?.trim()) {
            throw new Error('Hash da chave de recuperação não encontrado.');
        }

        const user = await authService.requireAuth();
        const audit = await getAuditContext();

        await recoverySettingsService.generateRecoveryKey(
            user.id,
            recoveryKeyHash,
            audit,
        );

        return {
            success: true,
            message: 'Chave de recuperação gerada com sucesso.',
            data: null,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Erro interno ao gerar chave de recuperação.',
            data: null,
        };
    }
}
