import { create } from 'zustand';

interface RecoveryStore {
    recoverySecrets: string[];

    setRecoverySecrets: (secrets: string[]) => void;
    addRecoverySecrets: (secrets: string[]) => void;
    clearRecoverySecrets: () => void;
}

export const useRecoveryStore = create<RecoveryStore>((set) => ({
    recoverySecrets: [],

    setRecoverySecrets: (secrets) =>
        set({
            recoverySecrets: [...secrets],
        }),

    addRecoverySecrets: (secrets) =>
        set((state) => ({
            recoverySecrets: [...state.recoverySecrets, ...secrets],
        })),

    clearRecoverySecrets: () =>
        set({
            recoverySecrets: [],
        }),
}));
