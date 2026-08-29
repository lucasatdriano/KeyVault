'use client';

import React from 'react';
import { XIcon } from 'lucide-react';

interface ModalBaseProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    className?: string;
    canClose?: boolean;
}

export default function ModalBase({
    isOpen,
    onClose,
    title,
    icon,
    children,
    footer,
    maxWidth = 'md',
    className = '',
    canClose = true,
}: ModalBaseProps) {
    if (!isOpen) return null;

    const maxWidthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
    };

    return (
        <>
            <div
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={canClose ? onClose : undefined}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className={`
                        relative w-full ${maxWidthClasses[maxWidth]}
                        bg-background/95 backdrop-blur-xl rounded-3xl
                        border border-white/10 shadow-2xl
                        animate-in slide-in-from-bottom-4 duration-300
                        max-h-[90vh] overflow-y-auto
                        ${className}
                    `}
                >
                    <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/10 bg-background/95 backdrop-blur-xl rounded-t-3xl">
                        <div className="flex items-center gap-3">
                            {icon && (
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    {icon}
                                </div>
                            )}

                            <h2 className="text-xl font-bold text-foreground">
                                {title}
                            </h2>
                        </div>

                        {canClose && (
                            <button
                                type="button"
                                onClick={onClose}
                                className="cursor-pointer p-1.5 rounded-lg hover:bg-white/5 text-foreground/40 hover:text-foreground transition-colors"
                                aria-label="Fechar modal"
                            >
                                <XIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    <div className="p-6">{children}</div>

                    {footer && (
                        <div className="sticky bottom-0 p-6 border-t border-white/10 bg-background/95 backdrop-blur-xl rounded-b-3xl">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
