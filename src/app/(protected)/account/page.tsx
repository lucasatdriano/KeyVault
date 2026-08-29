'use client';

import {
    UserIcon,
    MailIcon,
    CalendarIcon,
    KeyIcon,
    DatabaseIcon,
    ChevronRightIcon,
    BadgeCheckIcon,
    CircleCheckIcon,
    PencilIcon,
    XIcon,
    CheckIcon,
} from 'lucide-react';

import { useAccountProfile } from '@/src/client/hooks/user/useAccountProfile';
import { getInitials } from '@/src/client/utils/credentials/credential-avatar';

import InputTextForm from '@/src/client/components/ui/inputs/InputTextForm';
import Header from '@/src/client/components/layout/header/Header';
import ChangeEmailModal from '@/src/client/components/layout/modals/usersModals/ChangeEmailModal';
import ChangePasswordModal from '@/src/client/components/layout/modals/usersModals/ChangePasswordModal';
import EmailVerificationModal from '@/src/client/components/layout/modals/authModals/EmailVerificationModal';

export default function AccountPage() {
    const {
        profile,
        isLoading,

        isEditing,
        isSaving,
        formData,

        isChangeEmailModalOpen,
        isChangePasswordModalOpen,
        isEmailVerificationModalOpen,

        verificationEmail,

        handleEditClick,
        handleCancelEdit,
        handleNameChange,
        handleSaveName,

        handleSaveEmail,
        handleVerifyEmail,
        handleResendEmail,
        handleSavePassword,

        handleOpenChangeEmail,
        handleCloseChangeEmail,

        handleOpenChangePassword,
        handleCloseChangePassword,
    } = useAccountProfile();

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Header variant="account" />

                <div className="flex justify-center items-center h-64">
                    <div className="text-foreground/60">
                        Carregando perfil...
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="space-y-6">
                <Header variant="account" />

                <div className="flex justify-center items-center h-64">
                    <div className="text-error">Erro ao carregar perfil</div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                <Header variant="account" />

                <div className="flex items-center gap-4 px-6">
                    <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary/20">
                        {getInitials(profile.name)}
                    </div>

                    <div className="flex-1">
                        {isEditing ? (
                            <div className="flex items-center gap-3">
                                <InputTextForm
                                    label=""
                                    value={formData.name}
                                    onChange={(event) =>
                                        handleNameChange(event.target.value)
                                    }
                                    className="text-2xl font-bold text-foreground indent-5 bg-transparent border-b-2 border-primary focus:outline-none"
                                    placeholder="Digite seu nome"
                                    disabled={isSaving}
                                />

                                <button
                                    onClick={handleSaveName}
                                    disabled={isSaving}
                                    className="cursor-pointer p-2 rounded-lg bg-green-500/20 text-green-500 hover:bg-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Salvar"
                                >
                                    {isSaving ? (
                                        <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <CheckIcon className="w-5 h-5" />
                                    )}
                                </button>

                                <button
                                    onClick={handleCancelEdit}
                                    disabled={isSaving}
                                    className="cursor-pointer p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Cancelar"
                                >
                                    <XIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <p className="text-2xl font-bold text-foreground">
                                    {profile.name}
                                </p>

                                <button
                                    onClick={handleEditClick}
                                    className="cursor-pointer p-1.5 rounded-lg bg-white/5 text-foreground/40 hover:bg-white/10 hover:text-foreground/70 transition-all"
                                    title="Editar nome"
                                >
                                    <PencilIcon className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        <p className="text-sm text-foreground/60">
                            {profile.email}
                        </p>
                    </div>
                </div>

                <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mx-4">
                    <h2 className="text-sm font-semibold text-foreground/40 uppercase tracking-wider mb-4">
                        Informações da Conta
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                            <UserIcon className="w-5 h-5 text-foreground/30 shrink-0 mt-0.5" />

                            <div>
                                <p className="text-xs text-foreground/40 uppercase tracking-wider font-medium">
                                    Nome
                                </p>

                                <p className="text-foreground font-medium">
                                    {profile.name}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                            <MailIcon className="w-5 h-5 text-foreground/30 shrink-0 mt-0.5" />

                            <div>
                                <p className="text-xs text-foreground/40 uppercase tracking-wider font-medium">
                                    E-mail
                                </p>

                                <p className="text-foreground font-medium">
                                    {profile.email}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                            <CalendarIcon className="w-5 h-5 text-foreground/30 shrink-0 mt-0.5" />

                            <div>
                                <p className="text-xs text-foreground/40 uppercase tracking-wider font-medium">
                                    Membro desde
                                </p>

                                <p className="text-foreground font-medium">
                                    {profile.memberSince}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                            <DatabaseIcon className="w-5 h-5 text-foreground/30 shrink-0 mt-0.5" />

                            <div>
                                <p className="text-xs text-foreground/40 uppercase tracking-wider font-medium">
                                    Credenciais
                                </p>

                                <p className="text-foreground font-medium">
                                    {profile.credentialsCount === 0
                                        ? 'Nenhuma senha'
                                        : `${profile.credentialsCount} ${
                                              profile.credentialsCount > 1
                                                  ? 'Senhas'
                                                  : 'Senha'
                                          }`}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                            <BadgeCheckIcon className="w-5 h-5 text-foreground/30 shrink-0 mt-0.5" />

                            <div>
                                <p className="text-xs text-foreground/40 uppercase tracking-wider font-medium">
                                    Recuperação
                                </p>

                                <p className="text-foreground font-medium">
                                    {profile.recoveryMethods === 0
                                        ? 'Nenhum método'
                                        : `${profile.recoveryMethods} ${
                                              profile.recoveryMethods > 1
                                                  ? 'Métodos'
                                                  : 'Método'
                                          }`}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                            <CircleCheckIcon className="w-5 h-5 text-foreground/30 shrink-0 mt-0.5" />

                            <div>
                                <p className="text-xs text-foreground/40 uppercase tracking-wider font-medium">
                                    Status
                                </p>

                                <p className="text-foreground font-medium">
                                    Conta ativa
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mx-4">
                    <h2 className="text-sm font-semibold text-foreground/40 uppercase tracking-wider mb-4">
                        Gerenciar Conta
                    </h2>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <KeyIcon className="w-5 h-5 text-primary" />
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-foreground">
                                        Alterar senha
                                    </p>

                                    <p className="text-xs text-foreground/40">
                                        Modifique sua senha de acesso ao
                                        KeyVault
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleOpenChangePassword}
                                className="cursor-pointer text-sm text-primary font-medium hover:underline flex items-center gap-1"
                            >
                                Alterar
                                <ChevronRightIcon className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                    <MailIcon className="w-5 h-5 text-blue-500" />
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
                                onClick={handleOpenChangeEmail}
                                className="cursor-pointer text-sm text-primary font-medium hover:underline flex items-center gap-1"
                            >
                                Alterar
                                <ChevronRightIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ChangeEmailModal
                isOpen={isChangeEmailModalOpen}
                onClose={handleCloseChangeEmail}
                currentEmail={profile.email}
                onSave={handleSaveEmail}
            />

            <ChangePasswordModal
                isOpen={isChangePasswordModalOpen}
                onClose={handleCloseChangePassword}
                onSave={handleSavePassword}
            />

            <EmailVerificationModal
                isOpen={isEmailVerificationModalOpen}
                email={verificationEmail}
                onVerify={handleVerifyEmail}
                onResendEmail={handleResendEmail}
            />
        </>
    );
}
