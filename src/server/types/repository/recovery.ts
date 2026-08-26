import {
    RecoveryChallenge,
    RecoverySession,
} from '@/src/generated/prisma/client';
import { RecoveryType } from '@/src/generated/prisma/enums';

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

    currentStep?: number;
    completedSteps?: number;
    completedAt?: Date | null;
}

export interface UpdateRecoverySessionData {
    currentStep?: number;
    completedSteps?: number;
    completedAt?: Date | null;
}

export interface CreateRecoveryChallengeData {
    sessionId: string;
    type: RecoveryType;
    step: number;
    tokenHash?: string | null;
    expiresAt: Date;
}

export type RecoverySessionWithChallenges = RecoverySession & {
    challenges: RecoveryChallenge[];
};

// service
export interface RecoveryQuestionData {
    questionCipherText: string;
    questionIv: string;
    answer: string;
}
