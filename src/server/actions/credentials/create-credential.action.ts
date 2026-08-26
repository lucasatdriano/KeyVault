'use server';

import { Credential } from '@/src/generated/prisma/client';

import { authService, credentialService } from '../../containers/services';
import { ActionResult } from '../../types/action';
import { CreateCredentialData } from '../../types/repository/credential';
import { getAuditContext } from '../../utils/audit-context';

export async function createCredentialAction(
    data: Omit<CreateCredentialData, 'userId'>,
): Promise<ActionResult<Credential | null>> {
    try {
        const user = await authService.requireAuth();
        const audit = await getAuditContext();

        const credential = await credentialService.create(
            {
                ...data,
                userId: user.id,
            },
            audit,
        );

        return {
            success: true,
            message: 'Credencial criada.',
            data: credential,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erro interno.',
            data: null,
        };
    }
}
