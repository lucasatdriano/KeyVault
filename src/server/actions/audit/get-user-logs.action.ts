'use server';

import { PaginatedResponse } from '@/src/shared/types/pagination';

import { authService, auditService } from '@/src/server/containers/services';
import { ActionResult } from '@/src/server/types/action';
import {
    AuditLogWithCredential,
    FindUserLogsOptions,
} from '@/src/server/types/repository/audit';

export async function getUserLogsAction(
    params: FindUserLogsOptions = {},
): Promise<ActionResult<PaginatedResponse<AuditLogWithCredential> | null>> {
    try {
        const user = await authService.requireAuth();

        const logs = await auditService.getUserLogs(user.id, params);

        return {
            success: true,
            message: 'Auditorias do usuário recuperadas com sucesso.',
            data: logs,
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
