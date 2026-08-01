'use client';

import { LucideIcon } from 'lucide-react';

interface HeaderSimpleProps {
    icon: LucideIcon;
    iconClass: string;
    iconBgColor: string;
    title: string;
    subtitle?: string;
}

export default function HeaderSimple({
    icon: Icon,
    iconClass,
    iconBgColor,
    title,
    subtitle,
}: HeaderSimpleProps) {
    return (
        <div className="px-4 pt-0 pb-4 sm:pt-4 border-b border-white/10 bg-background/50">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <div
                        className={`
                            w-12 h-12 
                            rounded-2xl 
                            ${iconBgColor} 
                            flex 
                            items-center 
                            justify-center
                        `}
                    >
                        <Icon className={`w-6 h-6 ${iconClass}`} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            {title}
                        </h1>

                        {subtitle && (
                            <p className="text-sm text-foreground/60">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
