export const HKDF_ALGORITHM = {
    name: 'HKDF',
    hash: 'SHA-256',
} as const;

export const VAULT_INFO = new TextEncoder().encode('vault-encryption-key');

export const HMAC_INFO = new TextEncoder().encode('hmac-authentication-key');

export const EXPORT_INFO = new TextEncoder().encode('export-encryption-key');

export const DEFAULT_SALT = new Uint8Array(32);
