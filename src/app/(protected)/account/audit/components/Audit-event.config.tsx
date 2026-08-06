import {
    ActivityIcon,
    EditIcon,
    KeyIcon,
    LogInIcon,
    LogOutIcon,
    LucideIcon,
    PlusIcon,
    Trash2Icon,
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

    password: {
        icon: KeyIcon,
        iconClass: 'text-purple',
        badgeClass: 'bg-purple/20 text-purple border-purple/30',
        label: 'Senha',
    },
};

export const defaultAuditEvent: AuditEventConfigItem = {
    icon: ActivityIcon,
    iconClass: 'text-foreground/40',
    badgeClass: 'bg-white/5 text-foreground/40 border-white/10',
    label: 'Atividade',
};
