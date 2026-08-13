'use client';

import { useState } from 'react';
import { Profile } from '@/src/shared/types/profile';
import { AuthContext } from '../contexts/AuthContext';

interface AuthProviderProps {
    children: React.ReactNode;
    user: Profile;
}

export function AuthProvider({
    children,
    user: initialUser,
}: AuthProviderProps) {
    const [user, setUser] = useState<Profile>(initialUser);

    const updateUser = (userData: Partial<Profile>) => {
        setUser((prev) => ({
            ...prev,
            ...userData,
        }));
    };

    return (
        <AuthContext.Provider value={{ user, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}
