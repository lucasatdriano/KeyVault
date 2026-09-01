import { KeyIcon, StarIcon, SettingsIcon, FingerprintIcon } from 'lucide-react';

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
        icon: FingerprintIcon,
        label: 'Recup.',
        href: '/account/recovery',
    },
    {
        icon: SettingsIcon,
        label: 'Config.',
        href: '/account/settings',
    },
];
