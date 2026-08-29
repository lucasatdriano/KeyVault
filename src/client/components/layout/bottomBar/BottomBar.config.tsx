import { KeyIcon, StarIcon, UserIcon, SettingsIcon } from 'lucide-react';

import { BottomBarItem } from '@/src/client/types/layout/bottomBar';

export const bottomBarItems: BottomBarItem[] = [
    {
        icon: KeyIcon,
        label: 'Credenciais',
        href: '/dashboard',
    },
    {
        icon: StarIcon,
        label: 'Favoritos',
        href: '/dashboard/favorites',
    },
    {
        icon: UserIcon,
        label: 'Conta',
        href: '/account',
    },
    {
        icon: SettingsIcon,
        label: 'Config.',
        href: '/account/settings',
    },
];
