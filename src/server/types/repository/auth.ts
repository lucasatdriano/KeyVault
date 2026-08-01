import { RecoveryMethod, RecoveryType } from '@/src/generated/prisma/client';

export interface CreateUserData {
    name: string;
    email: string;
    emailVerified: boolean;
    passwordHash: string;
    encryptedVaultKey: string;
    isRecoverable?: boolean;
    recoveryMethods?: Omit<
        RecoveryMethod,
        'id' | 'userId' | 'createdAt' | 'updatedAt'
    >[];
}

export interface CreateRecoveryMethodData {
    userId: string;
    type: RecoveryType;
    enabled?: boolean;
    encryptedVaultKey?: string | null;
    recoverySalt?: string | null;
}

export interface UpdateRecoveryMethodData {
    enabled?: boolean;
    encryptedVaultKey?: string | null;
    recoverySalt?: string | null;
}
