import { BottomBarItem } from '@/src/client/types/bottomBar';
import { KeyIcon, StarIcon, UserIcon, SettingsIcon } from 'lucide-react';

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
