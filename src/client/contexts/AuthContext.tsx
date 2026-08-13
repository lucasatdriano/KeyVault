'use client';

import { Profile } from '@/src/shared/types/profile';
import { createContext } from 'react';

interface AuthContextValue {
    user: Profile;
    updateUser: (userData: Partial<Profile>) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
