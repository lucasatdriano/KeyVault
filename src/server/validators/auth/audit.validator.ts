import { AuditAction } from '@/src/generated/prisma/client';

import { CreateAuditLogData } from '@/src/server/types/repository/audit';
import { validateUserId } from '@/src/server/validators/user/user.validator';

export function validateAuditData(data: CreateAuditLogData): void {
    validateUserId(data.userId);

    if (!Object.values(AuditAction).includes(data.action)) {
        throw new Error('Ação de auditoria inválida');
    }

    if (
        data.credentialId !== undefined &&
        data.credentialId !== null &&
        typeof data.credentialId !== 'string'
    ) {
        throw new Error('credentialId inválido');
    }

    if (
        data.recoveryMethodId !== undefined &&
        data.recoveryMethodId !== null &&
        typeof data.recoveryMethodId !== 'string'
    ) {
        throw new Error('recoveryMethodId inválido');
    }

    if (
        data.browser !== undefined &&
        data.browser !== null &&
        typeof data.browser !== 'string'
    ) {
        throw new Error('browser inválido');
    }

    if (
        data.os !== undefined &&
        data.os !== null &&
        typeof data.os !== 'string'
    ) {
        throw new Error('os inválido');
    }

    if (
        data.device !== undefined &&
        data.device !== null &&
        typeof data.device !== 'string'
    ) {
        throw new Error('device inválido');
    }

    if (
        data.ip !== undefined &&
        data.ip !== null &&
        typeof data.ip !== 'string'
    ) {
        throw new Error('ip inválido');
    }
}
