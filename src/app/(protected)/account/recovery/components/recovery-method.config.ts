import { RecoveryType } from '@/src/shared/types/recovery';
import {
    HelpCircleIcon,
    KeyIcon,
    LockKeyholeIcon,
    MailIcon,
    type LucideIcon,
} from 'lucide-react';

export interface RecoveryMethodConfig {
    type: RecoveryType;
    name: string;
    description: string;
    risk: string;
    riskLevel: 'low' | 'medium' | 'high';
    riskDescription: string;
    icon: LucideIcon;
    isDisabled: boolean;
    disabledReason?: string;
}

export const recoveryMethodConfig: Record<RecoveryType, RecoveryMethodConfig> =
    {
        [RecoveryType.EMAIL]: {
            type: RecoveryType.EMAIL,
            name: 'E-mail de recuperação',
            description:
                'Utilize o e-mail cadastrado para verificar sua identidade.',
            risk: 'Baixo',
            riskLevel: 'low',
            riskDescription: 'requer acesso ao e-mail cadastrado',
            icon: MailIcon,
            isDisabled: true,
            disabledReason: 'Esta funcionalidade estará disponível em breve.',
        },

        [RecoveryType.QUESTIONS]: {
            type: RecoveryType.QUESTIONS,
            name: 'Perguntas de segurança',
            description: 'Responda às perguntas configuradas por você.',
            risk: 'Médio',
            riskLevel: 'medium',
            riskDescription: 'requer conhecimento das respostas',
            icon: HelpCircleIcon,
            isDisabled: false,
        },

        [RecoveryType.RECOVERY_PASSWORD]: {
            type: RecoveryType.RECOVERY_PASSWORD,
            name: 'Senha de recuperação',
            description: 'Utilize a senha de recuperação configurada por você.',
            risk: 'Médio',
            riskLevel: 'medium',
            riskDescription: 'requer conhecimento da senha de recuperação',
            icon: LockKeyholeIcon,
            isDisabled: false,
        },

        [RecoveryType.RECOVERY_KEY]: {
            type: RecoveryType.RECOVERY_KEY,
            name: 'Chave de recuperação',
            description: 'Utilize sua chave de recuperação de emergência.',
            risk: 'Baixo',
            riskLevel: 'low',
            riskDescription: 'requer acesso à chave de recuperação',
            icon: KeyIcon,
            isDisabled: false,
        },
    };
