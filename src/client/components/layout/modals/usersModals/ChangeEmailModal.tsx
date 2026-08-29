'use client';

import { useState } from 'react';
import { MailIcon, KeyIcon, CheckIcon } from 'lucide-react';

import { ChangeEmailFormData } from '@/src/shared/types/profile';

import { hasValidationErrors, ValidationErrors } from '@/src/client/validators';
import { validateChangeEmail } from '@/src/client/validators/user.validator';

import Button from '@/src/client/components/ui/buttons/Button';
import InputTextForm from '@/src/client/components/ui/inputs/InputTextForm';
import ModalBase from '@/src/client/components/layout/modals/ModalBase';

interface ChangeEmailModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentEmail: string;
    onSave: (data: ChangeEmailFormData) => Promise<boolean>;
}

export default function ChangeEmailModal({
    isOpen,
    onClose,
    currentEmail,
    onSave,
}: ChangeEmailModalProps) {
    const [formData, setFormData] = useState<ChangeEmailFormData>({
        newEmail: '',
        password: '',
    });

    const [errors, setErrors] = useState<ValidationErrors<ChangeEmailFormData>>(
        {
            newEmail: '',
            password: '',
        },
    );

    const [isLoading, setIsLoading] = useState(false);

    const resetForm = () => {
        setFormData({
            newEmail: '',
            password: '',
        });

        setErrors({
            newEmail: '',
            password: '',
        });
    };

    const handleClose = () => {
        if (isLoading) return;

        resetForm();
        onClose();
    };

    const handleSubmit = async () => {
        const validationErrors = validateChangeEmail({
            ...formData,
            currentEmail,
        });

        setErrors({
            newEmail: validationErrors.newEmail ?? '',
            password: validationErrors.password ?? '',
        });

        if (hasValidationErrors(validationErrors)) {
            return;
        }

        setIsLoading(true);

        try {
            const success = await onSave({
                newEmail: formData.newEmail.trim().toLowerCase(),
                password: formData.password.trim(),
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
            title="Alterar E-mail"
            icon={<MailIcon className="h-5 w-5 text-blue-500" />}
            maxWidth="sm"
        >
            <div className="space-y-5">
                <div>
                    <p className="text-sm text-foreground/60">
                        Você está alterando o e-mail da sua conta.
                    </p>

                    <p className="mt-1 text-sm text-foreground/40">
                        Após confirmar, você será desconectado e precisará
                        verificar seu novo e-mail.
                    </p>
                </div>

                <div className="space-y-4">
                    <InputTextForm
                        label="Novo E-mail"
                        type="email"
                        placeholder="novo@email.com"
                        value={formData.newEmail}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                newEmail: e.target.value,
                            })
                        }
                        leftIcon={<MailIcon className="h-5 w-5" />}
                        error={errors.newEmail}
                        disabled={isLoading}
                        autoFocus
                    />

                    <InputTextForm
                        label="Senha Atual"
                        type="password"
                        placeholder="Digite sua senha atual"
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                password: e.target.value,
                            })
                        }
                        leftIcon={<KeyIcon className="h-5 w-5" />}
                        error={errors.password}
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
                    loadingText="Atualizando..."
                    leftIcon={
                        !isLoading ? (
                            <CheckIcon className="h-5 w-5" />
                        ) : undefined
                    }
                >
                    Atualizar E-mail
                </Button>
            </div>
        </ModalBase>
    );
}
