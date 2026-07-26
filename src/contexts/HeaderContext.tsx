'use client';

import { createContext } from 'react';

interface HeaderContextType {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;
    openSidebar: () => void;

    searchQuery: string;
    setSearchQuery: (query: string) => void;
    handleSearch: (query: string) => void;
    clearSearch: () => void;
    isSearchOpen: boolean;
    setIsSearchOpen: (open: boolean) => void;

    handleNewCredential: () => void;
    onNewCredential?: () => void;

    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
}

export const HeaderContext = createContext<HeaderContextType | undefined>(
    undefined,
);
