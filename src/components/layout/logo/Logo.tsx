'use client';

import React from 'react';
import { ShieldCheckIcon } from 'lucide-react';

interface LogoProps {
    variant?: 'icon' | 'horizontal' | 'vertical';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showText?: boolean;
    className?: string;
    iconClassName?: string;
    textClassName?: string;
    onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({
    variant = 'vertical',
    size = 'md',
    showText = true,
    className = '',
    iconClassName = '',
    textClassName = '',
    onClick,
}) => {
    const sizeStyles = {
        sm: {
            container: 'gap-1.5',
            iconWrapper: 'w-10 h-10',
            icon: 'w-5 h-5',
            text: 'text-lg',
            rounded: 'rounded-xl',
        },
        md: {
            container: 'gap-2',
            iconWrapper: 'w-16 h-16',
            icon: 'w-8 h-8',
            text: 'text-2xl',
            rounded: 'rounded-2xl',
        },
        lg: {
            container: 'gap-3',
            iconWrapper: 'w-20 h-20',
            icon: 'w-10 h-10',
            text: 'text-3xl',
            rounded: 'rounded-2xl',
        },
        xl: {
            container: 'gap-4',
            iconWrapper: 'w-28 h-28',
            icon: 'w-14 h-14',
            text: 'text-5xl',
            rounded: 'rounded-3xl',
        },
    };

    const variantStyles = {
        icon: 'flex items-center justify-center',
        horizontal: 'flex items-center gap-3',
        vertical: 'flex flex-col items-center gap-2',
    };

    const currentSize = sizeStyles[size];
    const currentVariant = variantStyles[variant];

    const renderIcon = () => (
        <div
            className={`
                ${currentSize.iconWrapper}
                ${currentSize.rounded}
                flex items-center justify-center
                p-0.5 bg-linear-to-br from-primary to-secondary
                shadow-lg
                ${iconClassName}
            `}
        >
            <div
                className={`
                    w-full h-full 
                    ${currentSize.rounded}
                    bg-background/90 backdrop-blur-sm 
                    flex items-center justify-center
                `}
            >
                <ShieldCheckIcon
                    className={`
                        ${currentSize.icon} 
                        text-primary
                    `}
                />
            </div>
        </div>
    );

    const renderText = () => {
        if (!showText) return null;

        return (
            <span
                className={`
                    ${currentSize.text} 
                    font-bold text-foreground 
                    tracking-tight
                    ${textClassName}
                `}
            >
                KeyVault
            </span>
        );
    };

    const renderContent = () => {
        switch (variant) {
            case 'icon':
                return renderIcon();

            case 'horizontal':
                return (
                    <>
                        {renderIcon()}
                        {renderText()}
                    </>
                );

            case 'vertical':
                return (
                    <>
                        {renderIcon()}
                        {renderText()}
                    </>
                );

            default:
                return renderIcon();
        }
    };

    return (
        <div
            className={`
                ${currentVariant}
                ${currentSize.container}
                ${onClick ? 'cursor-pointer' : 'cursor-default'}
                ${className}
            `}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            {renderContent()}
        </div>
    );
};

export default Logo;
