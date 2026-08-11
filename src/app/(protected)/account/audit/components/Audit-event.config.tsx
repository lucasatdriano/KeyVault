import {
    ActivityIcon,
    EditIcon,
    KeyIcon,
    LogInIcon,
    LogOutIcon,
    LucideIcon,
    PlusIcon,
    Trash2Icon,
    UserIcon,
    RefreshCwIcon,
    ShieldIcon,
    RotateCcwIcon,
    UserCogIcon,
} from 'lucide-react';
import { AuditEventType } from '@/src/client/types/audit';

interface AuditEventConfigItem {
    icon: LucideIcon;
    iconClass: string;
    badgeClass: string;
    label: string;
}

export const auditEventConfig: Record<AuditEventType, AuditEventConfigItem> = {
    login: {
        icon: LogInIcon,
        iconClass: 'text-success',
        badgeClass: 'bg-success/20 text-success border-success/30',
        label: 'Login',
    },

    logout: {
        icon: LogOutIcon,
        iconClass: 'text-danger',
        badgeClass: 'bg-danger/20 text-danger border-danger/30',
        label: 'Logout',
    },

    register: {
        icon: UserIcon,
        iconClass: 'text-purple-500',
        badgeClass: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        label: 'Registro',
    },

    create: {
        icon: PlusIcon,
        iconClass: 'text-primary',
        badgeClass: 'bg-primary/20 text-primary border-primary/30',
        label: 'Nova senha',
    },

    edit: {
        icon: EditIcon,
        iconClass: 'text-warning',
        badgeClass: 'bg-warning/20 text-warning border-warning/30',
        label: 'Edição',
    },

    delete: {
        icon: Trash2Icon,
        iconClass: 'text-error',
        badgeClass: 'bg-error/20 text-error border-error/30',
        label: 'Exclusão',
    },

    restore: {
        icon: RotateCcwIcon,
        iconClass: 'text-teal-500',
        badgeClass: 'bg-teal-500/20 text-teal-500 border-teal-500/30',
        label: 'Restauração',
    },

    update_user: {
        icon: UserCogIcon,
        iconClass: 'text-sky-500',
        badgeClass: 'bg-sky-500/20 text-sky-500 border-sky-400/30',
        label: 'Atualização de usuário',
    },

    update_data: {
        icon: RefreshCwIcon,
        iconClass: 'text-cyan-500',
        badgeClass: 'bg-cyan-500/20 text-cyan-500 border-cyan-500/30',
        label: 'Atualização de dados',
    },

    recovery: {
        icon: ShieldIcon,
        iconClass: 'text-amber-500',
        badgeClass: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
        label: 'Recuperação',
    },

    password: {
        icon: KeyIcon,
        iconClass: 'text-pink-500',
        badgeClass: 'bg-pink-500/20 text-pink-500 border-pink-500/30',
        label: 'Senha',
    },
};

export const defaultAuditEvent: AuditEventConfigItem = {
    icon: ActivityIcon,
    iconClass: 'text-foreground/40',
    badgeClass: 'bg-white/5 text-foreground/40 border-white/10',
    label: 'Atividade',
};
