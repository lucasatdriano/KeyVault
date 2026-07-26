'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Key, Star, User, Settings } from 'lucide-react';

const BottomBar = () => {
    const router = useRouter();
    const pathname = usePathname();

    const tabs = [
        {
            icon: <Key className="w-6 h-6" />,
            label: 'Credenciais',
            href: '/dashboard',
        },
        {
            icon: <Star className="w-6 h-6" />,
            label: 'Favoritos',
            href: '/dashboard/favorites',
        },
        {
            icon: <User className="w-6 h-6" />,
            label: 'Conta',
            href: '/account',
        },
        {
            icon: <Settings className="w-6 h-6" />,
            label: 'Config.',
            href: '/account/settings',
        },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-white/10">
            <div className="flex items-center justify-around px-4 py-2 max-w-lg mx-auto relative">
                {tabs.map((tab) => (
                    <button
                        key={tab.label}
                        onClick={() => router.push(tab.href)}
                        className={`
                            flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl
                            transition-all duration-200 relative
                            ${
                                isActive(tab.href)
                                    ? 'text-primary'
                                    : 'text-foreground/40 hover:text-foreground/70'
                            }
                        `}
                    >
                        {tab.icon}
                        <span className="text-[10px] font-medium">
                            {tab.label}
                        </span>

                        {isActive(tab.href) && (
                            <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BottomBar;
