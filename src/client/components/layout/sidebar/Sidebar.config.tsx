import { SidebarSection } from '@/src/client/types/layout/sidebar';
import {
    ActivityIcon,
    FingerprintIcon,
    KeyIcon,
    SettingsIcon,
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
            },
            {
                icon: StarIcon,
                label: 'Favoritos',
                href: '/dashboard/favorites',
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
