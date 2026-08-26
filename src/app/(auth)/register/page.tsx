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
import { toast } from 'sonner';

import { registerAction } from '@/src/server/actions/auth/register.action';
import { resendEmailVerificationAction } from '@/src/server/actions/auth/verify-email.action';

import { createVaultKey, encryptVaultKey } from '@/src/shared/crypto/vault';
import { encryptString } from '@/src/shared/crypto/cipher';
import { RegisterFormData } from '@/src/shared/types/auth';

import { DEFAULT_CATEGORIES } from '@/src/client/constants/categories';
import { validateRegisterForm } from '@/src/client/validators/auth.validator';
import { hasValidationErrors, ValidationErrors } from '@/src/client/validators';

import EmailVerificationModal from '@/src/client/components/layout/modals/authModals/EmailVerificationModal';
import Button from '@/src/client/components/ui/buttons/Button';
import InputTextForm from '@/src/client/components/ui/inputs/InputTextForm';
import Logo from '@/src/client/components/layout/logo/Logo';

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [verificationToken, setVerificationToken] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [errors, setErrors] = useState<
        ValidationErrors<RegisterFormData & { terms: string }>
    >({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        terms: '',
    });
    const [formData, setFormData] = useState<RegisterFormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
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

        if (hasValidationErrors(validationErrors)) {
            setErrors(validationErrors);
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

            if (!result.success || result.data === null) {
                toast.error(result.error);
                return;
            }

            const normalizedEmail = formData.email.trim().toLowerCase();

            setUserEmail(normalizedEmail);
            setVerificationToken(result.data.verificationToken);
            setShowModal(true);

            toast.success('Cadastro realizado! Verifique seu e-mail.');
        } catch (error) {
            console.error('Erro ao realizar cadastro:', error);

            toast.error('Erro interno ao realizar cadastro.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyEmail = () => {
        if (!verificationToken) {
            toast.error('Token de verificação não encontrado.');
            return;
        }

        setShowModal(false);

        router.push(
            `/verify-email?token=${encodeURIComponent(verificationToken)}`,
        );
    };

    const handleResendEmail = async () => {
        const result = await resendEmailVerificationAction(userEmail);

        if (!result.success) {
            toast.error(result.error);
            return;
        }

        toast.success('E-mail reenviado! Verifique seu e-mail novamente.');
    };

    return (
        <>
            <div className="relative z-10 my-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
                <div className="mb-6 flex justify-center">
                    <Logo variant="icon" size="lg" />
                </div>

                <h2 className="mb-2 text-center text-3xl font-bold text-foreground">
                    Criar conta
                </h2>

                <p className="mb-8 text-center text-sm text-foreground/70">
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
                        leftIcon={<UserIcon className="h-5 w-5" />}
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
                        leftIcon={<MailIcon className="h-5 w-5" />}
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
                        leftIcon={<KeyIcon className="h-5 w-5" />}
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
                        leftIcon={<LockIcon className="h-5 w-5" />}
                        error={errors.confirmPassword}
                    />

                    <div className="flex items-start gap-2 pt-1">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={acceptTerms}
                            onChange={(e) => {
                                setAcceptTerms(e.target.checked);

                                if (errors.terms) {
                                    setErrors((prev) => ({
                                        ...prev,
                                        terms: '',
                                    }));
                                }
                            }}
                            className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded border-white/20 bg-white/5 accent-primary"
                        />

                        <label
                            htmlFor="terms"
                            className="cursor-pointer text-sm text-foreground/70"
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
                        <p className="-mt-2 text-xs text-error">
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
                                <CheckCircleIcon className="h-5 w-5" />
                            )
                        }
                    >
                        Criar Conta
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-foreground/60">
                    Já tem uma conta?{' '}
                    <button
                        type="button"
                        onClick={() => router.push('/login')}
                        className="cursor-pointer font-semibold text-primary transition-all duration-200 hover:underline"
                    >
                        Entrar
                    </button>
                </p>
            </div>

            <EmailVerificationModal
                isOpen={showModal}
                email={userEmail}
                onVerify={handleVerifyEmail}
                onResendEmail={handleResendEmail}
            />
        </>
    );
}
