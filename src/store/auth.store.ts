import { create } from 'zustand';
import { User } from '../types/user';

interface AuthState {
    user: User | null;
    isLoading: boolean;
}

interface AuthActions {
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    clear: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
    user: null,
    isLoading: false,
};

export const useAuthStore = create<AuthStore>((set) => ({
    ...initialState,

    setUser: (user) => set({ user }),

    setLoading: (loading) => set({ isLoading: loading }),

    clear: () => set(initialState),
}));
