'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { clearAllStores } from '@/src/client/store';

export function useSessionExpiredHandler() {
    const router = useRouter();

    useEffect(() => {
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const response = await originalFetch(...args);

            if (response.headers.get('x-session-expired') === 'true') {
                clearAllStores();

                router.replace('/?expired=1');
                router.refresh();
            }

            return response;
        };

        return () => {
            window.fetch = originalFetch;
        };
    }, [router]);
}
