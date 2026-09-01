import { Credential, CredentialFormData } from '@/src/shared/types/credential';

import { useCredentialsData } from '@/src/client/hooks/credentials/useCredentialsData';
import { useCredentialsActions } from '@/src/client/hooks/credentials/useCredentialsActions';
import { useCredentialsImportExport } from '@/src/client/hooks/credentials/useCredentialsImportExport';

interface UseCredentialsOptions {
    initialPage?: number;
    initialItemsPerPage?: number;
    favorite?: boolean;
    deleted?: boolean;
}

export function useCredentials(options: UseCredentialsOptions = {}) {
    const { deleted = false } = options;

    const data = useCredentialsData(options);

    const actions = useCredentialsActions();

    const importExport = useCredentialsImportExport({
        refresh: data.refresh,
        invalidateCache: data.invalidateCache,
    });

    const handleToggleFavorite = (id: string) => {
        actions.handleToggleFavorite(id, data.setLocalCredentials);
    };

    const handleCreateCredential = (formData: CredentialFormData) => {
        return actions.handleCreateCredential(formData, {
            refresh: data.refresh,
            incrementTotalItems: data.incrementTotalItems,
            setLocalCredentials: data.setLocalCredentials,
        });
    };

    const handleUpdateCredential = (
        credential: Credential,
        formData: CredentialFormData,
    ) => {
        return actions.handleUpdateCredential(credential, formData, {
            refresh: data.refresh,
            setLocalCredentials: data.setLocalCredentials,
        });
    };

    const handleDelete = (credential: Credential) => {
        return actions.handleDelete(credential, {
            refresh: data.refresh,
            decrementTotalItems: data.decrementTotalItems,
            setLocalCredentials: data.setLocalCredentials,
        });
    };

    const handleRestore = (id: string) => {
        return actions.handleRestore(id, {
            refresh: data.refresh,
            invalidateCache: data.invalidateCache,
            loadCredentials: data.loadCredentials,
            decrementTotalItems: data.decrementTotalItems,
            setLocalCredentials: data.setLocalCredentials,
            deleted,
            searchQuery: data.searchQuery,
            selectedCategory: data.selectedCategory,
            currentPage: data.currentPage,
        });
    };

    return {
        // Dados
        credentials: data.credentials,
        isLoading: data.isLoading,
        isCacheUsed: data.isCacheUsed,
        searchQuery: data.searchQuery,
        selectedCategory: data.selectedCategory,

        // Paginação
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalItems: data.totalItems,
        itemsPerPage: data.itemsPerPage,
        goToPage: data.goToPage,

        // Estados de loading
        isCreating: actions.isCreating,
        isUpdating: actions.isUpdating,

        // Ações de dados
        loadCredentials: data.loadCredentials,
        handlePageChange: data.handlePageChange,
        handleSearch: data.handleSearch,
        handleFilterChange: data.handleFilterChange,
        refresh: data.refresh,

        // Ações CRUD
        handleCopy: actions.handleCopy,
        handleToggleFavorite,
        handleDelete,
        handleRestore,
        handleCreateCredential,
        handleUpdateCredential,

        // Import/Export
        handleExport: importExport.handleExport,
        handleImport: importExport.handleImport,

        // Setters
        setSearchQuery: data.setSearchQuery,
        setSelectedCategory: data.setSelectedCategory,
    };
}
