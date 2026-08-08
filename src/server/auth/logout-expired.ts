import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_TOKEN_COOKIE_NAME } from '@/src/shared/constants/auth/cookies.constants';
import { notifyExpiredSession } from './notify-expired-session';

export async function handleExpiredSession(
    request: NextRequest,
    userId: string,
) {
    await notifyExpiredSession(request, userId);

    const response = NextResponse.redirect(new URL('/?expired=1', request.url));

    response.cookies.delete(ACCESS_TOKEN_COOKIE_NAME);

    return response;
}
