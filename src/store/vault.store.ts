import { create } from 'zustand';
import { Credential } from '../types/credential';
import { Category } from '../types/category';

export interface VaultState {
    credentials: Credential[];
    selectedCredential: Credential | null;
    selectedCategory: Category | null;

    visiblePasswords: Set<string>;

    isLoading: boolean;

    isModalOpen: boolean;
    activeModal: 'create' | 'edit' | 'view' | null;
}

export interface VaultActions {
    setCredentials: (credentials: Credential[]) => void;

    addCredential: (credential: Credential) => void;

    updateCredential: (id: string, data: Partial<Credential>) => void;

    removeCredential: (id: string) => void;

    clearCredentials: () => void;

    selectCredential: (credential: Credential | null) => void;

    setSelectedCategory: (category: Category | null) => void;

    togglePasswordVisibility: (credentialId: string) => void;

    hideAllPasswords: () => void;

    setLoading: (loading: boolean) => void;

    openModal: (
        mode: 'create' | 'edit' | 'view',
        credential?: Credential,
    ) => void;

    closeModal: () => void;

    reset: () => void;
}

export type VaultStore = VaultState & VaultActions;

const initialState: VaultState = {
    credentials: [],
    selectedCredential: null,
    selectedCategory: null,

    visiblePasswords: new Set(),

    isLoading: false,

    isModalOpen: false,
    activeModal: null,
};

export const useVaultStore = create<VaultStore>((set) => ({
    ...initialState,

    setCredentials: (credentials) => set({ credentials }),

    addCredential: (credential) =>
        set((state) => ({
            credentials: [credential, ...state.credentials],
        })),

    updateCredential: (id, data) =>
        set((state) => ({
            credentials: state.credentials.map((credential) =>
                credential.id === id ? { ...credential, ...data } : credential,
            ),

            selectedCredential:
                state.selectedCredential?.id === id
                    ? {
                          ...state.selectedCredential,
                          ...data,
                      }
                    : state.selectedCredential,
        })),

    removeCredential: (id) =>
        set((state) => {
            const visiblePasswords = new Set(state.visiblePasswords);

            visiblePasswords.delete(id);

            return {
                credentials: state.credentials.filter(
                    (credential) => credential.id !== id,
                ),

                selectedCredential:
                    state.selectedCredential?.id === id
                        ? null
                        : state.selectedCredential,

                visiblePasswords,
            };
        }),

    clearCredentials: () =>
        set({
            credentials: [],
            visiblePasswords: new Set(),
        }),

    selectCredential: (credential) =>
        set({
            selectedCredential: credential,
        }),

    setSelectedCategory: (category) =>
        set({
            selectedCategory: category,
        }),

    togglePasswordVisibility: (credentialId) =>
        set((state) => {
            const visiblePasswords = new Set(state.visiblePasswords);

            if (visiblePasswords.has(credentialId)) {
                visiblePasswords.delete(credentialId);
            } else {
                visiblePasswords.add(credentialId);
            }

            return { visiblePasswords };
        }),

    hideAllPasswords: () =>
        set({
            visiblePasswords: new Set(),
        }),

    setLoading: (isLoading) =>
        set({
            isLoading,
        }),

    openModal: (mode, credential) =>
        set({
            isModalOpen: true,
            activeModal: mode,
            selectedCredential: credential ?? null,
        }),

    closeModal: () =>
        set({
            isModalOpen: false,
            activeModal: null,
            selectedCredential: null,
            visiblePasswords: new Set(),
        }),

    reset: () =>
        set({
            ...initialState,
            visiblePasswords: new Set(),
        }),
}));
