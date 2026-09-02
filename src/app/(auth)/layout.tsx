'use client';

import React from 'react';

interface AuthLayoutProps {
    children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-dvh bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
            <div className="absolute -top-25 -right-25 w-64 h-64 bg-primary/20 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-25 -left-25 w-80 h-80 bg-secondary/20 rounded-full opacity-20 blur-3xl"></div>

            <div className="relative z-10 w-full max-w-md">{children}</div>
        </div>
    );
}
