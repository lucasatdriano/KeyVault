import { useCategoriesStore } from './category.store';
import { useCredentialsStore } from './credential.store';
import { useVaultStore } from './vault.store';
import { useAuthStore } from './auth.store';

export const clearAllStores = () => {
    useCategoriesStore.getState().clearStore();

    useCredentialsStore.getState().clearStore();

    useVaultStore.getState().clearVault();

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
