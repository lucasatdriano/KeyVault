import { AuditAction } from '@/src/generated/prisma/client';
import { PaginationQuery } from '@/src/shared/types/pagination';

export interface CreateAuditLogData {
    userId: string;
    credentialId?: string | null;

    action: AuditAction;

    browser?: string | null;
    os?: string | null;
    device?: string | null;
    ip?: string | null;
}

export interface FindUserLogsOptions extends PaginationQuery {
    action?: AuditAction;
    credentialId?: string;
    resourceSearchHash?: string;
}
