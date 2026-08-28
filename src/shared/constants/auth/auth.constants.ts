export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ACCESS_TOKEN_DURATION = {
    MINUTES_30: 1 * 60,
    HOUR_1: 60 * 60,
    HOURS_2: 2 * 60 * 60,
} as const;

export const ACCESS_TOKEN_COOKIE_DURATION = {
    MINUTES_30: ACCESS_TOKEN_DURATION.MINUTES_30 + 60,
    HOUR_1: ACCESS_TOKEN_DURATION.HOUR_1 + 60,
    HOURS_2: ACCESS_TOKEN_DURATION.HOURS_2 + 60,
} as const;

export const JWT_ALGORITHM = {
    name: 'HMAC',
    hash: 'SHA-256',
} satisfies HmacImportParams;
