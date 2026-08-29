import {
    AuditAction,
    AuditLog,
    Credential,
    RecoveryMethod,
} from '@/src/generated/prisma/client';

import { PaginationQuery } from '@/src/shared/types/pagination';

export interface CreateAuditLogData {
    userId: string;
    credentialId?: string | null;
    recoveryMethodId?: string | null;
    action: AuditAction;
    resource?: string | null;
    resourceSearchHash?: string | null;

    browser?: string | null;
    os?: string | null;
    device?: string | null;
    ip?: string | null;
}

export type AuditLogWithCredentialWithRecoveryMethod = AuditLog & {
    credential?: Pick<Credential, 'cipherText' | 'iv'> | null;
    recoveryMethod: Pick<RecoveryMethod, 'id' | 'type'> | null;
};

export interface FindUserLogsOptions extends PaginationQuery {
    action?: AuditAction;
    credentialId?: string;
    resourceSearchHash?: string;
}
