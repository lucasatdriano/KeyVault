'use client';

import { create } from 'zustand';

interface VaultState {
    vaultKey: Uint8Array | null;

    setVaultKey: (vaultKey: Uint8Array) => void;

    clearVault: () => void;
}

export const useVaultStore = create<VaultState>((set) => ({
    vaultKey: null,

    setVaultKey: (vaultKey) =>
        set({
            vaultKey,
        }),

    clearVault: () =>
        set({
            vaultKey: null,
        }),
}));
