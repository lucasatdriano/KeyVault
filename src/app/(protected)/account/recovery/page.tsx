'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Shield,
    Mail,
    CheckCircle,
    AlertTriangle,
    Key,
    ShieldCheck,
    ChevronRight,
    Copy,
    HelpCircle,
    AlertCircle,
    Check,
    Globe,
} from 'lucide-react';
import Button from '@/src/client/components/ui/buttons/Button';
import InputTextForm from '@/src/client/components/ui/inputs/InputTextForm';
import Header from '@/src/client/components/layout/header/Header';

const recoveryMethods = [
    {
        id: '1',
        name: 'E-mail de recuperação',
        description: 'Receba um link de recuperação no seu e-mail cadastrado.',
        type: 'email',
        value: 'alex.ferreira@gmail.com',
        risk: 'Baixo',
        riskLevel: 'low',
        riskDescription: 'requer acesso ao e-mail cadastrado',
        isActive: true,
        icon: Mail,
    },
    {
        id: '2',
        name: 'Login com Google',
        description: 'Use sua conta Google para verificar sua identidade.',
        type: 'google',
        value: 'alex.ferreira@gmail.com',
        risk: 'Médio',
        riskLevel: 'medium',
        riskDescription: 'requer acesso à conta Google',
        isActive: false,
        icon: Globe,
    },
    {
        id: '3',
        name: 'Perguntas de segurança',
        description: 'Responda perguntas configuradas por você.',
        type: 'questions',
        value: '3 perguntas configuradas',
        risk: 'Médio',
        riskLevel: 'medium',
        riskDescription: 'requer conhecimento das respostas',
        isActive: false,
        icon: HelpCircle,
    },
];

