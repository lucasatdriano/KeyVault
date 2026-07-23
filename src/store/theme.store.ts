import { create } from 'zustand';

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeState {
    theme: Theme;
}

export interface ThemeActions {
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

export type ThemeStore = ThemeState & ThemeActions;

const THEME_CYCLE: Theme[] = ['light', 'dark', 'system'];

const initialState: ThemeState = {
    theme: 'system',
};

export const useThemeStore = create<ThemeStore>((set) => ({
    ...initialState,

    setTheme: (theme) => set({ theme }),

    toggleTheme: () =>
        set((state) => {
            const currentIndex = THEME_CYCLE.indexOf(state.theme);
            const nextIndex = (currentIndex + 1) % THEME_CYCLE.length;
            return { theme: THEME_CYCLE[nextIndex] };
        }),
}));
