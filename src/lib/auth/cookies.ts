import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'session';

const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 dias
const REMEMBER_DURATION = 60 * 60 * 24 * 30; // 30 dias

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
};

export async function getSessionCookie(): Promise<string | undefined> {
    const cookieStore = await cookies();

    return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

export async function setSessionCookie(
    token: string,
    remember = false,
): Promise<void> {
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, token, {
        ...COOKIE_OPTIONS,
        maxAge: remember ? REMEMBER_DURATION : SESSION_DURATION,
    });
}

export async function deleteSessionCookie(): Promise<void> {
    const cookieStore = await cookies();

    cookieStore.delete(SESSION_COOKIE_NAME);
}
