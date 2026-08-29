export const ACCESS_TOKEN_COOKIE_NAME = 'access_token';

export const COOKIE_MAX_AGE = 3 * 60 * 60;

export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
};
