'use client';

import { useState } from 'react';
import {
    KeyIcon,
    LockIcon,
    CheckIcon,
    EyeIcon,
    EyeOffIcon,
} from 'lucide-react';

import ModalBase from '../ModalBase';
import InputTextForm from '../../../ui/inputs/InputTextForm';
import Button from '../../../ui/buttons/Button';

import { ChangePasswordFormData } from '@/src/shared/types/auth';
import { hasValidationErrors, ValidationErrors } from '@/src/client/validators';
import { validateChangePassword } from '@/src/client/validators/user.validator';

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: {
        currentPassword: string;
        newPassword: string;
    }) => Promise<boolean>;
}

export default function ChangePasswordModal({
    isOpen,
    onClose,
    onSave,
}: ChangePasswordModalProps) {
    const [formData, setFormData] = useState<ChangePasswordFormData>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState<
        ValidationErrors<ChangePasswordFormData>
    >({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const resetForm = () => {
        setFormData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });

        setErrors({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });

        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
    };

    const handleClose = () => {
        if (isLoading) return;

        resetForm();
        onClose();
    };

    const handleSubmit = async () => {
        const validationErrors = validateChangePassword(formData);

        setErrors({
            currentPassword: validationErrors.currentPassword ?? '',
            newPassword: validationErrors.newPassword ?? '',
            confirmPassword: validationErrors.confirmPassword ?? '',
        });

        if (hasValidationErrors(validationErrors)) {
            return;
        }

        setIsLoading(true);

        try {
            const success = await onSave({
                currentPassword: formData.currentPassword.trim(),
                newPassword: formData.newPassword.trim(),
            });

            if (success) {
                handleClose();
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ModalBase
            isOpen={isOpen}
            onClose={handleClose}
            title="Alterar Senha"
            icon={<KeyIcon className="h-5 w-5 text-primary" />}
            maxWidth="sm"
        >
            <div className="space-y-5">
                <div>
                    <p className="text-sm text-foreground/60">
                        Altere sua senha de acesso ao KeyVault.
                    </p>

                    <p className="mt-1 text-sm text-foreground/40">
                        Após confirmar, você será desconectado e precisará fazer
                        login novamente.
                    </p>
                </div>

                <div className="space-y-4">
                    <InputTextForm
                        label="Senha Atual"
                        type={showCurrentPassword ? 'text' : 'password'}
                        placeholder="Digite sua senha atual"
                        value={formData.currentPassword}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                currentPassword: e.target.value,
                            })
                        }
                        leftIcon={<LockIcon className="h-5 w-5" />}
                        rightIcon={
                            <button
                                type="button"
                                onClick={() =>
                                    setShowCurrentPassword(
                                        (previous) => !previous,
                                    )
                                }
                                className="text-foreground/40 hover:text-foreground/60"
                                disabled={isLoading}
                            >
                                {showCurrentPassword ? (
                                    <EyeOffIcon className="h-5 w-5" />
                                ) : (
                                    <EyeIcon className="h-5 w-5" />
                                )}
                            </button>
                        }
                        error={errors.currentPassword}
                        disabled={isLoading}
                    />

                    <InputTextForm
                        label="Nova Senha"
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="Digite sua nova senha"
                        value={formData.newPassword}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                newPassword: e.target.value,
                            })
                        }
                        leftIcon={<LockIcon className="h-5 w-5" />}
                        rightIcon={
                            <button
                                type="button"
                                onClick={() =>
                                    setShowNewPassword((previous) => !previous)
                                }
                                className="text-foreground/40 hover:text-foreground/60"
                                disabled={isLoading}
                            >
                                {showNewPassword ? (
                                    <EyeOffIcon className="h-5 w-5" />
                                ) : (
                                    <EyeIcon className="h-5 w-5" />
                                )}
                            </button>
                        }
                        error={errors.newPassword}
                        disabled={isLoading}
                    />

                    <InputTextForm
                        label="Confirmar Nova Senha"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirme sua nova senha"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                confirmPassword: e.target.value,
                            })
                        }
                        leftIcon={<LockIcon className="h-5 w-5" />}
                        rightIcon={
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        (previous) => !previous,
                                    )
                                }
                                className="text-foreground/40 hover:text-foreground/60"
                                disabled={isLoading}
                            >
                                {showConfirmPassword ? (
                                    <EyeOffIcon className="h-5 w-5" />
                                ) : (
                                    <EyeIcon className="h-5 w-5" />
                                )}
                            </button>
                        }
                        error={errors.confirmPassword}
                        disabled={isLoading}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !isLoading) {
                                handleSubmit();
                            }
                        }}
                    />
                </div>

                <Button
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    isLoading={isLoading}
                    loadingText="Alterando..."
                    leftIcon={
                        !isLoading ? (
                            <CheckIcon className="h-5 w-5" />
                        ) : undefined
                    }
                >
                    Alterar Senha
                </Button>
            </div>
        </ModalBase>
    );
}
