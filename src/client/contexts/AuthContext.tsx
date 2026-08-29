'use client';

import { createContext } from 'react';

import { Profile } from '@/src/shared/types/profile';

interface AuthContextValue {
    user: Profile;
    updateUser: (userData: Partial<Profile>) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
