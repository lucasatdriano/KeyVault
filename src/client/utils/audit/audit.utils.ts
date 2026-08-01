import { AuditLog } from '@/src/client/types/audit';

export interface AuditLogGroup {
    date: string;
    logs: AuditLog[];
}

export function groupAuditLogs(logs: AuditLog[]): AuditLogGroup[] {
    const groups = logs.reduce<Record<string, AuditLog[]>>((acc, log) => {
        (acc[log.date] ??= []).push(log);
        return acc;
    }, {});

    return Object.entries(groups)
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([date, logs]) => ({
            date,
            logs,
        }));
}
