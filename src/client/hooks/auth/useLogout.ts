'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { clearAllStores } from '@/src/client/store';
import { logoutAction } from '@/src/server/actions/auth/logout.action';
import { useAuthStore } from '@/src/client/store/auth.store';

export function useLogout() {
    const router = useRouter();
    const setIsLoggingOut = useAuthStore((state) => state.setIsLoggingOut);
    const isLoggingOut = useAuthStore((state) => state.isLoggingOut);

    const logout = useCallback(
        async (redirectTo = '/login') => {
            if (isLoggingOut) return;

            setIsLoggingOut(true);

            try {
                const result = await logoutAction();

                if (!result.success) {
                    console.error(result.error);
                    return;
                }

                clearAllStores();

                router.replace(redirectTo);
                router.refresh();
            } catch (error) {
                console.error('Erro ao fazer logout:', error);
                setIsLoggingOut(false);
            }
        },
        [isLoggingOut, setIsLoggingOut, router],
    );

    return { logout, isLoggingOut };
}
