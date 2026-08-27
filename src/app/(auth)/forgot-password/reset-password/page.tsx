'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Key, Lock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { resetPasswordAction } from '@/src/server/actions/recovery/flow/reset-password.action';

import Button from '@/src/client/components/ui/buttons/Button';
import InputTextForm from '@/src/client/components/ui/inputs/InputTextForm';
import Logo from '@/src/client/components/layout/logo/Logo';

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [isLoading, setIsLoading] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast.error('Token de recuperação não encontrado.');
            router.replace('/forgot-password');
            return;
        }

        if (newPassword.length < 8) {
            setError('Senha deve ter pelo menos 8 caracteres.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const result = await resetPasswordAction(token, newPassword);

            if (!result.success) {
                throw new Error(
                    result.error ?? 'Não foi possível redefinir a senha.',
                );
            }

            toast.success('Senha redefinida com sucesso.');

            router.replace('/login');
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Erro ao redefinir senha. Tente novamente.';

            setError(message);
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
                Redefinir senha
            </h2>

            <p className="mb-8 text-center text-sm text-foreground/70">
                Digite sua nova senha abaixo.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
                <InputTextForm
                    label="Nova senha"
                    type="password"
                    placeholder="********"
                    value={newPassword}
                    onChange={(e) => {
                        setNewPassword(e.target.value);
                        setError('');
                    }}
                    leftIcon={<Key className="h-5 w-5" />}
                    error={error}
                />

                <InputTextForm
                    label="Confirmar nova senha"
                    type="password"
                    placeholder="********"
                    value={confirmPassword}
                    onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError('');
                    }}
                    leftIcon={<Lock className="h-5 w-5" />}
                />

                <Button
                    type="submit"
                    disabled={isLoading}
                    fullWidth
                    isLoading={isLoading}
                    loadingText="Redefinindo..."
                >
                    Redefinir senha
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
