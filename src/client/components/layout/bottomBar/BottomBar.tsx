'use client';

import { useRouter, usePathname } from 'next/navigation';
import { bottomBarItems } from './BottomBar.config';

export default function BottomBar() {
    const router = useRouter();
    const pathname = usePathname();

    const handleNavigation = (href: string) => {
        if (pathname !== href) {
            router.push(href);
        }
    };

    const isActive = (href: string) => pathname === href;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-t border-white/10">
            <div className="flex items-center justify-around px-4 py-2 max-w-lg mx-auto relative">
                {bottomBarItems.map((item) => (
                    <button
                        key={item.label}
                        onClick={() => handleNavigation(item.href)}
                        className={`
                            cursor-pointer flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl
                            transition-all duration-200 relative
                            ${
                                isActive(item.href)
                                    ? 'text-primary'
                                    : 'text-foreground/40 hover:text-foreground/70'
                            }
                        `}
                    >
                        <item.icon />
                        <span className="text-[10px] font-medium">
                            {item.label}
                        </span>

                        {isActive(item.href) && (
                            <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
