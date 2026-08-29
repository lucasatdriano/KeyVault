'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { resendEmailVerificationAction } from '@/src/server/actions/auth/verify-email.action';
import { updateUserNameAction } from '@/src/server/actions/user/update-profile.action';
import { changePasswordAction } from '@/src/server/actions/auth/change-password.action';
import { updateEmailAction } from '@/src/server/actions/user/update-email.action';
import { getProfileAction } from '@/src/server/actions/user/get-profile.action';

import { useCredentialsStore } from '@/src/client/store/credential.store';
import { useAuth } from '@/src/client/hooks/auth/useAuth';
import { formatDateOnly } from '@/src/client/utils/formatters/date';

interface ProfileDisplay {
    name: string;
    email: string;
    memberSince: string;
    recoveryMethods: number;
    credentialsCount: number;
}

interface ChangeEmailData {
    newEmail: string;
    password: string;
}

interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
}

export function useAccountProfile() {
    const router = useRouter();

    const { user, updateUser } = useAuth();
    const { credentialsCount } = useCredentialsStore();

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
                        credentialsCount,
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

    const handleNameChange = (name: string) => {
        setFormData({
            name,
        });
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

            setProfile((previousProfile) =>
                previousProfile
                    ? {
                          ...previousProfile,
                          name: trimmedName,
                      }
                    : previousProfile,
            );

            if (user) {
                updateUser({
                    ...user,
                    name: trimmedName,
                });
            }

            toast.success('Nome atualizado com sucesso!');

            setIsEditing(false);
        } catch (error) {
            console.error(error);

            toast.error('Erro ao atualizar nome.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveEmail = async (data: ChangeEmailData): Promise<boolean> => {
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

            setProfile((previousProfile) =>
                previousProfile
                    ? {
                          ...previousProfile,
                          email: normalizedEmail,
                      }
                    : previousProfile,
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

        toast.success('E-mail reenviado! Verifique seu e-mail novamente.');
    };

    const handleSavePassword = async (
        data: ChangePasswordData,
    ): Promise<boolean> => {
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

    const handleCloseChangeEmail = () => {
        setIsChangeEmailModalOpen(false);
    };

    const handleOpenChangePassword = () => {
        setIsChangePasswordModalOpen(true);
    };

    const handleCloseChangePassword = () => {
        setIsChangePasswordModalOpen(false);
    };

    const handleCloseEmailVerification = () => {
        setIsEmailVerificationModalOpen(false);
    };

    return {
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

        handleCloseEmailVerification,
    };
}
