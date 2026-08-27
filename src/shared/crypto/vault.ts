import {
    CRYPTO_VERSION,
    VAULT_KEY_LENGTH,
} from '@/src/shared/constants/crypto/vault.constants';
import { DEFAULT_ARGON2_PARAMS } from '@/src/shared/constants/crypto/argon2.constants';
import {
    generateIV,
    generateRandomBytes,
    generateSalt,
} from '../crypto/random';
import { decrypt, encrypt, importAESKey } from './aes';
import { base64ToBytes, bytesToBase64 } from '../crypto/encoding';
import {
    validateEncryptedVault,
    validateVaultKey,
} from '../validators/crypto/vault.validator';
import { validateSecret } from '../validators/auth/secret.validator';
import { deriveArgon2Key } from './argon2';
import { EncryptedVault } from '../types/crypto/vault';
import { Argon2Params } from '../types/crypto/argon2';

export function createVaultKey(): Uint8Array {
    return generateRandomBytes(VAULT_KEY_LENGTH);
}

export async function encryptVaultKey(
    vaultKey: Uint8Array,
    masterPassword: string,
    params: Argon2Params = DEFAULT_ARGON2_PARAMS,
): Promise<EncryptedVault> {
    validateVaultKey(vaultKey);
    validateSecret(masterPassword);

    const salt = generateSalt();

    const kekBytes = await deriveArgon2Key({
        password: masterPassword,
        salt,
        params,
    });

    const kek = await importAESKey({
        keyData: kekBytes,
    });

    const iv = generateIV();

    try {
        const ciphertext = await encrypt({
            key: kek,
            data: vaultKey,
            iv,
        });

        return {
            version: CRYPTO_VERSION,
            ciphertext: bytesToBase64(ciphertext),
            iv: bytesToBase64(iv),
            salt: bytesToBase64(salt),
            argon2: params,
        };
    } finally {
        kekBytes.fill(0);
    }
}

export async function decryptVaultKey(
    encryptedVault: EncryptedVault,
    masterPassword: string,
): Promise<Uint8Array> {
    validateEncryptedVault(encryptedVault);
    validateSecret(masterPassword);

    const salt = base64ToBytes(encryptedVault.salt);
    const iv = base64ToBytes(encryptedVault.iv);
    const ciphertext = base64ToBytes(encryptedVault.ciphertext);

    const kekBytes = await deriveArgon2Key({
        password: masterPassword,
        salt,
        params: encryptedVault.argon2,
    });

    const kek = await importAESKey({
        keyData: kekBytes,
    });

    try {
        const vaultKey = await decrypt({
            key: kek,
            ciphertext,
            iv,
        });

        validateVaultKey(vaultKey);

        return vaultKey;
    } catch {
        throw new Error(
            'decryptVaultKey: senha incorreta ou dados corrompidos.',
        );
    } finally {
        kekBytes.fill(0);
    }
}

export async function changeMasterPassword(
    encryptedVault: EncryptedVault,
    oldMasterPassword: string,
    newMasterPassword: string,
    params: Argon2Params = DEFAULT_ARGON2_PARAMS,
): Promise<EncryptedVault> {
    validateSecret(oldMasterPassword);
    validateSecret(newMasterPassword);

    if (oldMasterPassword === newMasterPassword) {
        throw new Error('A nova senha deve ser diferente da atual.');
    }

    const vaultKey = await decryptVaultKey(encryptedVault, oldMasterPassword);

    try {
        return await encryptVaultKey(vaultKey, newMasterPassword, params);
    } finally {
        vaultKey.fill(0);
    }
}
