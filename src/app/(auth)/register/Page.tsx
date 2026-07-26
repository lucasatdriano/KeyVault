'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Key, Lock, CheckCircle } from 'lucide-react';
import Button from '@/src/components/ui/buttons/Button';
import InputTextForm from '@/src/components/ui/inputs/InputTextForm';
import Logo from '@/src/components/layout/logo/Logo';

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
        if (!formData.email.trim()) newErrors.email = 'E-mail é obrigatório';
        else if (!/\S+@\S+\.\S+/.test(formData.email))
            newErrors.email = 'E-mail inválido';
        if (!formData.password) newErrors.password = 'Senha é obrigatória';
        else if (formData.password.length < 6)
            newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
        if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = 'As senhas não coincidem';
        if (!acceptTerms)
            newErrors.terms = 'Você precisa aceitar os termos de uso';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            console.log('Registrando:', formData);
            router.push('/login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
            <div className="absolute -top-25 -right-25 w-64 h-64 bg-primary/20 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-25 -left-25 w-80 h-80 bg-secondary/20 rounded-full opacity-20 blur-3xl"></div>

            <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto">
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
                        leftIcon={<User className="w-5 h-5" />}
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
                        leftIcon={<Mail className="w-5 h-5" />}
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
                        leftIcon={<Key className="w-5 h-5" />}
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
                        leftIcon={<Lock className="w-5 h-5" />}
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
                            !isLoading && <CheckCircle className="w-5 h-5" />
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
