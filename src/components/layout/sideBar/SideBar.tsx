'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
    LogOut,
    ChevronDown,
    ChevronRight,
    KeyIcon,
    StarIcon,
    Trash2Icon,
    UserIcon,
    ShieldIcon,
    ActivityIcon,
    SettingsIcon,
    FingerprintIcon,
} from 'lucide-react';
import Logo from '../logo/Logo';

interface SidebarProps {
    user?: {
        name: string;
        email: string;
    };
}

interface MenuItem {
    icon: React.ReactNode;
    label: string;
    href: string;
    count?: number;
    badge?: number;
}

interface MenuSection {
    title: string;
    items: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [expandedSections, setExpandedSections] = useState<string[]>([
        'CREDENCIAIS',
        'CONTA',
    ]);

    const menuSections: MenuSection[] = [
        {
            title: 'CREDENCIAIS',
            items: [
                {
                    icon: <KeyIcon className="w-5 h-5" />,
                    label: 'Minhas Credenciais',
                    href: '/dashboard',
                    count: 8,
                },
                {
                    icon: <StarIcon className="w-5 h-5" />,
                    label: 'Favoritos',
                    href: '/dashboard/favorites',
                    count: 3,
                },
                {
                    icon: <Trash2Icon className="w-5 h-5" />,
                    label: 'Lixeira',
                    href: '/dashboard/trash',
                },
            ],
        },
        {
            title: 'CONTA',
            items: [
                {
                    icon: <UserIcon className="w-5 h-5" />,
                    label: 'Conta',
                    href: '/account',
                },
                {
                    icon: <ShieldIcon className="w-5 h-5" />,
                    label: 'Segurança',
                    href: '/account/security',
                },
                {
                    icon: <FingerprintIcon className="w-5 h-5" />,
                    label: 'Recuperação',
                    href: '/account/recovery',
                },
                {
                    icon: <ActivityIcon className="w-5 h-5" />,
                    label: 'Auditoria',
                    href: '/account/audit',
                },
                {
                    icon: <SettingsIcon className="w-5 h-5" />,
                    label: 'Configurações',
                    href: '/account/settings',
                },
            ],
        },
    ];

    const toggleSection = (title: string) => {
        setExpandedSections((prev) =>
            prev.includes(title)
                ? prev.filter((t) => t !== title)
                : [...prev, title],
        );
    };

    const isActive = (href: string) => pathname === href;

    return (
        <aside className="w-64 min-h-screen bg-background/50 backdrop-blur-xl border-r border-white/10 flex flex-col sticky top-0 border">
            <div className="p-6 border-b border-white/10">
                <Logo variant="horizontal" size="sm"></Logo>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                {menuSections.map((section) => (
                    <div key={section.title}>
                        <button
                            onClick={() => toggleSection(section.title)}
                            className="flex items-center justify-between w-full text-foreground/40 text-xs font-semibold uppercase tracking-wider hover:text-foreground/60 transition-colors mb-2"
                        >
                            {section.title}
                            {expandedSections.includes(section.title) ? (
                                <ChevronDown className="cursor-pointer w-4 h-4" />
                            ) : (
                                <ChevronRight className="cursor-pointer w-4 h-4" />
                            )}
                        </button>

                        {expandedSections.includes(section.title) && (
                            <div className="space-y-1">
                                {section.items.map((item) => (
                                    <button
                                        key={item.label}
                                        onClick={() => router.push(item.href)}
                                        className={`
                                            w-full flex items-center justify-between px-3 py-2.5 rounded-xl
                                            cursor-pointer transition-all duration-200
                                            ${
                                                isActive(item.href)
                                                    ? 'bg-primary/10 text-primary'
                                                    : 'text-foreground/70 hover:bg-white/5 hover:text-foreground'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            {item.icon}
                                            <span className="text-sm font-medium">
                                                {item.label}
                                            </span>
                                        </div>
                                        {item.count !== undefined && (
                                            <span
                                                className={`
                                                text-xs font-medium px-2 py-0.5 rounded-full
                                                ${
                                                    isActive(item.href)
                                                        ? 'bg-primary/20 text-primary'
                                                        : 'bg-white/5 text-foreground/40'
                                                }
                                            `}
                                            >
                                                {item.count}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            {user && (
                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                            {user.name
                                ?.split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                                {user.name || 'Usuário'}
                            </p>
                            <p className="text-xs text-foreground/40 truncate">
                                {user.email || 'usuario@email.com'}
                            </p>
                        </div>
                        <button
                            onClick={() => console.log('Logout')}
                            className="cursor-pointer p-1.5 rounded-lg hover:bg-error/5 text-error/40 hover:text-error/70 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
