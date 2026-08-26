import { AuditAction } from '@/src/generated/prisma/client';

import { ACTION_MAP } from '@/src/client/constants/actionAudit';

export function mapAuditSearch(search: string): {
    action?: AuditAction;
    resourceName?: string;
} {
    const value = search.trim().toLowerCase();

    const action = ACTION_MAP[value];

    if (action) {
        return { action };
    }

    return {
        resourceName: value,
    };
}
