'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    User,
    Mail,
    Calendar,
    Award,
    Clock,
    Key,
    Database,
    AlertTriangle,
    ChevronRight,
    Download,
    Trash2,
} from 'lucide-react';
import Button from '@/src/components/ui/buttons/Button';
import InputTextForm from '@/src/components/ui/inputs/InputTextForm';
import Header from '@/src/components/layout/header/Header';

const userData = {
    name: 'Alex Ferreira',
    email: 'alex.ferreira@gmail.com',
    initials: 'AF',
    memberSince: '15 de janeiro de 2024',
    plan: 'Free',
    lastAccess: 'Hoje, 10:30',
    credentialsCount: 8,
};

export default function AccountPage() {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formData, setFormData] = useState({
        name: userData.name,
        email: userData.email,
    });

    const handleSave = () => {
        console.log('Salvando:', formData);
        setIsEditing(false);
    };

    const handleChangePassword = () => {
        router.push('/dashboard/security');
    };

    const handleExportData = () => {
        console.log('Exportando dados...');
    };

    const handleDeleteAccount = () => {
        console.log('Excluindo conta...');
        setShowDeleteModal(false);
    };

    return (
        <div className="space-y-6">
            <Header variant="account" />

            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary/20">
                    {userData.initials}
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        Minha Conta
                    </h1>
                    <p className="text-sm text-foreground/60">
                        Gerencie suas informações pessoais
                    </p>
                </div>
            </div>

            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h2 className="text-sm font-semibold text-foreground/40 uppercase tracking-wider mb-4">
                    Informações da Conta
                </h2>

                {isEditing ? (
                    <div className="space-y-4">
                        <InputTextForm
                            label="Nome"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            leftIcon={<User className="w-5 h-5" />}
                        />
                        <InputTextForm
                            label="E-mail"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                })
                            }
                            leftIcon={<Mail className="w-5 h-5" />}
                        />
                        <div className="flex gap-3">
                            <Button onClick={handleSave}>
                                Salvar alterações
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setIsEditing(false);
                                    setFormData({
                                        name: userData.name,
                                        email: userData.email,
                                    });
                                }}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                            <User className="w-5 h-5 text-foreground/30 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs text-foreground/40 uppercase tracking-wider font-medium">
                                    Nome
                                </p>
                                <p className="text-foreground font-medium">
                                    {userData.name}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                            <Mail className="w-5 h-5 text-foreground/30 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs text-foreground/40 uppercase tracking-wider font-medium">
                                    E-mail
                                </p>
                                <p className="text-foreground font-medium">
                                    {userData.email}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                            <Calendar className="w-5 h-5 text-foreground/30 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs text-foreground/40 uppercase tracking-wider font-medium">
                                    Membro desde
                                </p>
                                <p className="text-foreground font-medium">
                                    {userData.memberSince}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                            <Award className="w-5 h-5 text-foreground/30 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs text-foreground/40 uppercase tracking-wider font-medium">
                                    Plano
                                </p>
                                <p className="text-foreground font-medium">
                                    {userData.plan}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                            <Clock className="w-5 h-5 text-foreground/30 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs text-foreground/40 uppercase tracking-wider font-medium">
                                    Último acesso
                                </p>
                                <p className="text-foreground font-medium">
                                    {userData.lastAccess}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                            <Database className="w-5 h-5 text-foreground/30 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs text-foreground/40 uppercase tracking-wider font-medium">
                                    Credenciais salvas
                                </p>
                                <p className="text-foreground font-medium">
                                    {userData.credentialsCount} senhas
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h2 className="text-sm font-semibold text-foreground/40 uppercase tracking-wider mb-4">
                    Gerenciar Conta
                </h2>

                <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer group">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Key className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">
                                    Alterar senha
                                </p>
                                <p className="text-xs text-foreground/40">
                                    Modifique sua senha de acesso ao KeyVault
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleChangePassword}
                            className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
                        >
                            Alterar
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer group">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <Mail className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">
                                    Alterar e-mail
                                </p>
                                <p className="text-xs text-foreground/40">
                                    Atualize o e-mail associado à sua conta
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
                        >
                            Alterar
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer group">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                                <Download className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">
                                    Exportar dados
                                </p>
                                <p className="text-xs text-foreground/40">
                                    Baixe todas as suas credenciais em formato
                                    criptografado
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleExportData}
                            className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
                        >
                            Exportar
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <h2 className="text-sm font-semibold text-red-500 uppercase tracking-wider">
                        Zona de Perigo
                    </h2>
                </div>
                <p className="text-xs text-foreground/40 mb-4">
                    Ações irreversíveis. Proceda com cuidado.
                </p>

                <div className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                            <Trash2 className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-red-500">
                                Excluir conta
                            </p>
                            <p className="text-xs text-foreground/40">
                                Todos os seus dados serão permanentemente
                                deletados.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="text-sm text-red-500 font-medium hover:underline flex items-center gap-1"
                    >
                        Excluir
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {showDeleteModal && (
                <>
                    <div
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowDeleteModal(false)}
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="relative w-full max-w-md bg-background/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6 animate-in slide-in-from-bottom-4 duration-300">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border-2 border-red-500/20">
                                    <AlertTriangle className="w-8 h-8 text-red-500" />
                                </div>
                            </div>

                            <h2 className="text-xl font-bold text-foreground text-center mb-2">
                                Excluir conta?
                            </h2>
                            <p className="text-foreground/60 text-sm text-center mb-6">
                                Esta ação é{' '}
                                <span className="text-red-500 font-medium">
                                    irreversível
                                </span>
                                . Todos os seus dados serão permanentemente
                                deletados.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    onClick={() => setShowDeleteModal(false)}
                                    variant="secondary"
                                    fullWidth
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={handleDeleteAccount}
                                    variant="error"
                                    fullWidth
                                    leftIcon={<Trash2 className="w-5 h-5" />}
                                >
                                    Excluir conta
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
