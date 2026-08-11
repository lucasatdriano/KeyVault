import { Credential } from '@/src/shared/types/credential';
import { create } from 'zustand';

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

export const useCredentialsStore = create<CredentialsStore>((set, get) => ({
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
            const updatedCredentials = [newCredential, ...state.credentials];

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

            const updatedCredentials = state.credentials.map((credential) =>
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
            const credential = state.credentials.find((item) => item.id === id);

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
                    updatedFavorites = [updatedCredential, ...updatedFavorites];
                }
            } else {
                updatedFavorites = updatedFavorites.filter(
                    (item) => item.id !== id,
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

            return {
                credentials: [restoredCredential, ...state.credentials],

                deletedCredentials: state.deletedCredentials.filter(
                    (credential) => credential.id !== id,
                ),

                favoriteCredentials: restoredCredential.favorite
                    ? [restoredCredential, ...state.favoriteCredentials]
                    : state.favoriteCredentials,

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
        get().credentials.find((credential) => credential.id === id),

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
        set({
            isCacheStale: true,
        });
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
}));
