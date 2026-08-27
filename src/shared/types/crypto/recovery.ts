export interface EncryptRecoveryDataKeyParams {
    recoveryDataKey: Uint8Array;
    email: string;
}

export interface DecryptRecoveryDataKeyParams {
    encryptedDataKey: string;
    iv: string;
    salt: string;
    email: string;
}

export interface EncryptedRecoveryVaultKey {
    cipherText: string;
    iv: string;
}
