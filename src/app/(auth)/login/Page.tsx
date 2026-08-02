'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Key, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import Button from '@/src/client/components/ui/buttons/Button';
import InputTextForm from '@/src/client/components/ui/inputs/InputTextForm';
import Logo from '@/src/client/components/layout/logo/Logo';
import { loginAction } from '@/src/server/actions/auth/login.action';
import { validateLoginForm } from '@/src/client/validators/auth.validator';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });
    const logoutExecuted = useRef(false);

    useEffect(() => {
        if (logoutExecuted.current) return;

        if (!searchParams.get('expired')) return;

        logoutExecuted.current = true;

        toast.info('Sua sessão expirou. Faça login novamente.');

        router.replace('/login');
    }, [router, searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validateLoginForm({
            email,
            password,
        });

        if (Object.keys(validationErrors).length > 0) {
            setErrors({
                email: validationErrors.email ?? '',
                password: validationErrors.password ?? '',
            });

            return;
        }

        setErrors({
            email: '',
            password: '',
        });

        setIsLoading(true);

        try {
            const result = await loginAction({
                email,
                password,
            });

            if (!result.success) {
                toast.error(result.error);
                return;
            }

            toast.success(result.message);
            router.push('/dashboard');
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
                    Bem-vindo de volta
                </h2>
                <p className="text-foreground/70 text-sm mb-8 text-center">
                    Entre na sua conta para acessar suas credenciais.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <InputTextForm
                        label="E-mail"
                        placeholder="seu@email.com"
                        type="text"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        leftIcon={<Mail className="w-5 h-5" />}
                        error={errors.email}
                    />

                    <InputTextForm
                        label="Senha"
                        placeholder="********"
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        leftIcon={<Key className="w-5 h-5" />}
                        error={errors.password}
                    />

                    <div className="flex items-center justify-end">
                        <button
                            type="button"
                            onClick={() => router.push('/forgot-password')}
                            className="cursor-pointer text-sm text-primary/60 hover:text-primary transition-colors duration-200"
                        >
                            Esqueci minha senha
                        </button>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        fullWidth
                        isLoading={isLoading}
                        loadingText="Entrando..."
                        leftIcon={<LogIn className="w-5 h-5" />}
                    >
                        Entrar
                    </Button>
                </form>

                <p className="text-center mt-6 text-foreground/60 text-sm">
                    Não tem uma conta?{' '}
                    <button
                        onClick={() => router.push('/register')}
                        className="cursor-pointer text-primary font-semibold hover:underline transition-all duration-200"
                    >
                        Criar conta
                    </button>
                </p>
            </div>
        </div>
    );
}
