import { useCategoriesStore } from './category.store';
import { useCredentialsStore } from './credential.store';
import { useVaultStore } from './vault.store';
import { useAuthStore } from './auth.store';

interface ClearAllStoresOptions {
    preserveLogoutState?: boolean;
}

export const clearAllStores = (options: ClearAllStoresOptions = {}) => {
    const { preserveLogoutState = false } = options;

    useCategoriesStore.getState().clearStore();
    useCredentialsStore.getState().clearStore();
    useVaultStore.getState().clearVault();

    if (preserveLogoutState) {
        const isLoggingOut = useAuthStore.getState().isLoggingOut;
        useAuthStore.getState().clear();
        useAuthStore.getState().setIsLoggingOut(isLoggingOut);
        
        return;
    }

    useAuthStore.getState().clear();
};

export const useClearAllStores = () => {
    const clearCategories = useCategoriesStore((state) => state.clearStore);
    const clearCredentials = useCredentialsStore((state) => state.clearStore);
    const clearVault = useVaultStore((state) => state.clearVault);
    const clearAuth = useAuthStore((state) => state.clear);

    return () => {
        clearCategories();
        clearCredentials();
        clearVault();
        clearAuth();
    };
};
