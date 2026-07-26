import { cookies } from 'next/headers';
import {
    COOKIE_OPTIONS,
    REMEMBER_DURATION,
    SESSION_COOKIE_NAME,
    SESSION_DURATION,
} from '../constants/cookies';

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
