'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Bell,
    AlertTriangle,
    Monitor,
    Smartphone,
    Laptop,
    Globe,
    Clock,
    Key,
    Eye,
    EyeOff,
    Check,
    ChevronRight,
    History,
    Mail,
    ShieldCheck,
    Lock,
    Unlock,
} from 'lucide-react';
import Button from '@/src/client/components/ui/buttons/Button';
import InputTextForm from '@/src/client/components/ui/inputs/InputTextForm';
import Header from '@/src/client/components/layout/header/Header';

const activeSessions = [
    {
        id: '1',
        name: 'MacBook Pro 16"',
        type: 'laptop',
        location: 'São Paulo, SP',
        time: 'Agora',
        isCurrent: true,
        ip: '177.32.x.x',
    },
    {
        id: '2',
        name: 'iPhone 15 Pro',
        type: 'phone',
        location: 'São Paulo, SP',
        time: 'Há 2 horas',
        isCurrent: false,
        ip: '189.45.x.x',
    },
];

const loginHistory = [
    {
        id: '1',
        device: 'MacBook Pro 16"',
        ip: '177.32.x.x',
        date: 'Hoje, 10:30',
        isCurrent: true,
        isSuspicious: false,
    },
    {
        id: '2',
        device: 'iPhone 15 Pro',
        ip: '189.45.x.x',
        date: 'Ontem, 22:15',
        isCurrent: false,
        isSuspicious: false,
    },
    {
        id: '3',
        device: 'Windows PC',
        ip: '201.56.x.x',
        date: '19/07, 09:00',
        isCurrent: false,
        isSuspicious: false,
    },
    {
        id: '4',
        device: 'Dispositivo desconhecido',
        ip: '45.128.x.x',
        date: '10/07, 03:42',
        isCurrent: false,
        isSuspicious: true,
    },
];

