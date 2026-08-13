'use client';

import { useSessionExpiredHandler } from '@/src/client/utils/handlers/session-expired-handler';

export function SessionExpiredHandler() {
    useSessionExpiredHandler();
    return null;
}
