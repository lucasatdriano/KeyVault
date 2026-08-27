'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { logoutAction } from '@/src/server/actions/auth/logout.action';

import { clearAllStores } from '@/src/client/store';
import { useAuthStore } from '@/src/client/store/auth.store';

export function useLogout() {
    const router = useRouter();
    const setIsLoggingOut = useAuthStore((state) => state.setIsLoggingOut);
    const isLoggingOut = useAuthStore((state) => state.isLoggingOut);

    const logout = useCallback(
        async (redirectTo = '/login') => {
            if (isLoggingOut) {
                return;
            }

            setIsLoggingOut(true);

            try {
                const result = await logoutAction();

                if (!result.success) {
                    console.error(result.error);
                    setIsLoggingOut(false);
                    return;
                }

                clearAllStores({
                    preserveLogoutState: true,
                });

                router.replace(redirectTo);
            } catch (error) {
                console.error('Erro ao fazer logout:', error);
                setIsLoggingOut(false);
            }
        },
        [isLoggingOut, setIsLoggingOut, router],
    );

    return {
        logout,
        isLoggingOut,
    };
}
