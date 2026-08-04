import {
    CRYPTO_VERSION,
    VAULT_KEY_LENGTH,
} from '@/src/shared/constants/crypto/vault.constants';
import { EncryptedVault } from '../../types/crypto/vault';

export function validateVaultKey(vaultKey: Uint8Array): void {
    if (!(vaultKey instanceof Uint8Array)) {
        throw new Error('VaultKey inválida.');
    }

    if (vaultKey.length !== VAULT_KEY_LENGTH) {
        throw new Error(`VaultKey deve possuir ${VAULT_KEY_LENGTH} bytes.`);
    }
}

export function validateEncryptedVault(vault: EncryptedVault): void {
    if (!vault || typeof vault !== 'object') {
        throw new Error('Vault inválido.');
    }

    if (vault.version !== CRYPTO_VERSION) {
        throw new Error(`Versão ${vault.version} não suportada.`);
    }

    if (!vault.ciphertext) {
        throw new Error('Ciphertext inválido.');
    }

    if (!vault.iv) {
        throw new Error('IV inválido.');
    }

    if (!vault.salt) {
        throw new Error('Salt inválido.');
    }

    if (!vault.argon2) {
        throw new Error('Parâmetros Argon2 inválidos.');
    }
}
