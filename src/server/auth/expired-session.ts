import { NextRequest, NextResponse } from 'next/server';

import { ACCESS_TOKEN_COOKIE_NAME } from '@/src/shared/constants/auth/cookies.constants';

export function handleExpiredSession(request: NextRequest) {
    const response = NextResponse.redirect(new URL('/?expired=1', request.url));

    response.cookies.delete(ACCESS_TOKEN_COOKIE_NAME);

    response.headers.set('x-session-expired', 'true');

    return response;
}
