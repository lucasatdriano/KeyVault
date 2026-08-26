import { base64ToBytes, bytesToBase64 } from '@/src/shared/crypto/encoding';
import { JWT_ALGORITHM } from '@/src/shared/constants/auth/auth.constants';
import { JWTPayload } from '@/src/shared/types/jwt-payload';
import { getSubtle } from '@/src/shared/crypto/webcrypto';

import { VerifyTokenResult } from '@/src/server/types/service/jwt';

export class JWTService {
    private readonly secret: string;

    constructor(secret?: string) {
        this.secret = secret ?? process.env.JWT_SECRET ?? '';

        if (!this.secret) {
            throw new Error('JWT_SECRET não configurado.');
        }
    }

    async generateAccessToken(
        userId: string,
        email: string,
        expiresIn: number,
    ): Promise<string> {
        const now = Math.floor(Date.now() / 1000);

        const payload: JWTPayload = {
            sub: userId,
            email,
            type: 'access_token',
            iat: now,
            exp: now + expiresIn,
        };

        const header = bytesToBase64(
            new TextEncoder().encode(
                JSON.stringify({
                    alg: 'HS256',
                    typ: 'JWT',
                }),
            ),
        );

        const body = bytesToBase64(
            new TextEncoder().encode(JSON.stringify(payload)),
        );

        const signature = await this.sign(`${header}.${body}`);

        return `${header}.${body}.${signature}`;
    }

    async verifyAccessToken(token: string): Promise<VerifyTokenResult> {
        try {
            const parts = token.split('.');

            if (parts.length !== 3) {
                return {
                    valid: false,
                    error: 'Token inválido.',
                };
            }

            const [header, payload, signature] = parts;

            const expected = await this.sign(`${header}.${payload}`);

            if (signature !== expected) {
                return {
                    valid: false,
                    error: 'Assinatura inválida.',
                };
            }

            const decoded = JSON.parse(
                new TextDecoder().decode(base64ToBytes(payload)),
            ) as JWTPayload;

            if (decoded.type !== 'access_token') {
                return {
                    valid: false,
                    error: 'Tipo de token inválido.',
                };
            }

            const now = Math.floor(Date.now() / 1000);

            if (decoded.exp <= now) {
                return {
                    valid: false,
                    error: 'Token expirado.',
                };
            }

            return {
                valid: true,
                payload: decoded,
            };
        } catch {
            return {
                valid: false,
                error: 'Token inválido.',
            };
        }
    }

    decodeAccessToken(token: string): JWTPayload | null {
        try {
            const payload = token.split('.')[1];

            return JSON.parse(
                new TextDecoder().decode(base64ToBytes(payload)),
            ) as JWTPayload;
        } catch {
            return null;
        }
    }

    isTokenExpired(token: string): boolean {
        const payload = this.decodeAccessToken(token);

        if (!payload) {
            return true;
        }

        return payload.exp <= Math.floor(Date.now() / 1000);
    }

    async importSecretKey(): Promise<CryptoKey> {
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error('JWT_SECRET não configurado.');
        }

        const subtle = getSubtle();

        return subtle.importKey(
            'raw',
            new TextEncoder().encode(secret),
            JWT_ALGORITHM,
            false,
            ['sign', 'verify'],
        );
    }

    async sign(data: string): Promise<string> {
        const key = await this.importSecretKey();

        const subtle = getSubtle();

        const signature = await subtle.sign(
            JWT_ALGORITHM.name,
            key,
            new TextEncoder().encode(data),
        );

        return bytesToBase64(new Uint8Array(signature));
    }
}
