import { getSubtle } from './webcrypto';
import { bytesToBase64 } from './encoding';

const SEARCH_SECRET = process.env.SEARCH_SECRET ?? process.env.JWT_SECRET ?? '';

export async function generateResourceSearchHash(
    value: string,
): Promise<string> {
    if (!SEARCH_SECRET) {
        throw new Error('SEARCH_SECRET não configurado');
    }

    const subtle = getSubtle();

    const key = await subtle.importKey(
        'raw',
        new TextEncoder().encode(SEARCH_SECRET),
        {
            name: 'HMAC',
            hash: 'SHA-256',
        },
        false,
        ['sign'],
    );

    const signature = await subtle.sign(
        'HMAC',
        key,
        new TextEncoder().encode(value.trim().toLowerCase()),
    );

    return bytesToBase64(new Uint8Array(signature));
}
