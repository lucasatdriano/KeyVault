'use client';

import { ReactNode } from 'react';
import { type LucideIcon } from 'lucide-react';

interface InfoCardProps {
    icon: LucideIcon;
    title?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    variant?: 'default' | 'primary';
}

export default function InfoCard({
    icon: Icon,
    title,
    children,
    footer,
    variant = 'default',
}: InfoCardProps) {
    const styles = {
        default: {
            container: 'border-white/5 bg-white/5',
            icon: 'text-foreground/40',
        },
        primary: {
            container: 'border-primary/10 bg-primary/5',
            icon: 'text-primary/60',
        },
    };

    const style = styles[variant];

    return (
        <div className={`mx-4 mb-4 rounded-2xl border p-4 ${style.container}`}>
            <div className="flex items-start gap-3">
                <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${style.icon}`} />

                <div className="min-w-0">
                    {title && (
                        <h3 className="text-sm font-semibold text-foreground">
                            {title}
                        </h3>
                    )}

                    <div
                        className={`text-sm text-foreground/60 ${
                            title ? 'mt-1' : ''
                        }`}
                    >
                        {children}
                    </div>

                    {footer && (
                        <div className="mt-2 text-xs text-foreground/30">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
