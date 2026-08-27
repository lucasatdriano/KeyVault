'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

import { startRecoveryAction } from '@/src/server/actions/recovery/flow/start-recovery.action';

import Button from '@/src/client/components/ui/buttons/Button';
import InputTextForm from '@/src/client/components/ui/inputs/InputTextForm';
import Logo from '@/src/client/components/layout/logo/Logo';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail) {
            setError('E-mail é obrigatório.');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(normalizedEmail)) {
            setError('E-mail inválido.');
            return;
        }

        try {
            setIsLoading(true);
            setError('');

            const result = await startRecoveryAction(normalizedEmail);

            if (!result.success || !result.data) {
                throw new Error(
                    result.error ?? 'Não foi possível iniciar a recuperação.',
                );
            }

            toast.success('Recuperação iniciada.');

            router.push(
                `/forgot-password/recovery?token=${encodeURIComponent(
                    result.data.token,
                )}`,
            );
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Erro ao iniciar recuperação.';

            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-6 flex justify-center">
                <Logo variant="icon" size="lg" />
            </div>

            <h2 className="mb-2 text-center text-3xl font-bold text-foreground">
                Recuperar senha
            </h2>

            <p className="mb-8 text-center text-sm text-foreground/70">
                Digite seu e-mail para iniciar a recuperação da sua conta.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
                <InputTextForm
                    label="E-mail"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                    }}
                    leftIcon={<Mail className="h-5 w-5" />}
                    error={error}
                />

                <Button
                    type="submit"
                    disabled={isLoading}
                    fullWidth
                    isLoading={isLoading}
                    loadingText="Continuando..."
                    rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                    Continuar
                </Button>

                <button
                    type="button"
                    onClick={() => router.push('/login')}
                    className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 text-sm text-foreground/60 transition-colors duration-200 hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar para o login
                </button>
            </form>
        </div>
    );
}
