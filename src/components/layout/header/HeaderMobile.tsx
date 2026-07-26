'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MenuIcon, UserIcon } from 'lucide-react';
import Logo from '../logo/Logo';

interface HeaderMobileProps {
    onMenuClick?: () => void;
}

const HeaderMobile: React.FC<HeaderMobileProps> = ({ onMenuClick }) => {
    const router = useRouter();

    return (
        <header className="sticky top-0 z-50 lg:hidden bg-background/80 backdrop-blur-xl border-b border-white/10 px-4 py-3">
            <div className="flex items-center justify-between">
                <button
                    onClick={onMenuClick}
                    className="p-2 rounded-xl hover:bg-white/5 text-foreground/70 hover:text-foreground transition-colors"
                >
                    <MenuIcon className="w-6 h-6" />
                </button>

                <Logo variant="horizontal" size="sm" />

                <button
                    onClick={() => router.push('/account')}
                    className="p-2 rounded-xl hover:bg-white/5 text-foreground/70 hover:text-foreground transition-colors"
                >
                    <UserIcon className="w-6 h-6" />
                </button>
            </div>
        </header>
    );
};

export default HeaderMobile;
