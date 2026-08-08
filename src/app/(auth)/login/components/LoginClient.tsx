'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export function LoginClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const logoutExecuted = useRef(false);

    useEffect(() => {
        if (logoutExecuted.current) return;
        if (!searchParams.get('expired')) return;

        logoutExecuted.current = true;
        toast.info('Sua sessão expirou. Faça login novamente.');
        router.replace('/');
    }, [router, searchParams]);

    return null;
}
