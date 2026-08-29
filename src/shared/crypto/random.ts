import {
    DEFAULT_BASE64_LENGTH,
    DEFAULT_HEX_LENGTH,
} from '@/src/shared/constants/crypto/encoding.constants';
import { DEFAULT_IV_LENGTH } from '@/src/shared/constants/crypto/aes.constants';
import { DEFAULT_SALT_LENGTH } from '@/src/shared/constants/crypto/random.constants';
import { bytesToBase64, bytesToHex } from '@/src/shared/crypto/encoding';
import { getCrypto } from '@/src/shared/crypto/webcrypto';

export function generateRandomBytes(length: number): Uint8Array {
    if (!Number.isInteger(length) || length <= 0) {
        throw new Error(
            `generateRandomBytes: length deve ser um inteiro positivo. Recebido: ${length}`,
        );
    }

    const crypto = getCrypto();

    return crypto.getRandomValues(new Uint8Array(length));
}

export function generateRandomBase64(
    length: number = DEFAULT_BASE64_LENGTH,
): string {
    const bytes = generateRandomBytes(length);
    return bytesToBase64(bytes);
}

export function generateRandomHex(length: number = DEFAULT_HEX_LENGTH): string {
    const bytes = generateRandomBytes(length);
    return bytesToHex(bytes);
}

export function generateIV(length: number = DEFAULT_IV_LENGTH): Uint8Array {
    return generateRandomBytes(length);
}

export function generateSalt(length: number = DEFAULT_SALT_LENGTH): Uint8Array {
    return generateRandomBytes(length);
}

export function generateUUID(): string {
    const crypto = getCrypto();

    return crypto.randomUUID();
}

export async function generateSha256(data: string): Promise<string> {
    const crypto = getCrypto();

    const encoded = new TextEncoder().encode(data);

    const hash = await crypto.subtle.digest('SHA-256', encoded);

    return bytesToHex(new Uint8Array(hash));
}

export function generateRecoveryKey(): string {
    const segments = Array.from({ length: 3 }, () =>
        generateRandomHex(3).toUpperCase(),
    );

    return `KV-${segments.join('-')}`;
}
