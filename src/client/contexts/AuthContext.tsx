'use client';

import { createContext } from 'react';
import { User } from '@/src/shared/types/user';

interface AuthContextValue {
    user: User;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
