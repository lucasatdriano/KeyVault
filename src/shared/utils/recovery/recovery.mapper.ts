import { RecoveryType } from '@/src/generated/prisma/enums';

export const recoveryTypeMap: Record<RecoveryType, string> = {
    EMAIL: 'E-mail',
    QUESTIONS: 'Perguntas de Segurança',
    RECOVERY_PASSWORD: 'Senha de Recuperação',
    RECOVERY_KEY: 'Chave de Recuperação',
};

export function mapRecoveryType(type: RecoveryType): string {
    return recoveryTypeMap[type] || type;
}
