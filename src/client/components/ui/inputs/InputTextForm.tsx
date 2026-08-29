'use client';

import React, { InputHTMLAttributes, useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

interface InputTextFormProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
    variant?: 'default' | 'outline' | 'ghost';
}

export default function InputTextForm({
    label,
    error,
    leftIcon,
    rightIcon,
    fullWidth = true,
    variant = 'default',
    className = '',
    type = 'text',
    disabled,
    ...props
}: InputTextFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    const variantStyles = {
        default: 'bg-white/5 border-white/10 focus:ring-2 focus:ring-ring/50',
        outline:
            'bg-transparent border-primary/30 focus:ring-2 focus:ring-ring/50',
        ghost: 'bg-transparent border-transparent focus:ring-2 focus:ring-ring/50',
    };

    const inputClasses = `
        w-full rounded-xl border-2 py-2.5
        text-foreground placeholder-foreground/30
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-ring/50
        ${variantStyles[variant]}
        ${leftIcon ? 'pl-10' : ''}
        ${rightIcon || isPassword ? 'pr-10' : ''}
        ${error ? 'border-error/50 focus:ring-error/50' : ''}
        ${className}
    `;

    return (
        <div className={fullWidth ? 'w-full' : ''}>
            {label && (
                <label className="mb-1.5 block text-sm font-medium text-foreground/90">
                    {label}
                </label>
            )}

            <div className="relative">
                {leftIcon && (
                    <div className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground/80">
                        {leftIcon}
                    </div>
                )}

                <input
                    type={isPassword && showPassword ? 'text' : type}
                    disabled={disabled}
                    className={inputClasses}
                    {...props}
                />

                {(rightIcon || isPassword) && (
                    <div className="absolute top-1/2 right-3 h-6 w-6 -translate-y-1/2">
                        {isPassword ? (
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="cursor-pointer text-muted-foreground/80 transition-colors hover:text-muted-foreground"
                                disabled={disabled}
                            >
                                {showPassword ? (
                                    <EyeOffIcon className="h-6 w-6" />
                                ) : (
                                    <EyeIcon className="h-6 w-6" />
                                )}
                            </button>
                        ) : (
                            <div className="text-foreground/30">
                                {rightIcon}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {error && (
                <p className="mt-1.5 text-xs font-medium text-error">{error}</p>
            )}
        </div>
    );
}
