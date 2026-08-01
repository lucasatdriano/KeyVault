'use client';

import { useRouter } from 'next/navigation';
import { MenuIcon, UserIcon } from 'lucide-react';

import { useSidebar } from '@/src/client/hooks/useSidebar';
import Logo from '../logo/Logo';

export default function HeaderMobile() {
    const { toggle } = useSidebar();
    const router = useRouter();

    const buttonClass =
        'cursor-pointer p-2 rounded-xl hover:bg-white/5 text-foreground/70 hover:text-foreground transition-colors';

    const handleAccountNavigation = () => {
        router.push('/account');
    };

    return (
        <header className="sticky top-0 z-40 lg:hidden bg-background/80 backdrop-blur-xl border-b border-white/10 px-4 py-3">
            <div className="flex items-center justify-between">
                <button
                    onClick={toggle}
                    className={buttonClass}
                    aria-label="Abrir menu"
                >
                    <MenuIcon className="w-6 h-6" />
                </button>

                <Logo variant="horizontal" size="sm" />

                <button
                    onClick={handleAccountNavigation}
                    className={buttonClass}
                    aria-label="Abrir conta"
                >
                    <UserIcon className="w-6 h-6" />
                </button>
            </div>
        </header>
    );
}
