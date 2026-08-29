import { NextRequest, NextResponse } from 'next/server';

import {
    INTERNAL_API,
    INTERNAL_API_SECRET,
} from '@/src/shared/constants/api/api.constants';
import { sessionService } from '@/src/server/containers/services';

export async function expireSessionsController(request: NextRequest) {
    const auth = request.headers.get(INTERNAL_API.HEADER);

    if (auth !== `${INTERNAL_API.TOKEN_PREFIX} ${INTERNAL_API_SECRET}`) {
        return NextResponse.json(
            {
                success: false,
                error: 'Unauthorized',
            },
            {
                status: 401,
            },
        );
    }

    try {
        const expired = await sessionService.expireSessions();

        return NextResponse.json({
            success: true,
            expired,
        });
    } catch (error) {
        console.error('[EXPIRE SESSIONS] Erro:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Erro interno.',
            },
            {
                status: 500,
            },
        );
    }
}
