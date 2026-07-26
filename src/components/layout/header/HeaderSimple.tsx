'use client';

import React from 'react';

interface HeaderSimpleProps {
    icon: React.ReactNode;
    iconBgColor: string;
    title: string;
    subtitle?: string;
}

const HeaderSimple: React.FC<HeaderSimpleProps> = ({
    icon,
    iconBgColor,
    title,
    subtitle,
}) => {
    return (
        <div className="px-4 py-4 border-b border-white/10 bg-background/50">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <div
                        className={`w-12 h-12 rounded-2xl ${iconBgColor} flex items-center justify-center`}
                    >
                        {icon}
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
};

export default HeaderSimple;
