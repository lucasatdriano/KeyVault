import { JWT_ALGORITHM } from '@/src/shared/constants/auth/auth.constants';
import { getSubtle, toArrayBuffer } from '@/src/shared/crypto/webcrypto';
import { bytesToBase64 } from '@/src/shared/crypto/encoding';

export async function generateResourceSearchHash(
    value: string,
    vaultKey: Uint8Array,
): Promise<string> {
    const subtle = getSubtle();

    const key = await subtle.importKey(
        'raw',
        toArrayBuffer(vaultKey),
        JWT_ALGORITHM,
        false,
        ['sign'],
    );

    const signature = await subtle.sign(
        'HMAC',
        key,
        new TextEncoder().encode(`search:v1:${value.trim().toLowerCase()}`),
    );

    return bytesToBase64(new Uint8Array(signature));
}
