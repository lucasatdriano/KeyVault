'use client';

import { TextareaHTMLAttributes } from 'react';

interface InputTextAreaFormProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    fullWidth?: boolean;
    variant?: 'default' | 'outline' | 'ghost';
    rows?: number;
    resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export default function InputTextAreaForm({
    label,
    error,
    fullWidth = true,
    variant = 'default',
    className = '',
    rows = 3,
    resize = 'none',
    disabled,
    value,
    onChange,
    placeholder,
    ...props
}: InputTextAreaFormProps) {
    const variantStyles = {
        default: 'bg-white/5 border-white/10 focus:ring-2 focus:ring-ring/50',
        outline:
            'bg-transparent border-primary/30 focus:ring-2 focus:ring-ring/50',
        ghost: 'bg-transparent border-transparent focus:ring-2 focus:ring-ring/50',
    };

    const resizeStyles = {
        none: 'resize-none',
        vertical: 'resize-y',
        horizontal: 'resize-x',
        both: 'resize',
    };

    const textareaClasses = `
        w-full rounded-xl border-2 py-2.5 px-4
        text-foreground placeholder-foreground/30
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-ring/50
        ${variantStyles[variant]}
        ${resizeStyles[resize]}
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

            <textarea
                rows={rows}
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                className={textareaClasses}
                {...props}
            />

            {error && (
                <p className="mt-1.5 text-xs font-medium text-error">{error}</p>
            )}
        </div>
    );
}
