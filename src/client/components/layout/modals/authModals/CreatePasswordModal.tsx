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
import InputTextForm from '@/src/client/components/ui/inputs/InputTextForm';
import Button from '@/src/client/components/ui/buttons/Button';

interface CreatePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { newPassword: string }) => Promise<boolean>;
    title?: string;
    description?: string;
}

export default function CreatePasswordModal({
    isOpen,
    onClose,
    onSave,
    title = 'Criar Nova Senha',
    description = 'Crie uma nova senha para sua conta.',
}: CreatePasswordModalProps) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<{
        newPassword: string;
        confirmPassword: string;
    }>({
        newPassword: '',
        confirmPassword: '',
    });

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const resetForm = () => {
        setNewPassword('');
        setConfirmPassword('');
        setErrors({
            newPassword: '',
            confirmPassword: '',
        });
        setShowNewPassword(false);
        setShowConfirmPassword(false);
    };

    const handleClose = () => {
        if (isLoading) return;

        resetForm();
        onClose();
    };

    const validatePassword = () => {
        const newErrors = {
            newPassword: '',
            confirmPassword: '',
        };

        if (!newPassword || newPassword.length < 8) {
            newErrors.newPassword = 'A senha deve ter no mínimo 8 caracteres.';
        }

        if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'As senhas não coincidem.';
        }

        setErrors(newErrors);

        return !newErrors.newPassword && !newErrors.confirmPassword;
    };

    const handleSubmit = async () => {
        if (!validatePassword()) {
            return;
        }

        setIsLoading(true);

        try {
            const success = await onSave({
                newPassword: newPassword.trim(),
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
            title={title}
            icon={<KeyIcon className="h-5 w-5 text-primary" />}
            maxWidth="sm"
        >
            <div className="space-y-5">
                <div>
                    <p className="text-sm text-foreground/60">{description}</p>

                    <p className="mt-1 text-sm text-foreground/40">
                        A senha deve ter no mínimo 8 caracteres.
                    </p>
                </div>

                <div className="space-y-4">
                    <InputTextForm
                        label="Nova Senha"
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="Digite sua nova senha"
                        value={newPassword}
                        onChange={(e) => {
                            setNewPassword(e.target.value);
                            if (errors.newPassword) {
                                setErrors({
                                    ...errors,
                                    newPassword: '',
                                });
                            }
                        }}
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
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (errors.confirmPassword) {
                                setErrors({
                                    ...errors,
                                    confirmPassword: '',
                                });
                            }
                        }}
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
                    loadingText="Criando..."
                    leftIcon={
                        !isLoading ? (
                            <CheckIcon className="h-5 w-5" />
                        ) : undefined
                    }
                >
                    Criar Senha
                </Button>
            </div>
        </ModalBase>
    );
}
