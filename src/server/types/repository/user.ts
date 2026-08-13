import { RecoveryMethod, User } from '@/src/generated/prisma/client';
import { Profile } from '@/src/shared/types/profile';
export interface ProfileWithRecoveryMethods {
    user: Profile;
    recoveryMethods: RecoveryMethod[];
}

export interface UpdateRecoveryMethodData {
    enabled?: boolean;
    encryptedVaultKey?: string | null;
    recoverySalt?: string | null;
}

export type UserWithRecoveryMethod = User & {
    recoveryMethod: RecoveryMethod | null;
};
