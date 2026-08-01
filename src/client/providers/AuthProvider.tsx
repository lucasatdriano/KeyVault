'use client';

import { AuthContext } from '../contexts/AuthContext';
import { User } from '@/src/shared/types/user';

interface AuthProviderProps {
    children: React.ReactNode;
    user: User;
}

export function AuthProvider({ children, user }: AuthProviderProps) {
    return (
        <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
    );
}
