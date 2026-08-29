export interface JWTPayload {
    sub: string;
    email: string;
    sessionId: string;
    type: 'access_token';
    iat: number;
    exp: number;
}

export interface LogoutPayload {
    sub: string;
    type: 'expired_logout';
    iat: number;
    exp: number;
}
