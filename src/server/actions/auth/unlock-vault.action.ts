'use server';

import { currentUserAction } from './current-user.action';

export async function unlockVaultAction() {
    const result = await currentUserAction();

    if (!result.success || !result.data) {
        return {
            success: false,
            error: 'Sessão inválida.',
        };
    }

    return {
        success: true,
        data: {
            encryptedVaultKey: result.data.encryptedVaultKey,
        },
    };
}
