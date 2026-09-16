import { DEFAULT_ARGON2_PARAMS } from '@/src/shared/constants/crypto/argon2.constants';
import { DEFAULT_KEY_LENGTH } from '@/src/shared/constants/crypto/random.constants';
import {
    generateRandomKey,
    generateIV,
    generateSalt,
} from '@/src/shared/crypto/random';
import { decrypt, encrypt, importAESKey } from '@/src/shared/crypto/aes';
import { base64ToBytes, bytesToBase64 } from '@/src/shared/crypto/encoding';
import { deriveArgon2Key } from '@/src/shared/crypto/argon2';
import { RecoveryDataPayload } from '@/src/shared/types/recovery';
import { EncryptedRecoveryVaultKey } from '@/src/shared/types/crypto/recovery';

export function createRecoveryDataKey(): Uint8Array {
    return generateRandomKey();
}

function normalizeSecret(secret: string): string {
    const normalized = secret.trim();

    if (!normalized) {
        throw new Error('Segredo de recuperação inválido.');
    }

    return normalized;
}

export function combineRecoverySecrets(secrets: string[]): Uint8Array {
    if (secrets.length === 0) {
        throw new Error(
            'É necessário possuir pelo menos um método de recuperação.',
        );
    }

    const normalizedSecrets = secrets.map(normalizeSecret);

    const encoder = new TextEncoder();

    const combined = normalizedSecrets
        .map((secret) => `${secret.length}:${secret}`)
        .join('|');

    return encoder.encode(combined);
}

export async function deriveRecoveryDataKey(
    secrets: string[],
    salt: Uint8Array,
): Promise<Uint8Array> {
    if (secrets.length === 0) {
        throw new Error('Nenhum segredo de recuperação foi informado.');
    }

    if (!salt?.length) {
        throw new Error('Salt de recuperação inválido.');
    }

    const combinedSecrets = combineRecoverySecrets(secrets);

    try {
        return await deriveArgon2Key({
            password: bytesToBase64(combinedSecrets),
            salt,
            params: DEFAULT_ARGON2_PARAMS,
            hashLength: DEFAULT_KEY_LENGTH,
        });
    } finally {
        combinedSecrets.fill(0);
    }
}

export async function createRecoveryData({
    vaultKey,
    recoverySecrets,
    salt,
}: {
    vaultKey: Uint8Array;
    recoverySecrets: string[];
    salt?: Uint8Array;
}): Promise<RecoveryDataPayload> {
    if (!vaultKey?.length) {
        throw new Error('Chave do cofre não encontrada.');
    }

    if (!recoverySecrets?.length) {
        throw new Error('É necessário informar os segredos de recuperação.');
    }

    const recoverySalt = salt ?? generateSalt();

    if (!recoverySalt.length) {
        throw new Error('Salt de recuperação inválido.');
    }

    const recoveryDataKey = await deriveRecoveryDataKey(
        recoverySecrets,
        recoverySalt,
    );

    try {
        const encryptedVaultKey = await encryptRecoveryVaultKey(
            vaultKey,
            recoveryDataKey,
        );

        return {
            salt: bytesToBase64(recoverySalt),
            vaultKeyCipherText: encryptedVaultKey.cipherText,
            vaultKeyIv: encryptedVaultKey.iv,
        };
    } finally {
        recoveryDataKey.fill(0);
    }
}

export async function createRecoveryDataKeyFromSecrets(
    recoverySecrets: string[],
): Promise<{
    salt: Uint8Array;
    recoveryDataKey: Uint8Array;
}> {
    if (!recoverySecrets?.length) {
        throw new Error('É necessário informar os segredos de recuperação.');
    }

    const salt = generateSalt();

    const recoveryDataKey = await deriveRecoveryDataKey(recoverySecrets, salt);

    return {
        salt,
        recoveryDataKey,
    };
}

export async function decryptRecoveryVaultKeyFromSecrets({
    encryptedVaultKey,
    recoverySecrets,
    salt,
}: {
    encryptedVaultKey: EncryptedRecoveryVaultKey;
    recoverySecrets: string[];
    salt: string;
}): Promise<Uint8Array> {
    if (!recoverySecrets?.length) {
        throw new Error('Nenhum segredo de recuperação foi informado.');
    }

    if (!salt) {
        throw new Error('Salt de recuperação não encontrado.');
    }

    const saltBytes = base64ToBytes(salt);

    try {
        const recoveryDataKey = await deriveRecoveryDataKey(
            recoverySecrets,
            saltBytes,
        );

        try {
            return await decryptRecoveryVaultKey(
                encryptedVaultKey,
                recoveryDataKey,
            );
        } finally {
            recoveryDataKey.fill(0);
        }
    } finally {
        saltBytes.fill(0);
    }
}

export async function encryptRecoveryVaultKey(
    vaultKey: Uint8Array,
    recoveryDataKey: Uint8Array,
): Promise<EncryptedRecoveryVaultKey> {
    if (!vaultKey?.length) {
        throw new Error('Vault Key inválida.');
    }

    if (
        !recoveryDataKey?.length ||
        recoveryDataKey.length !== DEFAULT_KEY_LENGTH
    ) {
        throw new Error('RecoveryDataKey inválida.');
    }

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
    if (
        !recoveryDataKey?.length ||
        recoveryDataKey.length !== DEFAULT_KEY_LENGTH
    ) {
        throw new Error('RecoveryDataKey inválida.');
    }

    const key = await importAESKey({
        keyData: recoveryDataKey,
    });

    return decrypt({
        key,
        ciphertext: base64ToBytes(encryptedVaultKey.cipherText),
        iv: base64ToBytes(encryptedVaultKey.iv),
    });
}

export async function deriveQuestionEncryptionKey(
    email: string,
): Promise<Uint8Array> {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
        throw new Error('E-mail inválido.');
    }

    const keyMaterial = `keyvault:recovery:questions:${normalizedEmail}`;

    const encoder = new TextEncoder();

    const salt = encoder.encode('keyvault:recovery:questions:v1');

    return deriveArgon2Key({
        password: keyMaterial,
        salt,
        params: DEFAULT_ARGON2_PARAMS,
        hashLength: 32,
    });
}
