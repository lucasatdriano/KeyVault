import {
    DEFAULT_BASE64_LENGTH,
    DEFAULT_HEX_LENGTH,
} from '@/src/shared/constants/crypto/encoding.constants';
import { bytesToBase64, bytesToHex } from './encoding';
import { DEFAULT_IV_LENGTH } from '@/src/shared/constants/crypto/aes.constants';
import { DEFAULT_SALT_LENGTH } from '@/src/shared/constants/crypto/random.constants';
import { getCrypto } from './webcrypto';

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
