'use server';

import { Credential } from '@/src/generated/prisma/client';

import {
    authService,
    credentialService,
} from '@/src/server/containers/services';
import { getAuditContext } from '@/src/server/utils/audit-context';
import { CreateCredentialData } from '@/src/server/types/repository/credential';
import { ActionResult } from '@/src/server/types/action';

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
