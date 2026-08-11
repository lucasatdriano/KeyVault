import { RecoveryMethod, User } from '@/src/generated/prisma/client';

export interface UpdateUserData {
    name?: string;
    email?: string;
}

export interface UpdateRecoveryMethodData {
    enabled?: boolean;
    encryptedVaultKey?: string | null;
    recoverySalt?: string | null;
}

export type UserWithRecoveryMethod = User & {
    recoveryMethod: RecoveryMethod | null;
};
