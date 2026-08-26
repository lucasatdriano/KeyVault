export const RecoveryType = {
    EMAIL: 'EMAIL',
    QUESTIONS: 'QUESTIONS',
    RECOVERY_KEY: 'RECOVERY_KEY',
} as const;

export type RecoveryType = (typeof RecoveryType)[keyof typeof RecoveryType];