export default function SecurityPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [alertsEnabled, setAlertsEnabled] = useState({
        loginAlerts: true,
        trustedDevices: false,
    });
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showRecoveryModal, setShowRecoveryModal] = useState(false);

    const handleToggleAlert = (key: keyof typeof alertsEnabled) => {
        setAlertsEnabled((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handleChangePassword = () => {
        console.log('Alterando senha:', passwordForm);
        setIsEditingPassword(false);
        setPasswordForm({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
    };

    const handleSetupRecovery = () => {
        router.push('/dashboard/recovery');
    };

    const handleViewRecoveryKey = () => {
        setShowRecoveryModal(true);
    };

    const getDeviceIcon = (type: string) => {
        const icons: Record<string, React.ReactNode> = {
            laptop: <Laptop className="w-5 h-5" />,
            phone: <Smartphone className="w-5 h-5" />,
            desktop: <Monitor className="w-5 h-5" />,
        };
        return icons[type] || <Monitor className="w-5 h-5" />;
    };

    return (
        <div className="space-y-6">
            <Header variant="security" />

            <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mx-4">
                <div className="flex items-center gap-2 mb-4">
                    <Bell className="w-5 h-5 text-foreground/40" />
                    <h2 className="text-sm font-semibold text-foreground/40 uppercase tracking-wider">
                        Alertas e Notificações
                    </h2>
                </div>
                <p className="text-xs text-foreground/40 mb-4">
                    Receba alertas sobre atividades na sua conta.
                </p>

                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                        <div>
                            <p className="text-sm font-medium text-foreground">
                                Alertas de login
                            </p>
                            <p className="text-xs text-foreground/40">
                                Notificar ao acessar de um novo dispositivo ou
                                localização
                            </p>
                        </div>
                        <button
                            onClick={() => handleToggleAlert('loginAlerts')}
                            className={`
                                relative w-12 h-7 rounded-full transition-all duration-200
                                ${
                                    alertsEnabled.loginAlerts
                                        ? 'bg-primary'
                                        : 'bg-white/20'
                                }
                            `}
                        >
                            <div
                                className={`
                                    absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-200
                                    ${
                                        alertsEnabled.loginAlerts
                                            ? 'left-6'
                                            : 'left-1'
                                    }
                                `}
                            />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                        <div>
                            <p className="text-sm font-medium text-foreground">
                                Dispositivos confiáveis
                            </p>
                            <p className="text-xs text-foreground/40">
                                Exigir aprovação manual para novos dispositivos
                            </p>
                        </div>
                        <button
                            onClick={() => handleToggleAlert('trustedDevices')}
                            className={`
                                relative w-12 h-7 rounded-full transition-all duration-200
                                ${
                                    alertsEnabled.trustedDevices
                                        ? 'bg-primary'
                                        : 'bg-white/20'
                                }
                            `}
                        >
                            <div
                                className={`
                                    absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-200
                                    ${
                                        alertsEnabled.trustedDevices
                                            ? 'left-6'
                                            : 'left-1'
                                    }
                                `}
                            />
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mx-4">
                <div className="flex items-center gap-2 mb-4">
                    <History className="w-5 h-5 text-foreground/40" />
                    <h2 className="text-sm font-semibold text-foreground/40 uppercase tracking-wider">
                        Histórico de Logins
                    </h2>
                </div>
                <p className="text-xs text-foreground/40 mb-4">
                    Últimos acessos à sua conta.
                </p>

                <div className="space-y-2">
                    {loginHistory.map((login) => (
                        <div
                            key={login.id}
                            className={`
                                flex items-center justify-between p-3 rounded-xl
                                ${
                                    login.isSuspicious
                                        ? 'bg-error/5 border border-error/20'
                                        : 'bg-white/5 hover:bg-white/10'
                                }
                                transition-all
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-foreground/40">
                                    <Globe className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-foreground">
                                            {login.device}
                                        </p>
                                        {login.isSuspicious && (
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-error/20 text-error flex items-center gap-1">
                                                <AlertTriangle className="w-3 h-3" />
                                                Suspeito
                                            </span>
                                        )}
                                        {login.isCurrent && (
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-500/20 text-green-500">
                                                Atual
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-foreground/40">
                                        <span>IP: {login.ip}</span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {login.date}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mx-4">
                <div className="flex items-center gap-2 mb-4">
                    <Key className="w-5 h-5 text-foreground/40" />
                    <h2 className="text-sm font-semibold text-foreground/40 uppercase tracking-wider">
                        Trocar Senha Mestre
                    </h2>
                </div>
                <p className="text-xs text-foreground/40 mb-4">
                    Sua senha mestre criptografa todas as credenciais.
                </p>

                {isEditingPassword ? (
                    <form className="space-y-4">
                        <InputTextForm
                            label="Senha atual"
                            type={showPassword ? 'text' : 'password'}
                            value={passwordForm.currentPassword}
                            onChange={(e) =>
                                setPasswordForm({
                                    ...passwordForm,
                                    currentPassword: e.target.value,
                                })
                            }
                            leftIcon={<Lock className="w-5 h-5" />}
                            rightIcon={
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="text-foreground/30 hover:text-foreground/60"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            }
                        />

                        <InputTextForm
                            label="Nova senha"
                            type={showPassword ? 'text' : 'password'}
                            value={passwordForm.newPassword}
                            onChange={(e) =>
                                setPasswordForm({
                                    ...passwordForm,
                                    newPassword: e.target.value,
                                })
                            }
                            leftIcon={<Unlock className="w-5 h-5" />}
                        />

                        <InputTextForm
                            label="Confirmar nova senha"
                            type={showPassword ? 'text' : 'password'}
                            value={passwordForm.confirmPassword}
                            onChange={(e) =>
                                setPasswordForm({
                                    ...passwordForm,
                                    confirmPassword: e.target.value,
                                })
                            }
                            leftIcon={<Check className="w-5 h-5" />}
                        />

                        <div className="flex gap-3">
                            <Button onClick={handleChangePassword}>
                                Alterar senha mestre
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setIsEditingPassword(false);
                                    setPasswordForm({
                                        currentPassword: '',
                                        newPassword: '',
                                        confirmPassword: '',
                                    });
                                }}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </form>
                ) : (
                    <button
                        onClick={() => setIsEditingPassword(true)}
                        className="text-sm text-primary hover:underline font-medium flex items-center gap-1"
                    >
                        Alterar senha mestre
                        <ChevronRight className="w-4 h-4" />
                    </button>
                )}
            </div>

            <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mx-4 mb-4">
                <div className="flex items-center gap-2 mb-4">
                    <Mail className="w-5 h-5 text-foreground/40" />
                    <h2 className="text-sm font-semibold text-foreground/40 uppercase tracking-wider">
                        Recuperação de Conta
                    </h2>
                </div>
                <p className="text-xs text-foreground/40 mb-4">
                    Configure métodos para recuperar sua conta.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={handleSetupRecovery}
                        className="flex-1 flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Mail className="w-5 h-5 text-primary" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-medium text-foreground">
                                    Configurar recuperação
                                </p>
                                <p className="text-xs text-foreground/40">
                                    Adicione um e-mail ou telefone de
                                    recuperação
                                </p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-foreground/30" />
                    </button>

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

            {showRecoveryModal && (
                <>
                    <div
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowRecoveryModal(false)}
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="relative w-full max-w-md bg-background/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6 animate-in slide-in-from-bottom-4 duration-300">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center border-2 border-yellow-500/20">
                                    <ShieldCheck className="w-8 h-8 text-yellow-500" />
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
                                    KEYVAULT-
                                    {Math.random()
                                        .toString(36)
                                        .substring(2, 6)
                                        .toUpperCase()}
                                    -
                                    {Math.random()
                                        .toString(36)
                                        .substring(2, 6)
                                        .toUpperCase()}
                                    -
                                    {Math.random()
                                        .toString(36)
                                        .substring(2, 6)
                                        .toUpperCase()}
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
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            'KEYVAULT-XXXX-XXXX-XXXX',
                                        );
                                    }}
                                    className="flex-1 bg-primary text-white font-medium py-3 rounded-xl hover:shadow-xl transition-all"
                                >
                                    Copiar
                                </button>
                                <button
                                    onClick={() => setShowRecoveryModal(false)}
                                    className="flex-1 bg-white/5 text-foreground font-medium py-3 rounded-xl hover:bg-white/10 transition-all"
                                >
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
