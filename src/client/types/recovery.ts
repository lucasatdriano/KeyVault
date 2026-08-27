import { RecoveryType } from '@/src/shared/types/recovery';

export interface RecoveryMethod {
    id: string;
    type: RecoveryType;
    enabled: boolean;
    secretHash?: string | null;
}

export interface QuizQuestion {
    id?: string;
    question: string;
    answer: string;
}

export interface RecoveryQuestion {
    id: string;
    question: string;
}

export interface RecoveryChallenge {
    currentStep: number;
    completedSteps: number;
    totalSteps: number;
    type: RecoveryType;
    attempts: number;
    maxAttempts: number;
    remainingAttempts: number;
    expiresAt: Date | string;
}
