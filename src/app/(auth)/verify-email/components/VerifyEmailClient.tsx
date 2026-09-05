'use client';

import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { useAuthActions } from '@/src/client/hooks/auth/useAuthActions';

import Button from '@/src/client/components/ui/buttons/Button';
import Logo from '@/src/client/components/layout/logo/Logo';

export function VerifyEmailClient() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const { isVerifyingEmail, handleVerifyEmail } = useAuthActions();

    const handleVerify = async () => {
        if (!token) {
            toast.error('Token de verificação inválido.');
            return;
        }

        await handleVerifyEmail(token);
    };

    return (
        <main className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
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
                onClick={handleVerify}
                disabled={isVerifyingEmail || !token}
                fullWidth
                isLoading={isVerifyingEmail}
                loadingText="Verificando..."
            >
                Verificar E-mail
            </Button>
        </main>
    );
}
