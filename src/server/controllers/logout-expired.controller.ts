import { NextRequest, NextResponse } from 'next/server';

import {
    INTERNAL_API,
    INTERNAL_API_SECRET,
} from '@/src/shared/constants/api/api.constants';

import { authService } from '@/src/server/containers/services';
import { getAuditContext } from '@/src/server/utils/audit-context';

export async function logoutExpiredController(request: NextRequest) {
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
        const body = await request.json();
        const audit = await getAuditContext();

        await authService.logoutByUserId(body.userId, audit);

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error('[LOGOUT EXPIRED] Erro:', error);

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
