import { jwtService } from '../../containers/services';
import { JWTPayload } from '../../types/service/jwt';

export async function validateAccessToken(token: string): Promise<boolean> {
    if (!token) {
        return false;
    }

    const result = await jwtService.verifyAccessToken(token);

    return result.valid;
}

export async function getAccessTokenPayload(
    token: string,
): Promise<JWTPayload> {
    const result = await jwtService.verifyAccessToken(token);

    if (!result.valid || !result.payload) {
        throw new Error(result.error ?? 'Token inválido.');
    }

    return result.payload;
}
