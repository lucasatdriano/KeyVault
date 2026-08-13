import { Credential } from '@/src/shared/types/credential';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CredentialsStore {
    credentials: Credential[];
    deletedCredentials: Credential[];
    favoriteCredentials: Credential[];

    credentialsCacheInitialized: boolean;
    favoriteCacheInitialized: boolean;
    deletedCacheInitialized: boolean;

    lastFetch: number | null;
    isCacheStale: boolean;

    credentialsCount: number;
    deletedCount: number;
    favoritesCount: number;

    addCredential: (
        credential: Omit<
            Credential,
            'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
        >,
    ) => void;
    updateCredential: (id: string, updatedData: Partial<Credential>) => void;
    deleteCredential: (id: string) => void;
    toggleFavorite: (id: string) => void;
    restoreCredential: (id: string) => void;

    syncCredentials: (serverCredentials: Credential[]) => void;
    syncDeletedCredentials: (serverDeleted: Credential[]) => void;
    syncFavoriteCredentials: (serverFavorites: Credential[]) => void;

    getCredentialsLength: () => number;
    getDeletedLength: () => number;
    getFavoritesLength: () => number;
    getCredentialById: (id: string) => Credential | undefined;

    clearAllCredentials: () => void;
    clearDeletedCredentials: () => void;
    invalidateCache: () => void;
    clearStore: () => void;
}

