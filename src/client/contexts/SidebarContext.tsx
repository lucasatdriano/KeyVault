'use client';

import { createContext } from 'react';

export interface SidebarContextType {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
}

export const SidebarContext = createContext<SidebarContextType | undefined>(
    undefined,
);
