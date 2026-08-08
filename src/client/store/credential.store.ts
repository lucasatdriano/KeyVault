import { Credential } from '@/src/shared/types/credential';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CredentialsStore {
    credentials: Credential[];
    deletedCredentials: Credential[];
    favoriteCredentials: Credential[];

    lastFetch: number | null;
    isCacheStale: boolean;

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
            lastFetch: null,
            isCacheStale: true,

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
                        isCacheStale: true,
                    };
                });
            },

            updateCredential: (id, updatedData) => {
                set((state) => {
                    const now = new Date().toISOString();

                    const updatedCredentials = state.credentials.map((c) =>
                        c.id === id
                            ? { ...c, ...updatedData, updatedAt: now }
                            : c,
                    );

                    const updatedFavorites = state.favoriteCredentials.map(
                        (c) =>
                            c.id === id
                                ? { ...c, ...updatedData, updatedAt: now }
                                : c,
                    );

                    return {
                        credentials: updatedCredentials,
                        favoriteCredentials: updatedFavorites,
                        isCacheStale: true,
                    };
                });
            },

            deleteCredential: (id) => {
                set((state) => {
                    const credentialToDelete = state.credentials.find(
                        (c) => c.id === id,
                    );
                    if (!credentialToDelete) return state;

                    const updatedCredentials = state.credentials.filter(
                        (c) => c.id !== id,
                    );
                    const updatedFavorites = state.favoriteCredentials.filter(
                        (c) => c.id !== id,
                    );

                    const deletedCredential = {
                        ...credentialToDelete,
                        deletedAt: new Date().toISOString(),
                    };

                    return {
                        credentials: updatedCredentials,
                        deletedCredentials: [
                            deletedCredential,
                            ...state.deletedCredentials,
                        ],
                        favoriteCredentials: updatedFavorites,
                        isCacheStale: true,
                    };
                });
            },

            toggleFavorite: (id) => {
                set((state) => {
                    const credential = state.credentials.find(
                        (c) => c.id === id,
                    );
                    if (!credential) return state;

                    const updatedCredential = {
                        ...credential,
                        favorite: !credential.favorite,
                        updatedAt: new Date().toISOString(),
                    };

                    const updatedCredentials = state.credentials.map((c) =>
                        c.id === id ? updatedCredential : c,
                    );

                    let updatedFavorites = [...state.favoriteCredentials];
                    if (updatedCredential.favorite) {
                        if (!updatedFavorites.find((c) => c.id === id)) {
                            updatedFavorites = [
                                updatedCredential,
                                ...updatedFavorites,
                            ];
                        }
                    } else {
                        updatedFavorites = updatedFavorites.filter(
                            (c) => c.id !== id,
                        );
                    }

                    return {
                        credentials: updatedCredentials,
                        favoriteCredentials: updatedFavorites,
                        isCacheStale: true,
                    };
                });
            },

            restoreCredential: (id) => {
                set((state) => {
                    const credentialToRestore = state.deletedCredentials.find(
                        (c) => c.id === id,
                    );
                    if (!credentialToRestore) return state;

                    const restoredCredential = {
                        ...credentialToRestore,
                        deletedAt: '',
                        updatedAt: new Date().toISOString(),
                    };

                    return {
                        credentials: [restoredCredential, ...state.credentials],
                        deletedCredentials: state.deletedCredentials.filter(
                            (c) => c.id !== id,
                        ),
                        isCacheStale: true,
                    };
                });
            },

            syncCredentials: (serverCredentials) => {
                set({
                    credentials: serverCredentials,
                    lastFetch: Date.now(),
                    isCacheStale: false,
                });
            },

            syncDeletedCredentials: (serverDeleted) => {
                set({
                    deletedCredentials: serverDeleted,
                    lastFetch: Date.now(),
                    isCacheStale: false,
                });
            },

            syncFavoriteCredentials: (serverFavorites) => {
                set({
                    favoriteCredentials: serverFavorites,
                    lastFetch: Date.now(),
                    isCacheStale: false,
                });
            },

            getCredentialsLength: () => get().credentials.length,
            getDeletedLength: () => get().deletedCredentials.length,
            getFavoritesLength: () => get().favoriteCredentials.length,
            getCredentialById: (id) =>
                get().credentials.find((c) => c.id === id),

            clearAllCredentials: () => {
                set({
                    credentials: [],
                    favoriteCredentials: [],
                    isCacheStale: true,
                });
            },

            clearDeletedCredentials: () => {
                set({
                    deletedCredentials: [],
                    isCacheStale: true,
                });
            },

            invalidateCache: () => {
                set({ isCacheStale: true });
            },

            clearStore: () => {
                set({
                    credentials: [],
                    deletedCredentials: [],
                    favoriteCredentials: [],
                    lastFetch: null,
                    isCacheStale: true,
                });
            },
        }),
        {
            name: 'credentials-storage',
            partialize: (state) => ({
                credentials: state.credentials,
                deletedCredentials: state.deletedCredentials,
                favoriteCredentials: state.favoriteCredentials,
                lastFetch: state.lastFetch,
                isCacheStale: state.isCacheStale,
            }),
        },
    ),
);
