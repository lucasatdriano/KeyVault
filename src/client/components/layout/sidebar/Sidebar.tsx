'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LogOutIcon, ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import Logo from '../logo/Logo';
import { useAuth } from '@/src/client/hooks/useAuth';
import { useSidebar } from '@/src/client/hooks/useSidebar';
import { sidebarSections } from './Sidebar.config';

interface SidebarProps {
    mobile?: boolean;
}

export default function Sidebar({ mobile = false }: SidebarProps) {
    const { close } = useSidebar();
    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [expandedSections, setExpandedSections] = useState<string[]>([
        'CREDENCIAIS',
        'CONTA',
    ]);

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

    const isActive = (href: string) => pathname === href;

    return (
        <aside
            className={`bg-background/50 backdrop-blur-xl border-r border-white/10 flex flex-col ${mobile ? 'w-full h-full' : 'w-64 min-h-screen sticky z-50 top-0'}`}
        >
            <div className="p-6 border-b border-white/10">
                <Logo variant="horizontal" size="sm"></Logo>
            </div>
            <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                {sidebarSections.map((section) => (
                    <div key={section.title}>
                        <button
                            onClick={() => toggleSection(section.title)}
                            className="flex items-center justify-between w-full text-foreground/40 text-xs font-semibold uppercase tracking-wider hover:text-foreground/60 transition-colors mb-2"
                        >
                            {section.title}
                            {expandedSections.includes(section.title) ? (
                                <ChevronDownIcon className="cursor-pointer w-4 h-4" />
                            ) : (
                                <ChevronRightIcon className="cursor-pointer w-4 h-4" />
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
                                            <item.icon className="w-5 h-5" />
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
                            <LogOutIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </aside>
    );
}
