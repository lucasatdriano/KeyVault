import { DEFAULT_ARGON2_PARAMS } from '@/src/shared/constants/crypto/argon2.constants';
import { DEFAULT_KEY_LENGTH } from '@/src/shared/constants/crypto/random.constants';
import {
    generateRandomKey,
    generateIV,
    generateSalt,
} from '@/src/shared/crypto/random';
import { decrypt, encrypt, importAESKey } from '@/src/shared/crypto/aes';
import { base64ToBytes, bytesToBase64 } from '@/src/shared/crypto/encoding';
import { RecoveryDataPayload } from '@/src/shared/types/recovery';
import { deriveArgon2Key } from '@/src/shared/crypto/argon2';
import {
    DecryptRecoveryDataKeyParams,
    EncryptedRecoveryVaultKey,
    EncryptRecoveryDataKeyParams,
} from '@/src/shared/types/crypto/recovery';

export function createRecoveryDataKey(): Uint8Array {
    return generateRandomKey();
}

export async function createRecoveryData({
    vaultKey,
    email,
}: {
    vaultKey: Uint8Array;
    email: string;
}): Promise<RecoveryDataPayload> {
    if (!vaultKey) {
        throw new Error('Chave do cofre não encontrada.');
    }

    if (!email) {
        throw new Error('E-mail do usuário não encontrado.');
    }

    const recoveryDataKey = createRecoveryDataKey();

    try {
        const encryptedRecoveryDataKey = await encryptRecoveryDataKey({
            recoveryDataKey,
            email: email,
        });

        const encryptedRecoveryVaultKey = await encryptRecoveryVaultKey(
            vaultKey,
            recoveryDataKey,
        );

        return {
            encryptedDataKey: encryptedRecoveryDataKey.encryptedDataKey,
            iv: encryptedRecoveryDataKey.iv,
            salt: encryptedRecoveryDataKey.salt,
            vaultKeyCipherText: encryptedRecoveryVaultKey.cipherText,
            vaultKeyIv: encryptedRecoveryVaultKey.iv,
        };
    } finally {
        recoveryDataKey.fill(0);
    }
}

export async function encryptRecoveryDataKey({
    recoveryDataKey,
    email,
}: EncryptRecoveryDataKeyParams) {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
        throw new Error('O e-mail é obrigatório.');
    }

    if (recoveryDataKey.length !== DEFAULT_KEY_LENGTH) {
        throw new Error('RecoveryDataKey inválida.');
    }

    const salt = generateSalt();

    const wrappingKeyBytes = await deriveArgon2Key({
        password: normalizedEmail,
        salt,
        params: DEFAULT_ARGON2_PARAMS,
        hashLength: DEFAULT_KEY_LENGTH,
    });

    try {
        const wrappingKey = await importAESKey({
            keyData: wrappingKeyBytes,
        });

        const iv = generateIV();

        const encrypted = await encrypt({
            key: wrappingKey,
            data: recoveryDataKey,
            iv,
        });

        return {
            encryptedDataKey: bytesToBase64(encrypted),
            iv: bytesToBase64(iv),
            salt: bytesToBase64(salt),
        };
    } finally {
        wrappingKeyBytes.fill(0);
    }
}

export async function decryptRecoveryDataKey({
    encryptedDataKey,
    iv,
    salt,
    email,
}: DecryptRecoveryDataKeyParams): Promise<Uint8Array> {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
        throw new Error('O e-mail é obrigatório.');
    }

    const saltBytes = base64ToBytes(salt);

    const wrappingKeyBytes = await deriveArgon2Key({
        password: normalizedEmail,
        salt: saltBytes,
        params: DEFAULT_ARGON2_PARAMS,
        hashLength: DEFAULT_KEY_LENGTH,
    });

    try {
        const wrappingKey = await importAESKey({
            keyData: wrappingKeyBytes,
        });

        return await decrypt({
            key: wrappingKey,
            ciphertext: base64ToBytes(encryptedDataKey),
            iv: base64ToBytes(iv),
        });
    } catch {
        throw new Error(
            'Não foi possível descriptografar os dados de recuperação.',
        );
    } finally {
        wrappingKeyBytes.fill(0);
    }
}

export async function encryptRecoveryVaultKey(
    vaultKey: Uint8Array,
    recoveryDataKey: Uint8Array,
): Promise<EncryptedRecoveryVaultKey> {
    const key = await importAESKey({
        keyData: recoveryDataKey,
    });

    const iv = generateIV();

    const cipherText = await encrypt({
        key,
        data: vaultKey,
        iv,
    });

    return {
        cipherText: bytesToBase64(cipherText),
        iv: bytesToBase64(iv),
    };
}

export async function decryptRecoveryVaultKey(
    encryptedVaultKey: EncryptedRecoveryVaultKey,
    recoveryDataKey: Uint8Array,
): Promise<Uint8Array> {
    const key = await importAESKey({
        keyData: recoveryDataKey,
    });

    const vaultKey = await decrypt({
        key,
        ciphertext: base64ToBytes(encryptedVaultKey.cipherText),
        iv: base64ToBytes(encryptedVaultKey.iv),
    });

    return vaultKey;
}
