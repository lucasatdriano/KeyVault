'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import Button from '@/src/client/components/ui/buttons/Button';
import InputTextForm from '@/src/client/components/ui/inputs/InputTextForm';
import Logo from '@/src/client/components/layout/logo/Logo';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            setError('E-mail é obrigatório');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('E-mail inválido');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            console.log('Enviando recuperação para:', email);
            setIsSent(true);
        } catch (error) {
            setError('Erro ao enviar e-mail. Tente novamente.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
            <div className="absolute -top-25 -right-25 w-64 h-64 bg-primary/20 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-25 -left-25 w-80 h-80 bg-secondary/20 rounded-full opacity-20 blur-3xl"></div>

            <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
                <div className="flex justify-center mb-6">
                    <Logo variant="icon" size="lg"></Logo>
                </div>

                <h2 className="text-3xl font-bold text-foreground mb-2 text-center">
                    Esqueci minha senha
                </h2>
                <p className="text-foreground/70 text-sm mb-8 text-center">
                    {!isSent
                        ? 'Digite seu e-mail para receber o link de recuperação.'
                        : 'E-mail enviado com sucesso! Verifique sua caixa de entrada.'}
                </p>

                {!isSent ? (
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
                            leftIcon={<Mail className="w-5 h-5" />}
                            error={error}
                        />

                        <Button
                            type="submit"
                            disabled={isLoading}
                            fullWidth
                            isLoading={isLoading}
                            loadingText="Enviando..."
                            leftIcon={<Send className="w-5 h-5" />}
                        >
                            Enviar link de recuperação
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
                ) : (
                    <div className="space-y-5">
                        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                            <div className="flex justify-center mb-2">
                                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <Mail className="w-6 h-6 text-green-500" />
                                </div>
                            </div>
                            <p className="text-green-500 font-medium">
                                E-mail enviado!
                            </p>
                            <p className="text-foreground/60 text-sm mt-1">
                                Enviamos um link de recuperação para{' '}
                                <span className="text-foreground font-medium">
                                    {email}
                                </span>
                            </p>
                        </div>

                        <Button
                            type="button"
                            onClick={() => router.push('/login')}
                            fullWidth
                            variant="secondary"
                            leftIcon={<ArrowLeft className="w-5 h-5" />}
                        >
                            Voltar para o login
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
