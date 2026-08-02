'use server';

import { authService, auditService } from '../../containers/services';
import { ActionResult } from '../../types/action';
import { AuditLog } from '@/src/generated/prisma/client';
import { PaginatedResponse } from '@/src/shared/types/pagination';
import { FindUserLogsOptions } from '../../types/repository/audit';

export async function getUserLogsAction(
    params: FindUserLogsOptions = {},
): Promise<ActionResult<PaginatedResponse<AuditLog> | null>> {
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
