import { SidebarSection } from '@/src/client/types/layout/sidebar';
import {
    ActivityIcon,
    FingerprintIcon,
    KeyIcon,
    SettingsIcon,
    ShieldIcon,
    StarIcon,
    Trash2Icon,
    UserIcon,
} from 'lucide-react';

export const sidebarSections: SidebarSection[] = [
    {
        title: 'CREDENCIAIS',
        items: [
            {
                icon: KeyIcon,
                label: 'Minhas Credenciais',
                href: '/dashboard',
                count: 8,
            },
            {
                icon: StarIcon,
                label: 'Favoritos',
                href: '/dashboard/favorites',
                count: 3,
            },
            {
                icon: Trash2Icon,
                label: 'Lixeira',
                href: '/dashboard/trash',
            },
        ],
    },
    {
        title: 'CONTA',
        items: [
            {
                icon: UserIcon,
                label: 'Conta',
                href: '/account',
            },
            {
                icon: ShieldIcon,
                label: 'Segurança',
                href: '/account/security',
            },
            {
                icon: FingerprintIcon,
                label: 'Recuperação',
                href: '/account/recovery',
            },
            {
                icon: ActivityIcon,
                label: 'Auditoria',
                href: '/account/audit',
            },
            {
                icon: SettingsIcon,
                label: 'Configurações',
                href: '/account/settings',
            },
        ],
    },
];
