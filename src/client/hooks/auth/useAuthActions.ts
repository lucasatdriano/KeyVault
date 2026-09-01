'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { registerAction } from '@/src/server/actions/auth/register.action';
import { loginAction } from '@/src/server/actions/auth/login.action';
import { logoutAction } from '@/src/server/actions/auth/logout.action';
import { resendEmailVerificationAction } from '@/src/server/actions/auth/verify-email.action';
import { verifyEmailAction } from '@/src/server/actions/auth/verify-email.action';
import { resetPasswordAction } from '@/src/server/actions/recovery/flow/reset-password.action';
import { startRecoveryAction } from '@/src/server/actions/recovery/flow/start-recovery.action';

import { createVaultKey, encryptVaultKey } from '@/src/shared/crypto/vault';
import { decryptVaultKey } from '@/src/shared/crypto/vault';
import { encryptString } from '@/src/shared/crypto/cipher';
import { RegisterFormData, LoginFormData } from '@/src/shared/types/auth';

import { DEFAULT_CATEGORIES } from '@/src/client/constants/categories';
import { useVaultStore } from '@/src/client/store/vault.store';
import { useAuthStore } from '@/src/client/store/auth.store';
import { clearAllStores } from '@/src/client/store/clear.store';
import {
    ResetPasswordFormData,
    ForgotPasswordFormData,
} from '@/src/client/types/recovery';

export function useAuthActions() {
    const router = useRouter();

    const setVaultKey = useVaultStore((state) => state.setVaultKey);
    const setIsLoggingOut = useAuthStore((state) => state.setIsLoggingOut);
    const isLoggingOut = useAuthStore((state) => state.isLoggingOut);

    const [isRegistering, setIsRegistering] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [isStartingRecovery, setIsStartingRecovery] = useState(false);
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [verificationToken, setVerificationToken] = useState('');

    const handleRegister = async (formData: RegisterFormData) => {
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

        setIsRegistering(true);

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
                return false;
            }

            const normalizedEmail = formData.email.trim().toLowerCase();

            setUserEmail(normalizedEmail);
            setVerificationToken(result.data.verificationToken);
            setShowVerificationModal(true);

            toast.success('Cadastro realizado! Verifique seu e-mail.');
            return true;
        } catch (error) {
            console.error('Erro ao realizar cadastro:', error);
            toast.error('Erro interno ao realizar cadastro.');
            return false;
        } finally {
            setIsRegistering(false);
        }
    };

    const handleLogin = async (formData: LoginFormData) => {
        setIsLoggingIn(true);

        try {
            const result = await loginAction({
                email: formData.email,
                password: formData.password,
            });

            if (!result.success || !result.data) {
                toast.error(result.error);
                return false;
            }

            const vaultKey = await decryptVaultKey(
                result.data.encryptedVaultKey,
                formData.password,
            );

            setVaultKey(vaultKey);

            toast.success(result.message || 'Login realizado com sucesso!');
            router.push('/dashboard');
            return true;
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            toast.error('Erro interno ao fazer login.');
            return false;
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleLogout = async (redirectTo = '/login') => {
        if (isLoggingOut) {
            return;
        }

        setIsLoggingOut(true);

        try {
            const result = await logoutAction();

            if (!result.success) {
                console.error(result.error);
                setIsLoggingOut(false);
                return;
            }

            clearAllStores({
                preserveLogoutState: true,
            });

            router.replace(redirectTo);
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            setIsLoggingOut(false);
        }
    };

    const handleStartRecovery = async (formData: ForgotPasswordFormData) => {
        setIsStartingRecovery(true);

        try {
            const result = await startRecoveryAction(formData.email);

            if (!result.success || !result.data) {
                toast.error(
                    result.error ?? 'Não foi possível iniciar a recuperação.',
                );
                return null;
            }

            toast.success('Recuperação iniciada.');

            return result.data.token;
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Erro ao iniciar recuperação.';
            toast.error(message);
            return null;
        } finally {
            setIsStartingRecovery(false);
        }
    };

    const handleVerifyEmail = async (token: string) => {
        if (!token) {
            toast.error('Token de verificação inválido.');
            return false;
        }

        setIsVerifyingEmail(true);

        try {
            const result = await verifyEmailAction(token);

            if (!result.success) {
                toast.error(result.error);
                return false;
            }

            toast.success('E-mail verificado com sucesso!');
            router.push('/login');
            return true;
        } catch (error) {
            console.error('Erro ao verificar e-mail:', error);
            toast.error('Erro interno ao verificar e-mail.');
            return false;
        } finally {
            setIsVerifyingEmail(false);
        }
    };

    const handleResendEmail = async () => {
        const result = await resendEmailVerificationAction(userEmail);

        if (!result.success) {
            toast.error(result.error);
            return;
        }

        toast.success('E-mail reenviado! Verifique seu e-mail novamente.');
    };

    const handleResetPassword = async (
        token: string,
        formData: ResetPasswordFormData,
    ) => {
        if (!token) {
            toast.error('Token de recuperação não encontrado.');
            router.replace('/forgot-password');
            return false;
        }

        setIsResettingPassword(true);

        try {
            const result = await resetPasswordAction(
                token,
                formData.newPassword,
            );

            if (!result.success) {
                toast.error(
                    result.error ?? 'Não foi possível redefinir a senha.',
                );
                return false;
            }

            toast.success('Senha redefinida com sucesso.');
            router.replace('/login');
            return true;
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Erro ao redefinir senha. Tente novamente.';
            toast.error(message);
            return false;
        } finally {
            setIsResettingPassword(false);
        }
    };

    const handleVerificationModalConfirm = (onClose?: () => void) => {
        if (!verificationToken) {
            toast.error('Token de verificação não encontrado.');
            return;
        }

        onClose?.();

        router.push(
            `/verify-email?token=${encodeURIComponent(verificationToken)}`,
        );
    };

    const closeVerificationModal = () => {
        setShowVerificationModal(false);
    };

    return {
        isRegistering,
        isLoggingIn,
        isLoggingOut,
        isVerifyingEmail,
        isResettingPassword,
        isStartingRecovery,
        showVerificationModal,
        userEmail,
        verificationToken,

        handleRegister,
        handleLogin,
        handleLogout,
        handleStartRecovery,
        handleVerifyEmail,
        handleResendEmail,
        handleResetPassword,
        handleVerificationModalConfirm,
        closeVerificationModal,
    };
}
