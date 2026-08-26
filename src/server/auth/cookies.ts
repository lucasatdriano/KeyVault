import { cookies } from 'next/headers';

import {
    ACCESS_TOKEN_COOKIE_NAME,
    COOKIE_OPTIONS,
} from '../../shared/constants/auth/cookies.constants';

export async function getAccessToken(): Promise<string | undefined> {
    const cookieStore = await cookies();

    return cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;
}

export async function setAccessToken(
    token: string,
    duration: number,
): Promise<void> {
    const cookieStore = await cookies();

    cookieStore.set(ACCESS_TOKEN_COOKIE_NAME, token, {
        ...COOKIE_OPTIONS,
        maxAge: duration,
    });
}

export async function deleteAccessToken(): Promise<void> {
    const cookieStore = await cookies();

    cookieStore.delete(ACCESS_TOKEN_COOKIE_NAME);
}
