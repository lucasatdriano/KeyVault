/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { updateUserNameAction } from '@/src/server/actions/user/update-profile.action';
import { updateEmailAction } from '@/src/server/actions/user/update-email.action';
import { changePasswordAction } from '@/src/server/actions/auth/change-password.action';
import { updateSessionExpirationAction } from '@/src/server/actions/auth/update-session-expiration.action';
import { resendEmailVerificationAction } from '@/src/server/actions/auth/verify-email.action';

import { ChangeEmailData, ChangePasswordData } from '@/src/shared/types/auth';

import { useAuthActions } from '@/src/client/hooks/auth/useAuthActions';
import { useAuth } from '@/src/client/hooks/auth/useAuth';

export function useProfileActions() {
    const { handleVerificationModalConfirm } = useAuthActions();
    const { user, updateUser } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
    });

    const handleEditClick = () => {
        setIsEditing(true);
        setFormData({ name: user?.name || '' });
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setFormData({ name: user?.name || '' });
    };

    const handleNameChange = (name: string) => {
        setFormData({ name });
    };

    const handleSaveName = async (onSuccess?: () => void) => {
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

            if (user) {
                updateUser({ ...user, name: trimmedName });
            }

            toast.success('Nome atualizado com sucesso!');
            setIsEditing(false);
            onSuccess?.();
        } catch {
            toast.error('Erro ao atualizar nome.');
        } finally {
            setIsSaving(false);
        }
    };

    const [isChangeEmailModalOpen, setIsChangeEmailModalOpen] = useState(false);
    const [isEmailVerificationModalOpen, setIsEmailVerificationModalOpen] =
        useState(false);
    const [verificationEmail, setVerificationEmail] = useState('');
    const [verificationToken, setVerificationToken] = useState('');

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

            if (user) {
                updateUser({
                    ...user,
                    email: normalizedEmail,
                    emailVerified: false,
                });
            }

            setVerificationEmail(normalizedEmail);
            setVerificationToken(result.data.verificationToken);

            setIsChangeEmailModalOpen(false);
            setIsEmailVerificationModalOpen(true);

            toast.success(
                'E-mail atualizado com sucesso! Verifique seu novo e-mail.',
            );

            return true;
        } catch {
            toast.error('Erro ao atualizar e-mail.');
            return false;
        }
    };

    const handleVerifyEmail = () => {
        handleVerificationModalConfirm(() => {
            setIsEmailVerificationModalOpen(false);
        });
    };

    const handleResendEmail = async () => {
        const result = await resendEmailVerificationAction(verificationEmail);

        if (!result.success) {
            toast.error(result.error);
            return;
        }

        toast.success('E-mail reenviado! Verifique seu e-mail novamente.');
    };

    const handleOpenChangeEmail = () => setIsChangeEmailModalOpen(true);
    const handleCloseChangeEmail = () => setIsChangeEmailModalOpen(false);
    const handleCloseEmailVerification = () =>
        setIsEmailVerificationModalOpen(false);

    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
        useState(false);

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
        } catch {
            toast.error('Erro ao alterar senha.');
            return false;
        }
    };

    const handleOpenChangePassword = () => setIsChangePasswordModalOpen(true);
    const handleCloseChangePassword = () => setIsChangePasswordModalOpen(false);

    const [sessionExpiration, setSessionExpiration] = useState<number>(
        user?.sessionExpiration ?? 1800,
    );
    const [isUpdatingSessionExpiration, setIsUpdatingSessionExpiration] =
        useState(false);

    useEffect(() => {
        if (user) {
            setSessionExpiration(user.sessionExpiration);
        }
    }, [user]);

    const handleSaveSessionExpiration = async (
        value: number,
    ): Promise<boolean> => {
        if (isUpdatingSessionExpiration) {
            return false;
        }

        setIsUpdatingSessionExpiration(true);

        try {
            const result = await updateSessionExpirationAction(value);

            if (!result.success) {
                toast.error(
                    result.error || 'Erro ao atualizar tempo de sessão.',
                );
                return false;
            }

            setSessionExpiration(value);

            if (user) {
                updateUser({ ...user, sessionExpiration: value });
            }

            toast.success('Tempo de sessão atualizado com sucesso.');
            return true;
        } catch {
            toast.error('Erro ao atualizar tempo de sessão.');
            return false;
        } finally {
            setIsUpdatingSessionExpiration(false);
        }
    };

    return {
        isEditing,
        isSaving,
        formData,
        handleEditClick,
        handleCancelEdit,
        handleNameChange,
        handleSaveName,

        isChangeEmailModalOpen,
        isEmailVerificationModalOpen,
        verificationEmail,
        verificationToken,
        handleSaveEmail,
        handleVerifyEmail,
        handleResendEmail,
        handleOpenChangeEmail,
        handleCloseChangeEmail,
        handleCloseEmailVerification,

        isChangePasswordModalOpen,
        handleSavePassword,
        handleOpenChangePassword,
        handleCloseChangePassword,

        sessionExpiration,
        isUpdatingSessionExpiration,
        handleSaveSessionExpiration,
    };
}
