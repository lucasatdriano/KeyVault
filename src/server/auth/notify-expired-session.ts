import { API_ROUTES } from '@/src/shared/constants/api/api-routes.constants';
import { NextRequest } from 'next/server';

export async function notifyExpiredSession(
    request: NextRequest,
    userId: string,
) {
    await fetch(new URL(API_ROUTES.INTERNAL.LOGOUT_EXPIRED, request.url), {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.INTERNAL_API_SECRET}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
    });
}
