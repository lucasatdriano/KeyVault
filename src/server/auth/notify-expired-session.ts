import { NextRequest } from 'next/server';

import { API_ROUTES } from '@/src/shared/constants/api/api-routes.constants';

export async function notifyExpiredSession(
    request: NextRequest,
    userId: string,
) {
    try {
        const url = new URL(API_ROUTES.INTERNAL.LOGOUT_EXPIRED, request.url);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.INTERNAL_API_SECRET}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
            }),
        });

        if (!response.ok) {
            const error = await response.text();

            console.error(
                'Erro ao registrar logout expirado:',
                response.status,
                error,
            );

            return false;
        }

        return true;
    } catch (error) {
        console.error('Erro ao notificar sessão expirada:', error);
        return false;
    }
}
