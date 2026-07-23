import { create } from 'zustand';

export interface SettingsState {
    autoLockMinutes: number;
    autoCopy: boolean;
    hidePasswordDelay: number;
    notificationsEnabled: boolean;
}

export interface SettingsActions {
    updateAutoLock: (minutes: number) => void;
    updateAutoCopy: (enabled: boolean) => void;
    updateHidePasswordDelay: (delay: number) => void;
    updateNotifications: (enabled: boolean) => void;
    reset: () => void;
}

export type SettingsStore = SettingsState & SettingsActions;

const DEFAULT_AUTO_LOCK_MINUTES = 5;
const DEFAULT_HIDE_PASSWORD_DELAY = 3000;

const initialState: SettingsState = {
    autoLockMinutes: DEFAULT_AUTO_LOCK_MINUTES,
    autoCopy: false,
    hidePasswordDelay: DEFAULT_HIDE_PASSWORD_DELAY,
    notificationsEnabled: true,
};

export const useSettingsStore = create<SettingsStore>((set) => ({
    ...initialState,

    updateAutoLock: (autoLockMinutes) => set({ autoLockMinutes }),

    updateAutoCopy: (autoCopy) => set({ autoCopy }),

    updateHidePasswordDelay: (hidePasswordDelay) => set({ hidePasswordDelay }),

    updateNotifications: (notificationsEnabled) =>
        set({ notificationsEnabled }),

    reset: () => set(initialState),
}));
