'use client';

import { LoaderCircleIcon } from 'lucide-react';
import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?:
        | 'primary'
        | 'secondary'
        | 'outline'
        | 'ghost'
        | 'warning'
        | 'error'
        | 'success';
    size?: 'sm' | 'md' | 'lg';
    bold?: string;
    fullWidth?: boolean;
    isLoading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    loadingText?: string;
}

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    bold = 'font-medium',
    fullWidth = false,
    isLoading = false,
    leftIcon,
    rightIcon,
    loadingText,
    className = '',
    disabled,
    type = 'button',
    ...props
}: ButtonProps) {
    const variantStyles = {
        primary:
            'bg-primary text-white shadow-lg hover:shadow-xl hover:shadow-primary/25',
        secondary:
            'bg-white/10 text-foreground border border-white/10 hover:bg-white/20',
        outline:
            'bg-transparent text-primary border-2 border-primary hover:bg-primary/10',
        ghost: 'bg-transparent text-foreground hover:bg-white/5',
        warning:
            'bg-warning text-white hover:bg-warning shadow-lg hover:shadow-error/25',
        error: 'bg-error/10 hover:bg-error/20 text-error shadow-lg hover:shadow-error/10',
        success:
            'bg-success text-white hover:bg-success shadow-lg hover:shadow-green-500/25',
    };

    const sizeStyles = {
        sm: 'px-4 py-2 text-sm rounded-lg',
        md: 'px-6 py-3 text-base rounded-xl',
        lg: 'px-8 py-4 text-lg rounded-2xl',
    };

    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            className={`
                cursor-pointer
                inline-flex items-center justify-center gap-2
                transition-all duration-200
                transform hover:scale-[1.02] active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                ${bold}
                ${variantStyles[variant]}
                ${sizeStyles[size]}
                ${fullWidth ? 'w-full' : ''}
                ${className}
            `}
            {...props}
        >
            {isLoading && (
                <>
                    <LoaderCircleIcon className="animate-spin" />
                    {loadingText || children}
                </>
            )}

            {!isLoading && leftIcon && (
                <span className="shrink-0">{leftIcon}</span>
            )}

            {!isLoading && children}

            {!isLoading && rightIcon && (
                <span className="shrink-0">{rightIcon}</span>
            )}
        </button>
    );
}
