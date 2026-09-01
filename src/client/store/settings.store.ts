import { create } from 'zustand';

export interface SettingsState {
    currentUserId: string | null;
    autoLockMinutes: number;
    hidePasswordDelay: number;
}

export interface SettingsActions {
    updateAutoLock: (minutes: number) => void;
    updateHidePasswordDelay: (delay: number) => void;
    loadUserSettings: (userId: string) => void;
    reset: () => void;
}

export type SettingsStore = SettingsState & SettingsActions;

const DEFAULT_AUTO_LOCK_MINUTES = 3;
const DEFAULT_HIDE_PASSWORD_DELAY = 5000;

const STORAGE_KEY = 'keyvault-settings';

const initialState: Omit<SettingsState, 'currentUserId'> = {
    autoLockMinutes: DEFAULT_AUTO_LOCK_MINUTES,
    hidePasswordDelay: DEFAULT_HIDE_PASSWORD_DELAY,
};

interface StoredUserSettings {
    autoLockMinutes: number;
    hidePasswordDelay: number;
}

type StoredSettings = Record<string, StoredUserSettings>;

const getStoredSettings = (): StoredSettings => {
    if (typeof window === 'undefined') {
        return {};
    }

    try {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (!stored) {
            return {};
        }

        return JSON.parse(stored) as StoredSettings;
    } catch {
        return {};
    }
};

const saveStoredSettings = (
    userId: string,
    settings: StoredUserSettings,
): void => {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        const storedSettings = getStoredSettings();

        storedSettings[userId] = settings;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(storedSettings));
    } catch (error) {
        console.error('Erro ao salvar configurações:', error);
    }
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
    currentUserId: null,

    ...initialState,

    updateAutoLock: (autoLockMinutes) => {
        set({ autoLockMinutes });

        const userId = get().currentUserId;

        if (!userId) {
            return;
        }

        saveStoredSettings(userId, {
            autoLockMinutes,
            hidePasswordDelay: get().hidePasswordDelay,
        });
    },

    updateHidePasswordDelay: (hidePasswordDelay) => {
        set({ hidePasswordDelay });

        const userId = get().currentUserId;

        if (!userId) {
            return;
        }

        saveStoredSettings(userId, {
            autoLockMinutes: get().autoLockMinutes,
            hidePasswordDelay,
        });
    },

    loadUserSettings: (userId) => {
        const storedSettings = getStoredSettings();
        const userSettings = storedSettings[userId];

        set({
            currentUserId: userId,
            autoLockMinutes:
                userSettings?.autoLockMinutes ?? DEFAULT_AUTO_LOCK_MINUTES,
            hidePasswordDelay:
                userSettings?.hidePasswordDelay ?? DEFAULT_HIDE_PASSWORD_DELAY,
        });
    },

    reset: () => {
        set({
            currentUserId: null,
            ...initialState,
        });
    },
}));
