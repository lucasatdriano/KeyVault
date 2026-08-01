'use client';

import { ReactNode, useCallback, useMemo, useState } from 'react';

import { SidebarContext } from '../contexts/SidebarContext';

interface SidebarProviderProps {
    children: ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
    const [isOpen, setIsOpen] = useState(false);

    const open = useCallback(() => {
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
    }, []);

    const toggle = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    const value = useMemo(
        () => ({
            isOpen,
            open,
            close,
            toggle,
        }),
        [isOpen, open, close, toggle],
    );

    return (
        <SidebarContext.Provider value={value}>
            {children}
        </SidebarContext.Provider>
    );
}
