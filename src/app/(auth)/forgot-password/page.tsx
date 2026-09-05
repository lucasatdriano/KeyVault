'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MailIcon, ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';

import { useAuthActions } from '@/src/client/hooks/auth/useAuthActions';

import { hasValidationErrors, ValidationErrors } from '@/src/client/validators';
import { validateForgotPassword } from '@/src/client/validators/recovery.validator';
import { ForgotPasswordFormData } from '@/src/client/types/recovery';

import Button from '@/src/client/components/ui/buttons/Button';
import InputTextForm from '@/src/client/components/ui/inputs/InputTextForm';
import Logo from '@/src/client/components/layout/logo/Logo';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const { isStartingRecovery, handleStartRecovery } = useAuthActions();

    const [formData, setFormData] = useState<ForgotPasswordFormData>({
        email: '',
    });
    const [errors, setErrors] = useState<
        ValidationErrors<ForgotPasswordFormData>
    >({
        email: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validateForgotPassword({
            email: formData.email,
        });

        setErrors({
            email: validationErrors.email ?? '',
        });

        if (hasValidationErrors(validationErrors)) {
            return;
        }

        const token = await handleStartRecovery(formData);

        if (token) {
            setFormData({ email: '' });
            router.push(
                `/forgot-password/recovery?token=${encodeURIComponent(token)}`,
            );
        }
    };

    return (
        <main className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
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
                    leftIcon={<MailIcon className="h-5 w-5" />}
                    error={errors.email}
                    disabled={isStartingRecovery}
                />

                <Button
                    type="submit"
                    disabled={isStartingRecovery}
                    fullWidth
                    isLoading={isStartingRecovery}
                    loadingText="Continuando..."
                    rightIcon={<ArrowRightIcon className="h-5 w-5" />}
                >
                    Continuar
                </Button>

                <button
                    type="button"
                    onClick={() => router.push('/login')}
                    className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 text-sm text-foreground/60 transition-colors duration-200 hover:text-foreground"
                    disabled={isStartingRecovery}
                >
                    <ArrowLeftIcon className="h-4 w-4" />
                    Voltar para o login
                </button>
            </form>
        </main>
    );
}
