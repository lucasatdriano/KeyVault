import { LucideIcon } from 'lucide-react';

export interface SidebarItem {
    icon: LucideIcon;
    label: string;
    href: string;
    count?: number;
    badge?: number;
}

export interface SidebarSection {
    title: string;
    items: SidebarItem[];
}
