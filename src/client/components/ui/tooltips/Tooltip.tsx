'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
    children: ReactNode;
    content: ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tooltip({
    children,
    content,
    position = 'top',
}: TooltipProps) {
    const [show, setShow] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (show && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const offsets = {
                top: { top: rect.top, left: rect.left + rect.width / 2 },
                bottom: { top: rect.bottom, left: rect.left + rect.width / 2 },
                left: { top: rect.top + rect.height / 2, left: rect.left },
                right: { top: rect.top + rect.height / 2, left: rect.right },
            };
            setCoords(offsets[position]);
        }
    }, [show, position]);

    const transforms = {
        top: 'translate(-50%, -100%) translateY(-8px)',
        bottom: 'translate(-50%, 0%) translateY(8px)',
        left: 'translate(-100%, -50%) translateX(-8px)',
        right: 'translate(0%, -50%) translateX(8px)',
    };

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setShow(true);
    };

    const handleMouseLeave = () => {
        // Delay pequeno para permitir que o mouse entre no tooltip
        timeoutRef.current = setTimeout(() => {
            setShow(false);
        }, 150);
    };

    return (
        <>
            <div
                ref={triggerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="inline-flex"
            >
                {children}
            </div>

            {show &&
                typeof document !== 'undefined' &&
                createPortal(
                    <div
                        className="fixed z-50 w-96 p-4 rounded-lg bg-background border border-white/10 text-white text-xs shadow-2xl"
                        style={{
                            top: coords.top,
                            left: coords.left,
                            transform: transforms[position],
                        }}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        {content}
                    </div>,
                    document.body,
                )}
        </>
    );
}
