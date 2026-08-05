'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    UserIcon,
    MailIcon,
    KeyIcon,
    LockIcon,
    CheckCircleIcon,
} from 'lucide-react';
import Button from '@/src/client/components/ui/buttons/Button';
import InputTextForm from '@/src/client/components/ui/inputs/InputTextForm';
import Logo from '@/src/client/components/layout/logo/Logo';
import { registerAction } from '@/src/server/actions/auth/register.action';
import { toast } from 'sonner';
import { validateRegisterForm } from '@/src/client/validators/auth.validator';
import { DEFAULT_CATEGORIES } from '@/src/client/constants/categories';
import { createVaultKey, encryptVaultKey } from '@/src/shared/crypto/vault';
import { encryptString } from '@/src/shared/crypto/cipher';
import { RegisterFormData } from '@/src/shared/types/auth';

export default function RegisterPage() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<RegisterFormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [errors, setErrors] = useState<RegisterFormData & { terms: string }>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        terms: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validateRegisterForm(
            {
                ...formData,
                confirmPassword: formData.confirmPassword,
            },
            acceptTerms,
        );

        if (Object.keys(validationErrors).length > 0) {
            setErrors({
                name: validationErrors.name ?? '',
                email: validationErrors.email ?? '',
                password: validationErrors.password ?? '',
                confirmPassword: validationErrors.confirmPassword ?? '',
                terms: validationErrors.terms ?? '',
            });

            return;
        }

        setErrors({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            terms: '',
        });

        const vaultKey = createVaultKey();

        const encryptedCategories = await Promise.all(
            DEFAULT_CATEGORIES.map(async (category) => {
                const encrypted = await encryptString(category.name, vaultKey);

                return {
                    cipherText: encrypted.cipherText,
                    iv: encrypted.iv,
                };
            }),
        );

        const encryptedVaultKey = await encryptVaultKey(
            vaultKey,
            formData.password,
        );

        setIsLoading(true);
        try {
            const result = await registerAction({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                encryptedVaultKey,
                categories: encryptedCategories,
            });

            if (!result.success) {
                toast.error(result.error);
                return;
            }

            toast.success(result.success);
            router.push('/login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
            <div className="absolute -top-25 -right-25 w-64 h-64 bg-primary/20 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-25 -left-25 w-80 h-80 bg-secondary/20 rounded-full opacity-20 blur-3xl"></div>

            <div className="relative z-10 my-10 w-full max-w-md bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
                <div className="flex justify-center mb-6">
                    <Logo variant="icon" size="lg"></Logo>
                </div>

                <h2 className="text-3xl font-bold text-foreground mb-2 text-center">
                    Criar conta
                </h2>
                <p className="text-foreground/70 text-sm mb-8 text-center">
                    Comece a proteger suas senhas gratuitamente.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputTextForm
                        label="Nome"
                        name="name"
                        type="text"
                        placeholder="Alex Ferreira"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                        leftIcon={<UserIcon className="w-5 h-5" />}
                        error={errors.name}
                    />

                    <InputTextForm
                        label="E-mail"
                        name="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                email: e.target.value,
                            }))
                        }
                        leftIcon={<MailIcon className="w-5 h-5" />}
                        error={errors.email}
                    />

                    <InputTextForm
                        label="Senha"
                        name="password"
                        type="password"
                        placeholder="********"
                        value={formData.password}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                password: e.target.value,
                            }))
                        }
                        leftIcon={<KeyIcon className="w-5 h-5" />}
                        error={errors.password}
                    />

                    <InputTextForm
                        label="Confirmar senha"
                        name="confirmPassword"
                        type="password"
                        placeholder="********"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                confirmPassword: e.target.value,
                            }))
                        }
                        leftIcon={<LockIcon className="w-5 h-5" />}
                        error={errors.confirmPassword}
                    />

                    <div className="flex items-start gap-2 pt-1">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={acceptTerms}
                            onChange={(e) => {
                                setAcceptTerms(e.target.checked);
                                if (errors.terms)
                                    setErrors((prev) => ({
                                        ...prev,
                                        terms: '',
                                    }));
                            }}
                            className="mt-1 w-4 h-4 accent-primary rounded border-white/20 bg-white/5 cursor-pointer shrink-0"
                        />
                        <label
                            htmlFor="terms"
                            className="text-foreground/70 text-sm cursor-pointer"
                        >
                            Aceito os{' '}
                            <span className="text-primary hover:underline">
                                termos de uso
                            </span>{' '}
                            e{' '}
                            <span className="text-primary hover:underline">
                                política de privacidade
                            </span>
                        </label>
                    </div>
                    {errors.terms && (
                        <p className="text-error text-xs -mt-2">
                            {errors.terms}
                        </p>
                    )}

                    <Button
                        type="submit"
                        disabled={isLoading}
                        fullWidth
                        isLoading={isLoading}
                        loadingText="Criando conta..."
                        leftIcon={
                            !isLoading && (
                                <CheckCircleIcon className="w-5 h-5" />
                            )
                        }
                    >
                        Criar Conta
                    </Button>
                </form>

                <p className="text-center mt-6 text-foreground/60 text-sm">
                    Já tem uma conta?{' '}
                    <button
                        onClick={() => router.push('/login')}
                        className="cursor-pointer text-primary font-semibold hover:underline transition-all duration-200"
                    >
                        Entrar
                    </button>
                </p>
            </div>
        </div>
    );
}
