import { DEFAULT_KEY_LENGTH } from '@/src/shared/constants/crypto/random.constants';
import {
    DEFAULT_SALT,
    EXPORT_INFO,
    HKDF_ALGORITHM,
    HMAC_INFO,
    VAULT_INFO,
} from '@/src/shared/constants/crypto/hkdf.constants';
import { getSubtle, toArrayBuffer } from '@/src/shared/crypto/webcrypto';
import {
    validateKeyLength,
    validateMasterKey,
} from '@/src/shared/validators/crypto/key.validator';
import { validateInfo } from '@/src/shared/validators/crypto/common.validator';
import { validateSalt } from '@/src/shared/validators/crypto/argon2.validator';
import {
    DeriveExportKeyParams,
    DeriveHmacKeyParams,
    DeriveVaultKeyParams,
    HKDFDeriveKeyParams,
} from '@/src/shared/types/crypto/hkdf';

export async function deriveHKDFKey(
    params: HKDFDeriveKeyParams,
): Promise<Uint8Array> {
    validateMasterKey(params.masterKey);
    validateInfo(params.info);

    if (params.salt) {
        validateSalt(params.salt);
    }

    const length = params.length || DEFAULT_KEY_LENGTH;
    validateKeyLength(length);

    const salt = toArrayBuffer(params.salt || DEFAULT_SALT);
    const keyLengthBytes = length;

    try {
        const subtle = getSubtle();

        const key = await subtle.importKey(
            'raw',
            toArrayBuffer(params.masterKey),
            { name: HKDF_ALGORITHM.name },
            false,
            ['deriveBits'],
        );

        const derivedBits = await subtle.deriveBits(
            {
                ...HKDF_ALGORITHM,
                salt,
                info: toArrayBuffer(params.info),
            },
            key,
            keyLengthBytes * 8,
        );

        return new Uint8Array(derivedBits);
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : 'Erro desconhecido';

        if (
            errorMessage.includes('not supported') ||
            errorMessage.includes('Algorithm')
        ) {
            throw new Error(
                `deriveHKDFKey: HKDF não é suportado neste ambiente. ` +
                    `Certifique-se de usar um browser moderno ou Node.js com suporte a HKDF.`,
            );
        }

        throw new Error(
            `deriveHKDFKey: Falha ao derivar chave - ${errorMessage}`,
        );
    }
}

// Talvez eu use
export async function deriveVaultKey(
    params: DeriveVaultKeyParams,
): Promise<Uint8Array> {
    return deriveHKDFKey({
        masterKey: params.masterKey,
        salt: params.salt,
        info: VAULT_INFO,
        length: params.length || DEFAULT_KEY_LENGTH,
    });
}

export async function deriveHmacKey(
    params: DeriveHmacKeyParams,
): Promise<Uint8Array> {
    return deriveHKDFKey({
        masterKey: params.masterKey,
        salt: params.salt,
        info: HMAC_INFO,
        length: params.length || DEFAULT_KEY_LENGTH,
    });
}

export async function deriveExportKey(
    params: DeriveExportKeyParams,
): Promise<Uint8Array> {
    return deriveHKDFKey({
        masterKey: params.masterKey,
        salt: params.salt,
        info: EXPORT_INFO,
        length: params.length || DEFAULT_KEY_LENGTH,
    });
}
