import { RecoveryType } from '@/src/generated/prisma/enums';

export const RECOVERY_ORDER: RecoveryType[] = [
    RecoveryType.EMAIL,
    RecoveryType.QUESTIONS,
    RecoveryType.RECOVERY_PASSWORD,
    RecoveryType.RECOVERY_KEY,
];

export const RECOVERY_MAX_ATTEMPTS: Record<RecoveryType, number> = {
    [RecoveryType.EMAIL]: 3,
    [RecoveryType.QUESTIONS]: 5,
    [RecoveryType.RECOVERY_PASSWORD]: 4,
    [RecoveryType.RECOVERY_KEY]: 4,
};
