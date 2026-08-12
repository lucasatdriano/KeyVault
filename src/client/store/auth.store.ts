import { create } from 'zustand';
import { User } from '../../shared/types/user';

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isLoggingOut: boolean;
}

interface AuthActions {
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    setIsLoggingOut: (value: boolean) => void;
    clear: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
    user: null,
    isLoading: false,
    isLoggingOut: false,
};

export const useAuthStore = create<AuthStore>((set) => ({
    ...initialState,

    setUser: (user) => set({ user }),

    setLoading: (loading) => set({ isLoading: loading }),

    setIsLoggingOut: (value) =>
        set({
            isLoggingOut: value,
        }),

    clear: () => set(initialState),
}));
