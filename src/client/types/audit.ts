import { AuditAction } from '@/src/generated/prisma/enums';

export type AuditEventType =
    | 'login'
    | 'logout'
    | 'create'
    | 'edit'
    | 'delete'
    | 'password';

export interface AuditLogResponse {
    browser: string | null;
    os: string | null;
    device: string | null;
    ip: string | null;
    resource: string | null;

    id: string;
    action: AuditAction;
    createdAt: Date;
    credentialId: string | null;
    resourceSearchHash: string | null;
    userId: string;
}

export interface AuditLog {
    id: string;
    date: string;
    time: string;
    event: string;
    os: string;
    device: string;
    ip: string;
    type: AuditEventType;
    details?: string;
}