export default function RecoveryPage() {
    const router = useRouter();
    const [showRecoveryKey, setShowRecoveryKey] = useState(false);
    const [showSetupModal, setShowSetupModal] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

    const activeMethods = recoveryMethods.filter((m) => m.isActive);
    const recoveryLevel =
        activeMethods.length >= 3
            ? 'Alto'
            : activeMethods.length >= 2
              ? 'Médio'
              : 'Baixo';
    const recoveryLevelColor =
        activeMethods.length >= 3
            ? 'text-green-500'
            : activeMethods.length >= 2
              ? 'text-yellow-500'
              : 'text-error';
    const recoveryLevelBg =
        activeMethods.length >= 3
            ? 'bg-green-500/10'
            : activeMethods.length >= 2
              ? 'bg-yellow-500/10'
              : 'bg-error/10';

    const handleActivateMethod = (id: string) => {
        console.log('Ativar método:', id);
    };

    const handleConfigureMethod = (id: string) => {
        setSelectedMethod(id);
        setShowSetupModal(true);
    };

    const handleRemoveMethod = (id: string) => {
        console.log('Remover método:', id);
    };

    const handleViewRecoveryKey = () => {
        setShowRecoveryKey(true);
    };

    const handleCopyRecoveryKey = () => {
        navigator.clipboard.writeText('KEYVAULT-XK7M-P9R2-WQ4N');
        console.log('Recovery key copiada');
    };

    const getRiskBadgeColor = (riskLevel: string) => {
        const colors: Record<string, string> = {
            low: 'bg-green-500/20 text-green-500 border-green-500/30',
            medium: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
            high: 'bg-error/20 text-error border-error/30',
        };
        return (
            colors[riskLevel] || 'bg-white/5 text-foreground/40 border-white/10'
        );
    };

    return (
        <div className="space-y-6">
            <Header variant="recovery" />

            <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mx-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-12 h-12 rounded-xl ${recoveryLevelBg} flex items-center justify-center`}
                        >
                            <ShieldCheck
                                className={`w-6 h-6 ${recoveryLevelColor}`}
                            />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-foreground/40 uppercase tracking-wider">
                                Nível de Recuperação
                            </h2>
                            <p
                                className={`text-2xl font-bold ${recoveryLevelColor}`}
                            >
                                {recoveryLevel}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-foreground/40">
                            {activeMethods.length} de {recoveryMethods.length}{' '}
                            métodos ativos
                        </p>
                    </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <div className="flex items-start gap-3">
                        {activeMethods.length >= 2 ? (
                            <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        ) : (
                            <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                        )}
                        <div>
                            <p className="text-sm text-foreground/60">
                                {activeMethods.length >= 2
                                    ? 'Bom! Adicione mais um método para aumentar a segurança de recuperação.'
                                    : 'Adicione mais métodos de recuperação para aumentar a segurança da sua conta.'}
                            </p>
                            <p className="text-xs text-foreground/30 mt-1">
                                Recomendamos ativar ao menos 2 métodos
                                independentes.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4 mx-4">
                {recoveryMethods.map((method) => {
                    const Icon = method.icon;
                    const isActive = method.isActive;

                    return (
                        <div
                            key={method.id}
                            className={`
                                bg-white/5 rounded-2xl border p-5 transition-all
                                ${
                                    isActive
                                        ? 'border-primary/30 hover:border-primary/50'
                                        : 'border-white/10 hover:border-white/20'
                                }
                            `}
                        >
                            <div className="flex flex-col md:flex-row md:items-start gap-4">
                                <div className="flex items-start gap-4 flex-1">
                                    <div
                                        className={`
                                        w-12 h-12 rounded-xl flex items-center justify-center shrink-0
                                        ${
                                            isActive
                                                ? 'bg-primary/10 text-primary'
                                                : 'bg-white/5 text-foreground/30'
                                        }
                                    `}
                                    >
                                        <Icon className="w-6 h-6" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h3 className="text-base font-semibold text-foreground">
                                                {method.name}
                                            </h3>
                                            <span
                                                className={`
                                                px-2 py-0.5 rounded-full text-[10px] font-medium border
                                                ${
                                                    isActive
                                                        ? 'bg-green-500/20 text-green-500 border-green-500/30'
                                                        : 'bg-white/5 text-foreground/30 border-white/10'
                                                }
                                            `}
                                            >
                                                {isActive ? 'Ativo' : 'Inativo'}
                                            </span>
                                            <span
                                                className={`
                                                px-2 py-0.5 rounded-full text-[10px] font-medium border
                                                ${getRiskBadgeColor(method.riskLevel)}
                                            `}
                                            >
                                                {method.risk} risco
                                            </span>
                                        </div>

                                        <p className="text-sm text-foreground/60 mt-1">
                                            {method.description}
                                        </p>

                                        {method.value && (
                                            <p className="text-xs text-foreground/40 mt-1">
                                                {method.value}
                                            </p>
                                        )}

                                        <p className="text-xs text-foreground/30 mt-2 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {method.riskDescription}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    {isActive ? (
                                        <>
                                            <button
                                                onClick={() =>
                                                    handleConfigureMethod(
                                                        method.id,
                                                    )
                                                }
                                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-all"
                                            >
                                                Configurar
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleRemoveMethod(
                                                        method.id,
                                                    )
                                                }
                                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-error/10 text-error hover:bg-error/20 transition-all"
                                            >
                                                Remover
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                handleActivateMethod(method.id)
                                            }
                                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-white hover:bg-primary/90 transition-all"
                                        >
                                            Ativar
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mx-4">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                        <Key className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-foreground/40 uppercase tracking-wider">
                            Recovery Key
                        </h2>
                        <p className="text-xs text-foreground/40">
                            Uma chave de 32 caracteres gerada no cadastro.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={handleViewRecoveryKey}
                        className="flex-1 flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5 text-yellow-500" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-medium text-foreground">
                                    Ver recovery key
                                </p>
                                <p className="text-xs text-foreground/40">
                                    Sua chave de recuperação de emergência
                                </p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-foreground/30" />
                    </button>
                </div>
            </div>

            <div className="bg-primary/5 rounded-2xl border border-primary/10 p-6 mx-4 mb-4">
                <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-primary/60 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-sm font-semibold text-foreground">
                            Como funciona a recuperação?
                        </h3>
                        <p className="text-sm text-foreground/60 mt-1 leading-relaxed">
                            Se você esquecer sua senha mestre, os métodos ativos
                            acima permitirão verificar sua identidade e criar
                            uma nova senha.
                            <span className="text-foreground/40">
                                {' '}
                                Recomendamos ativar ao menos 2 métodos
                                independentes.
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {showRecoveryKey && (
                <>
                    <div
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowRecoveryKey(false)}
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="relative w-full max-w-md bg-background/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6 animate-in slide-in-from-bottom-4 duration-300">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center border-2 border-yellow-500/20">
                                    <Key className="w-8 h-8 text-yellow-500" />
                                </div>
                            </div>

                            <h2 className="text-xl font-bold text-foreground text-center mb-2">
                                Recovery Key
                            </h2>
                            <p className="text-foreground/60 text-sm text-center mb-4">
                                Guarde esta chave em um local seguro. Ela
                                permite recuperar sua conta em caso de perda de
                                acesso.
                            </p>

                            <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                                <p className="font-mono text-center text-lg text-foreground tracking-wider select-all">
                                    KEYVAULT-XK7M-P9R2-WQ4N
                                </p>
                            </div>

                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 mb-4">
                                <div className="flex items-start gap-2">
                                    <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                                    <p className="text-xs text-yellow-500/80">
                                        Nunca compartilhe esta chave. Ela
                                        concede acesso à sua conta.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleCopyRecoveryKey}
                                    className="flex-1 bg-primary text-white font-medium py-3 rounded-xl hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Copy className="w-4 h-4" />
                                    Copiar
                                </button>
                                <button
                                    onClick={() => setShowRecoveryKey(false)}
                                    className="flex-1 bg-white/5 text-foreground font-medium py-3 rounded-xl hover:bg-white/10 transition-all"
                                >
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {showSetupModal && (
                <>
                    <div
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowSetupModal(false)}
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="relative w-full max-w-md bg-background/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6 animate-in slide-in-from-bottom-4 duration-300">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                                    <Shield className="w-8 h-8 text-primary" />
                                </div>
                            </div>

                            <h2 className="text-xl font-bold text-foreground text-center mb-2">
                                Configurar método
                            </h2>
                            <p className="text-foreground/60 text-sm text-center mb-6">
                                Configure as informações necessárias para este
                                método de recuperação.
                            </p>

                            <div className="space-y-4">
                                <InputTextForm
                                    label="Valor"
                                    placeholder="Digite o valor..."
                                    leftIcon={<Mail className="w-5 h-5" />}
                                />
                                <InputTextForm
                                    label="Confirmar"
                                    placeholder="Digite novamente..."
                                    leftIcon={<Check className="w-5 h-5" />}
                                />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <Button
                                    onClick={() => setShowSetupModal(false)}
                                    variant="secondary"
                                    fullWidth
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={() => {
                                        setShowSetupModal(false);
                                        console.log('Método configurado');
                                    }}
                                    fullWidth
                                >
                                    Salvar
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
