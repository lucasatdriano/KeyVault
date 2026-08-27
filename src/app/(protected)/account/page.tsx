'use client';

import { useState, useEffect } from 'react';
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
import { toast } from 'sonner';

import { getProfileAction } from '@/src/server/actions/user/get-profile.action';
import { updateUserNameAction } from '@/src/server/actions/user/update-profile.action';

import { getInitials } from '@/src/client/utils/credentials/credential-avatar';
import { useCredentialsStore } from '@/src/client/store/credential.store';
import InputTextForm from '@/src/client/components/ui/inputs/InputTextForm';
import Header from '@/src/client/components/layout/header/Header';
import { useAuth } from '@/src/client/hooks/auth/useAuth';
import { formatDateOnly } from '@/src/client/utils/formatters/date';
import ChangeEmailModal from '@/src/client/components/layout/modals/usersModals/ChangeEmailModal';
import ChangePasswordModal from '@/src/client/components/layout/modals/usersModals/ChangePasswordModal';
import { changePasswordAction } from '@/src/server/actions/auth/change-password.action';
import { updateEmailAction } from '@/src/server/actions/user/update-email.action';
import EmailVerificationModal from '@/src/client/components/layout/modals/authModals/EmailVerificationModal';
import { resendEmailVerificationAction } from '@/src/server/actions/auth/verify-email.action';
import { useRouter } from 'next/navigation';

interface ProfileDisplay {
    name: string;
    email: string;
    memberSince: string;
    recoveryMethods: number;
    credentialsCount: number;
}

export default function AccountPage() {
    const router = useRouter();
    const { credentialsCount } = useCredentialsStore();
    const { user, updateUser } = useAuth();
    const [profile, setProfile] = useState<ProfileDisplay | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isChangeEmailModalOpen, setIsChangeEmailModalOpen] = useState(false);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
        useState(false);
    const [isEmailVerificationModalOpen, setIsEmailVerificationModalOpen] =
        useState(false);
    const [verificationEmail, setVerificationEmail] = useState('');
    const [verificationToken, setVerificationToken] = useState('');
    const [formData, setFormData] = useState({
        name: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const result = await getProfileAction();

                if (result.success && result.data) {
                    const { user: userData, recoveryMethods } = result.data;

                    const profileData: ProfileDisplay = {
                        name: userData.name,
                        email: userData.email,
                        memberSince: formatDateOnly(userData.createdAt),
                        recoveryMethods: recoveryMethods?.length || 0,
                        credentialsCount: credentialsCount,
                    };

                    setProfile(profileData);
                    setFormData({
                        name: userData.name,
                    });
                } else {
                    console.error('Erro ao carregar perfil:', result.error);
                }
            } catch (error) {
                console.error('Erro na requisição:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [credentialsCount]);

    const handleEditClick = () => {
        setIsEditing(true);
        if (profile) {
            setFormData({
                name: profile.name,
            });
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        if (profile) {
            setFormData({
                name: profile.name,
            });
        }
    };

    const handleSaveName = async () => {
        const trimmedName = formData.name.trim();

        if (!trimmedName) {
            toast.error('O nome não pode estar vazio.');
            return;
        }

        if (trimmedName.length < 2) {
            toast.error('O nome deve ter pelo menos 2 caracteres.');
            return;
        }

        setIsSaving(true);

        try {
            const result = await updateUserNameAction(trimmedName);

            if (!result.success) {
                toast.error(result.error || 'Erro ao atualizar nome.');
                return;
            }

            if (profile) {
                setProfile({
                    ...profile,
                    name: trimmedName,
                });
            }

            if (user) {
                updateUser({
                    ...user,
                    name: trimmedName,
                });
            }

            toast.success('Nome atualizado com sucesso!');
            setIsEditing(false);
        } catch (error) {
            toast.error('Erro ao atualizar nome.');
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveEmail = async (data: {
        newEmail: string;
        password: string;
    }) => {
        try {
            const result = await updateEmailAction({
                newEmail: data.newEmail,
                password: data.password,
            });

            if (!result.success || result.data === null) {
                toast.error(result.error || 'Erro ao atualizar e-mail.');
                return false;
            }

            const normalizedEmail = data.newEmail.trim().toLowerCase();

            setProfile((prev) =>
                prev
                    ? {
                          ...prev,
                          email: normalizedEmail,
                      }
                    : prev,
            );

            updateUser({
                email: normalizedEmail,
                emailVerified: false,
            });

            setVerificationEmail(normalizedEmail);
            setIsChangeEmailModalOpen(false);
            setVerificationToken(result.data.verificationToken);
            setIsEmailVerificationModalOpen(true);

            toast.success(
                'E-mail atualizado com sucesso! Verifique seu novo e-mail.',
            );

            return true;
        } catch (error) {
            console.error('Erro ao atualizar e-mail:', error);
            toast.error('Erro ao atualizar e-mail.');
            return false;
        }
    };

    const handleVerifyEmail = () => {
        if (!verificationToken) {
            toast.error('Token de verificação não encontrado.');
            return;
        }

        setIsEmailVerificationModalOpen(false);

        router.push(
            `/verify-email?token=${encodeURIComponent(verificationToken)}`,
        );
    };

    const handleResendEmail = async () => {
        const result = await resendEmailVerificationAction(verificationEmail);

        if (!result.success) {
            toast.error(result.error);
            return;
        }

        toast.success('e-mail re-enviado! Verifique seu e-mail novamente.');
    };

    const handleSavePassword = async (data: {
        currentPassword: string;
        newPassword: string;
    }) => {
        try {
            const result = await changePasswordAction({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });

            if (!result.success) {
                toast.error(result.error || 'Erro ao alterar senha.');
                return false;
            }

            toast.success(
                'Senha alterada com sucesso! Você será desconectado.',
            );

            setIsChangePasswordModalOpen(false);

            setTimeout(() => {
                window.location.href = '/login?passwordChanged=true';
            }, 1500);

            return true;
        } catch (error) {
            console.error('Erro ao alterar senha:', error);
            toast.error('Erro ao alterar senha.');
            return false;
        }
    };

    const handleOpenChangeEmail = () => {
        setIsChangeEmailModalOpen(true);
    };

    const handleOpenChangePassword = () => {
        setIsChangePasswordModalOpen(true);
    };

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
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
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
                onClose={() => setIsChangeEmailModalOpen(false)}
                currentEmail={profile.email}
                onSave={handleSaveEmail}
            />

            <ChangePasswordModal
                isOpen={isChangePasswordModalOpen}
                onClose={() => setIsChangePasswordModalOpen(false)}
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
