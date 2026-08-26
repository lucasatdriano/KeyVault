import { RecoveryType } from '@/src/generated/prisma/enums';

export const RECOVERY_ORDER: RecoveryType[] = [
    RecoveryType.EMAIL,
    RecoveryType.QUESTIONS,
    RecoveryType.RECOVERY_KEY,
];
