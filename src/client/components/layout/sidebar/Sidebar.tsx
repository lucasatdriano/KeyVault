'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LogOutIcon, ChevronDownIcon, ChevronRightIcon } from 'lucide-react';

import Logo from '../logo/Logo';

import { useAuth } from '@/src/client/hooks/useAuth';
import { useSidebar } from '@/src/client/hooks/useSidebar';

import { sidebarSections } from './Sidebar.config';
import { logoutAction } from '@/src/server/actions/auth/logout.action';
import { useVaultStore } from '@/src/client/store/vault.store';

interface SidebarProps {
    mobile?: boolean;
}

export default function Sidebar({ mobile = false }: SidebarProps) {
    const { close } = useSidebar();
    const { user } = useAuth();

    const router = useRouter();
    const pathname = usePathname();

    const clearVault = useVaultStore.getState().clearVault;

    const [expandedSections, setExpandedSections] = useState<string[]>([
        'CREDENCIAIS',
        'CONTA',
    ]);

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const toggleSection = (title: string) => {
        setExpandedSections((prev) =>
            prev.includes(title)
                ? prev.filter((t) => t !== title)
                : [...prev, title],
        );
    };

    const handleNavigation = (href: string) => {
        router.push(href);

        if (mobile) {
            close();
        }
    };

    const handleLogout = async () => {
        if (isLoggingOut) {
            return;
        }

        setIsLoggingOut(true);

        try {
            const result = await logoutAction();

            if (!result.success) {
                console.error(result.error);
                return;
            }

            clearVault();

            router.replace('/login');
            router.refresh();
        } finally {
            setIsLoggingOut(false);
        }
    };

    const isActive = (href: string) => pathname === href;

    return (
        <aside
            className={`bg-background/50 backdrop-blur-xl border-r border-white/10 flex flex-col ${
                mobile ? 'w-full h-full' : 'w-64 min-h-screen sticky z-50 top-0'
            }`}
        >
            <div className="border-b border-white/10 p-6">
                <Logo variant="horizontal" size="sm" />
            </div>

            <nav className="flex-1 space-y-6 overflow-y-auto p-4">
                {sidebarSections.map((section) => (
                    <div key={section.title}>
                        <button
                            onClick={() => toggleSection(section.title)}
                            className="mb-2 flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wider text-foreground/40 transition-colors hover:text-foreground/60"
                        >
                            {section.title}

                            {expandedSections.includes(section.title) ? (
                                <ChevronDownIcon className="h-4 w-4 cursor-pointer" />
                            ) : (
                                <ChevronRightIcon className="h-4 w-4 cursor-pointer" />
                            )}
                        </button>

                        {expandedSections.includes(section.title) && (
                            <div className="space-y-1">
                                {section.items.map((item) => (
                                    <button
                                        key={item.label}
                                        onClick={() =>
                                            handleNavigation(item.href)
                                        }
                                        className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-200 cursor-pointer ${
                                            isActive(item.href)
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-foreground/70 hover:bg-white/5 hover:text-foreground'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className="h-5 w-5" />

                                            <span className="text-sm font-medium">
                                                {item.label}
                                            </span>
                                        </div>

                                        {item.count !== undefined && (
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                                    isActive(item.href)
                                                        ? 'bg-primary/20 text-primary'
                                                        : 'bg-white/5 text-foreground/40'
                                                }`}
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
                <div className="border-t border-white/10 p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-primary to-secondary text-sm font-bold text-white">
                            {user.name
                                ?.split(' ')
                                .map((name) => name[0])
                                .join('')
                                .toUpperCase() || 'U'}
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">
                                {user.name || 'Usuário'}
                            </p>

                            <p className="truncate text-xs text-foreground/40">
                                {user.email || 'usuario@email.com'}
                            </p>
                        </div>

                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="cursor-pointer rounded-lg p-1.5 text-error/40 transition-colors hover:bg-error/5 hover:text-error/70 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <LogOutIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </aside>
    );
}
