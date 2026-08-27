import { RecoveryType } from '@/src/generated/prisma/enums';

export interface StartRecoveryResult {
    token: string;
    totalSteps: number;
    currentStep: number;
    nextMethod: RecoveryType;
    expiresAt: Date;
}

export interface CurrentRecoveryChallengeResult {
    currentStep: number;
    completedSteps: number;
    totalSteps: number;
    type: RecoveryType;
    attempts: number;
    maxAttempts: number;
    remainingAttempts: number;
    expiresAt: Date;
}

export interface RecoveryQuestionData {
    question: string;
    answer: string;
}

export interface RecoveryQuestionChallengeData {
    id: string;
    question: string;
}

export interface RecoveryQuestionsChallengeResult {
    currentStep: number;
    completedSteps: number;
    totalSteps: number;
    attempts: number;
    maxAttempts: number;
    remainingAttempts: number;
    questions: RecoveryQuestionChallengeData[];
}

export interface RecoveryChallengeResult {
    completed: boolean;
    nextMethod: RecoveryType | null;
    currentStep: number;
    completedSteps: number;
    totalSteps: number;
    expiresAt: Date;
}
