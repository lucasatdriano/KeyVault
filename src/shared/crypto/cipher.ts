import { encrypt, decrypt, importAESKey } from '@/src/shared/crypto/aes';
import { base64ToBytes, bytesToBase64 } from '@/src/shared/crypto/encoding';
import { generateIV } from '@/src/shared/crypto/random';
import {
    validateDecrypt,
    validateEncrypt,
} from '@/src/shared/validators/crypto/cipher.validator';
import { EncryptedField } from '@/src/shared/types/crypto/cipher';

export async function encryptString(text: string, vaultKey: Uint8Array) {
    validateEncrypt(text, vaultKey);

    const key = await importAESKey({
        keyData: vaultKey,
        encrypt: true,
        decrypt: false,
    });

    const iv = generateIV();

    const encrypted = await encrypt({
        key,
        data: new TextEncoder().encode(text),
        iv,
    });

    return {
        cipherText: bytesToBase64(encrypted),
        iv: bytesToBase64(iv),
    };
}

export async function decryptString(
    encrypted: EncryptedField,
    vaultKey: Uint8Array,
): Promise<string> {
    validateDecrypt(encrypted, vaultKey);

    const key = await importAESKey({
        keyData: vaultKey,
    });

    const plaintext = await decrypt({
        key,
        iv: base64ToBytes(encrypted.iv),
        ciphertext: base64ToBytes(encrypted.cipherText),
    });

    return new TextDecoder().decode(plaintext);
}
