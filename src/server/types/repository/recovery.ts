import {
    RecoveryChallenge,
    RecoverySession,
    RecoverySessionStatus,
} from '@/src/generated/prisma/client';

import { RecoveryType } from '@/src/generated/prisma/enums';
import { RecoveryDataPayload } from '@/src/shared/types/recovery';

export interface CreateRecoveryMethodData {
    userId: string;
    type: RecoveryType;
    enabled?: boolean;
    secretHash?: string | null;
}

export interface UpdateRecoveryMethodData {
    enabled?: boolean;
    secretHash?: string | null;
}

export interface CreateRecoveryDataData extends RecoveryDataPayload {
    userId: string;
}

export interface UpdateRecoveryDataData {
    encryptedDataKey?: string;
    iv?: string;
    salt?: string;
    vaultKeyCipherText?: string;
    vaultKeyIv?: string;
}

export interface CreateRecoveryQuestionData {
    userId: string;
    questionCipherText: string;
    questionIv: string;
    answerHash: string;
}

export interface CreateRecoverySessionData {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    status?: RecoverySessionStatus;
    currentStep?: number;
    completedSteps?: number;
    completedAt?: Date | null;
}

export interface UpdateRecoverySessionData {
    status?: RecoverySessionStatus;
    currentStep?: number;
    completedSteps?: number;
    completedAt?: Date | null;
}

export interface CreateRecoveryChallengeData {
    sessionId: string;
    type: RecoveryType;
    step: number;
    tokenHash?: string | null;
    attempts?: number;
    maxAttempts?: number;
    expiresAt: Date;
}

export interface UpdateRecoveryChallengeData {
    attempts?: number;
    maxAttempts?: number;
    completedAt?: Date | null;
    tokenHash?: string | null;
}

export type RecoverySessionWithChallenges = RecoverySession & {
    challenges: RecoveryChallenge[];
};
