'use client';

import React, { SelectHTMLAttributes } from 'react';
import { ChevronDownIcon } from 'lucide-react';

interface SelectOption {
    value: string;
    label: string;
}

interface InputSelectFormProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: SelectOption[];
    placeholder?: string;
    fullWidth?: boolean;
    variant?: 'default' | 'outline' | 'ghost';
    leftIcon?: React.ReactNode;
}

export default function InputSelectForm({
    label,
    error,
    options,
    placeholder = 'Selecione uma opção',
    fullWidth = true,
    variant = 'default',
    className = '',
    disabled,
    value,
    onChange,
    leftIcon,
    ...props
}: InputSelectFormProps) {
    const variantStyles = {
        default: 'bg-white/5 border-white/10 focus:ring-2 focus:ring-ring/50',
        outline:
            'bg-transparent border-primary/30 focus:ring-2 focus:ring-ring/50',
        ghost: 'bg-transparent border-transparent focus:ring-2 focus:ring-ring/50',
    };

    const selectClasses = `
        w-full rounded-xl border-2 py-2.5 pr-10
        text-foreground placeholder-foreground/30
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-ring/50
        cursor-pointer appearance-none
        ${variantStyles[variant]}
        ${leftIcon ? 'pl-10' : 'pl-4'}
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
                    <div className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground/80 pointer-events-none">
                        {leftIcon}
                    </div>
                )}

                <select
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={selectClasses}
                    {...props}
                >
                    {placeholder && (
                        <option
                            className="cursor-pointer bg-background hover:bg-primary"
                            value=""
                            disabled
                        >
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            className="cursor-pointer bg-background hover:bg-primary"
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                <div className="absolute top-1/2 right-3 -translate-y-1/2 text-foreground/30 pointer-events-none">
                    <ChevronDownIcon className="h-5 w-5" />
                </div>
            </div>

            {error && (
                <p className="mt-1.5 text-xs font-medium text-error">{error}</p>
            )}
        </div>
    );
}
