import { NextRequest, NextResponse } from 'next/server';

import { sessionService } from '../containers/services';

export async function expireSessionsController(request: NextRequest) {
    const auth = request.headers.get('authorization');

    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
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
