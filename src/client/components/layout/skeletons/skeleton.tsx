'use client';

import React from 'react';

interface SkeletonProps {
    variant?: 'text' | 'circle' | 'rect' | 'card' | 'avatar';
    width?: string | number;
    height?: string | number;
    className?: string;
    animate?: boolean;
    count?: number;
    gap?: number;
}

export default function Skeleton({
    variant = 'text',
    width,
    height,
    className = '',
    animate = true,
    count = 1,
    gap = 4,
}: SkeletonProps) {
    const variantStyles = {
        text: 'rounded-lg',
        circle: 'rounded-full',
        rect: 'rounded-2xl',
        card: 'rounded-3xl',
        avatar: 'rounded-full',
    };

    const defaultDimensions = {
        text: { width: '100%', height: '1rem' },
        circle: { width: '4rem', height: '4rem' },
        rect: { width: '100%', height: '6rem' },
        card: { width: '100%', height: '12rem' },
        avatar: { width: '3rem', height: '3rem' },
    };

    const dimensions = {
        width: width || defaultDimensions[variant].width,
        height: height || defaultDimensions[variant].height,
    };

    const baseClasses = `
        bg-gradient-to-r from-foreground/5 via-foreground/10 to-foreground/5
        ${variantStyles[variant]}
        ${animate ? 'animate-pulse' : ''}
        ${className}
    `;

    if (count > 1) {
        return (
            <div className="flex flex-col" style={{ gap: `${gap}px` }}>
                {Array.from({ length: count }).map((_, index) => (
                    <div
                        key={index}
                        className={baseClasses}
                        style={{
                            width:
                                typeof dimensions.width === 'number'
                                    ? `${dimensions.width}px`
                                    : dimensions.width,
                            height:
                                typeof dimensions.height === 'number'
                                    ? `${dimensions.height}px`
                                    : dimensions.height,
                        }}
                    />
                ))}
            </div>
        );
    }

    return (
        <div
            className={baseClasses}
            style={{
                width:
                    typeof dimensions.width === 'number'
                        ? `${dimensions.width}px`
                        : dimensions.width,
                height:
                    typeof dimensions.height === 'number'
                        ? `${dimensions.height}px`
                        : dimensions.height,
            }}
        />
    );
}
