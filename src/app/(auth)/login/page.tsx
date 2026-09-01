'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MailIcon, KeyIcon, LogInIcon } from 'lucide-react';

import { LoginFormData } from '@/src/shared/types/auth';

import { useAuthActions } from '@/src/client/hooks/auth/useAuthActions';
import { useAuthStore } from '@/src/client/store/auth.store';
import { validateLoginForm } from '@/src/client/validators/auth.validator';
import { hasValidationErrors, ValidationErrors } from '@/src/client/validators';

import Button from '@/src/client/components/ui/buttons/Button';
import InputTextForm from '@/src/client/components/ui/inputs/InputTextForm';
import Logo from '@/src/client/components/layout/logo/Logo';

import { LoginClient } from '@/src/app/(auth)/login/components/LoginClient';

export default function LoginPage() {
    const router = useRouter();
    const setIsLoggingOut = useAuthStore((state) => state.setIsLoggingOut);
    const { isLoggingIn, handleLogin } = useAuthActions();

    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<ValidationErrors<LoginFormData>>({
        email: '',
        password: '',
    });

    useEffect(() => {
        setIsLoggingOut(false);
    }, [setIsLoggingOut]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validateLoginForm({
            email: formData.email,
            password: formData.password,
        });

        setErrors({
            email: validationErrors.email ?? '',
            password: validationErrors.password ?? '',
        });

        if (hasValidationErrors(validationErrors)) {
            return;
        }

        const success = await handleLogin(formData);

        if (success) {
            setFormData({
                email: '',
                password: '',
            });
            setErrors({
                email: '',
                password: '',
            });
        }
    };

    return (
        <>
            <Suspense fallback={null}>
                <LoginClient />
            </Suspense>
            <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
                <div className="flex justify-center mb-6">
                    <Logo variant="icon" size="lg" />
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
                        value={formData.email}
                        onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (errors.email) {
                                setErrors((prev) => ({
                                    ...prev,
                                    email: '',
                                }));
                            }
                        }}
                        leftIcon={<MailIcon className="w-5 h-5" />}
                        error={errors.email}
                        disabled={isLoggingIn}
                    />

                    <InputTextForm
                        label="Senha"
                        placeholder="********"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                password: e.target.value,
                            });
                            if (errors.password) {
                                setErrors((prev) => ({
                                    ...prev,
                                    password: '',
                                }));
                            }
                        }}
                        leftIcon={<KeyIcon className="w-5 h-5" />}
                        error={errors.password}
                        disabled={isLoggingIn}
                    />

                    <div className="flex items-center justify-end">
                        <button
                            type="button"
                            onClick={() => router.push('/forgot-password')}
                            className="cursor-pointer text-sm text-primary/60 hover:text-primary transition-colors duration-200"
                            disabled={isLoggingIn}
                        >
                            Esqueci minha senha
                        </button>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoggingIn}
                        fullWidth
                        isLoading={isLoggingIn}
                        loadingText="Entrando..."
                        leftIcon={<LogInIcon className="w-5 h-5" />}
                    >
                        Entrar
                    </Button>
                </form>

                <p className="text-center mt-6 text-foreground/60 text-sm">
                    Não tem uma conta?{' '}
                    <button
                        onClick={() => router.push('/register')}
                        className="cursor-pointer text-primary font-semibold hover:underline transition-all duration-200"
                        disabled={isLoggingIn}
                    >
                        Criar conta
                    </button>
                </p>
            </div>
        </>
    );
}
