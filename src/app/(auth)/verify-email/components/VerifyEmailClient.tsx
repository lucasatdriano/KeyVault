'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { verifyEmailAction } from '@/src/server/actions/auth/verify-email.action';

import Button from '@/src/client/components/ui/buttons/Button';
import Logo from '@/src/client/components/layout/logo/Logo';

export function VerifyEmailClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [isLoading, setIsLoading] = useState(false);

    const handleVerifyEmail = async () => {
        if (!token) {
            toast.error('Token de verificação inválido.');
            return;
        }

        setIsLoading(true);

        try {
            const result = await verifyEmailAction(token);

            if (!result.success) {
                toast.error(result.error);
                return;
            }

            toast.success('E-mail verificado com sucesso!');
            router.push('/login');
        } catch {
            toast.error('Erro interno do servidor.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
            <div className="flex justify-center mb-6">
                <Logo variant="icon" size="lg" />
            </div>

            <h2 className="text-3xl font-bold text-foreground mb-2 text-center">
                Verificação de E-mail
            </h2>

            <p className="text-foreground/70 text-sm mb-8 text-center">
                Clique no botão abaixo para verificar seu e-mail
            </p>

            <Button
                type="button"
                onClick={handleVerifyEmail}
                disabled={isLoading}
                fullWidth
                isLoading={isLoading}
                loadingText="Verificando..."
            >
                Verificar E-mail
            </Button>
        </div>
    );
}
