'use client';

import React, { InputHTMLAttributes, useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputTextFormProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
    variant?: 'default' | 'outline' | 'ghost';
}

function InputText(
    {
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
    }: InputTextFormProps,
    ref: React.ForwardedRef<HTMLInputElement>,
) {
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
        <div className={`${fullWidth ? 'w-full' : ''}`}>
            {label && (
                <label className="block text-foreground/90 text-sm font-medium mb-1.5">
                    {label}
                </label>
            )}

            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-3 w-5 h-5 top-1/2 -translate-y-1/2 text-foreground/30">
                        {leftIcon}
                    </div>
                )}

                <input
                    ref={ref}
                    type={isPassword && showPassword ? 'text' : type}
                    disabled={disabled}
                    className={inputClasses}
                    {...props}
                />

                {(rightIcon || isPassword) && (
                    <div className="absolute right-3 w-6 h-6 top-1/2 -translate-y-1/2">
                        {isPassword ? (
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="cursor-pointer text-foreground/30 hover:text-foreground/60 transition-colors"
                                disabled={disabled}
                            >
                                {showPassword ? (
                                    <EyeOff className="w-6 h-6" />
                                ) : (
                                    <Eye className="w-6 h-6" />
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
                <p className="text-error text-xs mt-1.5 font-medium">{error}</p>
            )}
        </div>
    );
}

const InputTextForm = forwardRef<HTMLInputElement, InputTextFormProps>(
    InputText,
);

InputTextForm.displayName = 'InputText';

export default InputTextForm;
