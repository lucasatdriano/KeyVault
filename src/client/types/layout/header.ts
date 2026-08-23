import { LucideIcon } from 'lucide-react';

export type HeaderVariant =
    | 'search'
    | 'favorites'
    | 'trash'
    | 'account'
    | 'recovery'
    | 'audit'
    | 'settings';

export interface HeaderConfig {
    icon: LucideIcon;
    iconClass: string;
    bgColor: string;
    defaultTitle: string;
    defaultSubtitle: string | ((count: number) => string);
    type: 'search' | 'simple';
    showNewButton?: boolean;
    showFilter?: boolean;
    searchPlaceholder?: string;
    filterOptions?: FilterOption[];
}

export interface FilterOption {
    value: string;
    label: string;
}
