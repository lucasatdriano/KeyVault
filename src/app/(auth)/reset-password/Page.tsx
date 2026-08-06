'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Key, Lock, ArrowLeft } from 'lucide-react';
import Button from '@/src/client/components/ui/buttons/Button';
import InputTextForm from '@/src/client/components/ui/inputs/InputTextForm';
import Logo from '@/src/client/components/layout/logo/Logo';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword.length < 6) {
            setError('Senha deve ter pelo menos 6 caracteres');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            console.log('Resetando senha:', { newPassword });
            router.push('/login');
        } catch (error) {
            setError('Erro ao resetar senha. Tente novamente.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
            <div className="flex justify-center mb-6">
                <Logo variant="icon" size="lg"></Logo>
            </div>

            <h2 className="text-3xl font-bold text-foreground mb-2 text-center">
                Redefinir senha
            </h2>
            <p className="text-foreground/70 text-sm mb-8 text-center">
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
                    leftIcon={<Key className="w-5 h-5" />}
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
                    leftIcon={<Lock className="w-5 h-5" />}
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
                    className="cursor-pointer flex items-center justify-center gap-2 text-foreground/60 hover:text-foreground transition-colors duration-200 text-sm w-full mt-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar para o login
                </button>
            </form>
        </div>
    );
}
