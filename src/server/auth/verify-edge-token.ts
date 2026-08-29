import { jwtVerify, decodeJwt, errors } from 'jose';

import { JWTPayload } from '@/src/shared/types/jwt-payload';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export interface VerifyEdgeTokenResult {
    valid: boolean;
    expired: boolean;
    payload?: JWTPayload;
}

export async function verifyEdgeToken(
    token: string,
): Promise<VerifyEdgeTokenResult> {
    try {
        const { payload } = await jwtVerify(token, secret);

        return {
            valid: true,
            expired: false,
            payload: {
                sub: payload.sub as string,
                email: payload.email as string,
                sessionId: payload.sessionId as string,
                type: payload.type as 'access_token',
                exp: payload.exp as number,
                iat: payload.iat as number,
            },
        };
    } catch (error) {
        if (error instanceof errors.JWTExpired) {
            const payload = decodeJwt(token);

            return {
                valid: false,
                expired: true,
                payload: {
                    sub: payload.sub as string,
                    email: payload.email as string,
                    sessionId: payload.sessionId as string,
                    type: payload.type as 'access_token',
                    exp: payload.exp as number,
                    iat: payload.iat as number,
                },
            };
        }

        return {
            valid: false,
            expired: false,
        };
    }
}
