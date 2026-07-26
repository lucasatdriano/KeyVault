import { ReactNode, useCallback, useState } from 'react';
import { HeaderContext } from '../contexts/HeaderContext';

export function HeaderProvider({
    children,
    onNewCredential,
}: {
    children: ReactNode;
    onNewCredential?: () => void;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState('Todas');

    const toggleSidebar = useCallback(() => {
        setIsSidebarOpen((prev) => !prev);
    }, []);

    const closeSidebar = useCallback(() => {
        setIsSidebarOpen(false);
    }, []);

    const openSidebar = useCallback(() => {
        setIsSidebarOpen(true);
    }, []);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
        console.log('🔍 Buscando:', query);
    }, []);

    const clearSearch = useCallback(() => {
        setSearchQuery('');
        setIsSearchOpen(false);
    }, []);

    const handleNewCredential = useCallback(() => {
        onNewCredential?.();
    }, [onNewCredential]);

    const value = {
        isSidebarOpen,
        toggleSidebar,
        closeSidebar,
        openSidebar,

        searchQuery,
        setSearchQuery,
        handleSearch,
        clearSearch,
        isSearchOpen,
        setIsSearchOpen,

        handleNewCredential,
        onNewCredential,

        selectedCategory,
        setSelectedCategory,
    };

    return (
        <HeaderContext.Provider value={value}>
            {children}
        </HeaderContext.Provider>
    );
}
