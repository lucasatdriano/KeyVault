export const RecoveryType = {
    EMAIL: 'EMAIL',
    QUESTIONS: 'QUESTIONS',
    RECOVERY_PASSWORD: 'RECOVERY_PASSWORD',
    RECOVERY_KEY: 'RECOVERY_KEY',
} as const;

export type RecoveryType = (typeof RecoveryType)[keyof typeof RecoveryType];

export interface RecoveryDataPayload {
    encryptedDataKey: string;
    iv: string;
    salt: string;
    vaultKeyCipherText: string;
    vaultKeyIv: string;
}