export const useCredentialsStore = create<CredentialsStore>()(
    persist(
        (set, get) => ({
            credentials: [],
            deletedCredentials: [],
            favoriteCredentials: [],

            credentialsCacheInitialized: false,
            favoriteCacheInitialized: false,
            deletedCacheInitialized: false,

            lastFetch: null,
            isCacheStale: true,

            credentialsCount: 0,
            deletedCount: 0,
            favoritesCount: 0,

            addCredential: (credential) => {
                const now = new Date().toISOString();

                const newCredential: Credential = {
                    ...credential,
                    id: crypto.randomUUID(),
                    userId: '',
                    category: credential.category || 'Outros',
                    favorite: credential.favorite || false,
                    createdAt: now,
                    updatedAt: now,
                    deletedAt: '',
                };

                set((state) => {
                    const updatedCredentials = [
                        newCredential,
                        ...state.credentials,
                    ];

                    const updatedFavorites = newCredential.favorite
                        ? [newCredential, ...state.favoriteCredentials]
                        : state.favoriteCredentials;

                    return {
                        credentials: updatedCredentials,
                        favoriteCredentials: updatedFavorites,
                        credentialsCount: updatedCredentials.length,
                        favoritesCount: updatedFavorites.length,
                        isCacheStale: true,
                    };
                });
            },

            updateCredential: (id, updatedData) => {
                set((state) => {
                    const now = new Date().toISOString();

                    const updatedCredentials = state.credentials.map(
                        (credential) =>
                            credential.id === id
                                ? {
                                      ...credential,
                                      ...updatedData,
                                      updatedAt: now,
                                  }
                                : credential,
                    );

                    const updatedFavorites = state.favoriteCredentials.map(
                        (credential) =>
                            credential.id === id
                                ? {
                                      ...credential,
                                      ...updatedData,
                                      updatedAt: now,
                                  }
                                : credential,
                    );

                    return {
                        credentials: updatedCredentials,
                        favoriteCredentials: updatedFavorites,
                        credentialsCount: updatedCredentials.length,
                        favoritesCount: updatedFavorites.length,
                        isCacheStale: true,
                    };
                });
            },

            deleteCredential: (id) => {
                set((state) => {
                    const credentialToDelete = state.credentials.find(
                        (credential) => credential.id === id,
                    );

                    if (!credentialToDelete) {
                        return state;
                    }

                    const updatedCredentials = state.credentials.filter(
                        (credential) => credential.id !== id,
                    );

                    const updatedFavorites = state.favoriteCredentials.filter(
                        (credential) => credential.id !== id,
                    );

                    const deletedCredential: Credential = {
                        ...credentialToDelete,
                        deletedAt: new Date().toISOString(),
                    };

                    const updatedDeleted = [
                        deletedCredential,
                        ...state.deletedCredentials,
                    ];

                    return {
                        credentials: updatedCredentials,
                        deletedCredentials: updatedDeleted,
                        favoriteCredentials: updatedFavorites,
                        credentialsCount: updatedCredentials.length,
                        deletedCount: updatedDeleted.length,
                        favoritesCount: updatedFavorites.length,
                        isCacheStale: true,
                    };
                });
            },

            toggleFavorite: (id) => {
                set((state) => {
                    const credential = state.credentials.find(
                        (item) => item.id === id,
                    );

                    if (!credential) {
                        return state;
                    }

                    const updatedCredential: Credential = {
                        ...credential,
                        favorite: !credential.favorite,
                        updatedAt: new Date().toISOString(),
                    };

                    const updatedCredentials = state.credentials.map((item) =>
                        item.id === id ? updatedCredential : item,
                    );

                    let updatedFavorites = [...state.favoriteCredentials];

                    if (updatedCredential.favorite) {
                        if (!updatedFavorites.some((item) => item.id === id)) {
                            updatedFavorites = [
                                updatedCredential,
                                ...updatedFavorites,
                            ];
                        }
                    } else {
                        updatedFavorites = updatedFavorites.filter(
                            (item) => item.id !== id,
                        );
                    }

                    return {
                        credentials: updatedCredentials,
                        favoriteCredentials: updatedFavorites,
                        credentialsCount: updatedCredentials.length,
                        favoritesCount: updatedFavorites.length,
                        isCacheStale: true,
                    };
                });
            },

            restoreCredential: (id) => {
                set((state) => {
                    const credentialToRestore = state.deletedCredentials.find(
                        (credential) => credential.id === id,
                    );

                    if (!credentialToRestore) {
                        return state;
                    }

                    const restoredCredential: Credential = {
                        ...credentialToRestore,
                        deletedAt: '',
                        updatedAt: new Date().toISOString(),
                    };

                    const updatedCredentials = [
                        restoredCredential,
                        ...state.credentials,
                    ];
                    const updatedDeleted = state.deletedCredentials.filter(
                        (credential) => credential.id !== id,
                    );
                    const updatedFavorites = restoredCredential.favorite
                        ? [restoredCredential, ...state.favoriteCredentials]
                        : state.favoriteCredentials;

                    return {
                        credentials: updatedCredentials,
                        deletedCredentials: updatedDeleted,
                        favoriteCredentials: updatedFavorites,
                        credentialsCount: updatedCredentials.length,
                        deletedCount: updatedDeleted.length,
                        favoritesCount: updatedFavorites.length,
                        isCacheStale: true,
                    };
                });
            },

            syncCredentials: (serverCredentials) => {
                set({
                    credentials: serverCredentials,
                    credentialsCount: serverCredentials.length,
                    credentialsCacheInitialized: true,
                    lastFetch: Date.now(),
                    isCacheStale: false,
                });
            },

            syncDeletedCredentials: (serverDeleted) => {
                set({
                    deletedCredentials: serverDeleted,
                    deletedCount: serverDeleted.length,
                    deletedCacheInitialized: true,
                    lastFetch: Date.now(),
                    isCacheStale: false,
                });
            },

            syncFavoriteCredentials: (serverFavorites) => {
                set({
                    favoriteCredentials: serverFavorites,
                    favoritesCount: serverFavorites.length,
                    favoriteCacheInitialized: true,
                    lastFetch: Date.now(),
                    isCacheStale: false,
                });
            },

            getCredentialsLength: () => get().credentials.length,
            getDeletedLength: () => get().deletedCredentials.length,
            getFavoritesLength: () => get().favoriteCredentials.length,

            getCredentialById: (id) =>
                get().credentials.find((credential) => credential.id === id),

            clearAllCredentials: () => {
                set({
                    credentials: [],
                    favoriteCredentials: [],
                    credentialsCount: 0,
                    favoritesCount: 0,
                    isCacheStale: true,
                });
            },

            clearDeletedCredentials: () => {
                set({
                    deletedCredentials: [],
                    deletedCount: 0,
                    isCacheStale: true,
                });
            },

            invalidateCache: () => {
                set({
                    isCacheStale: true,
                });
            },

            clearStore: () => {
                set({
                    credentials: [],
                    deletedCredentials: [],
                    favoriteCredentials: [],
                    credentialsCount: 0,
                    deletedCount: 0,
                    favoritesCount: 0,
                    lastFetch: null,
                    isCacheStale: true,
                });
            },
        }),
        {
            name: 'credentials-counts',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                credentialsCount: state.credentialsCount,
                deletedCount: state.deletedCount,
                favoritesCount: state.favoritesCount,
                lastFetch: state.lastFetch,
            }),
            version: 1,
        },
    ),
);
