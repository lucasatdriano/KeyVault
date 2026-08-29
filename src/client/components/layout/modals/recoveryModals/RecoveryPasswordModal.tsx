/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import { CheckIcon, LockKeyholeIcon, ShieldCheckIcon } from 'lucide-react';

import { hasValidationErrors } from '@/src/client/validators';
import { validateRecoveryPassword } from '@/src/client/validators/recovery.validator';
import { RecoveryPasswordFormData } from '@/src/client/types/recovery';

import Button from '@/src/client/components/ui/buttons/Button';
import InputTextForm from '@/src/client/components/ui/inputs/InputTextForm';
import RequirementIndicator from '@/src/client/components/ui/indicators/RequirementIndicator';
import ModalBase from '@/src/client/components/layout/modals/ModalBase';

interface RecoveryPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (recoveryPassword: string) => Promise<void> | void;
    isLoading?: boolean;
}

export default function RecoveryPasswordModal({
    isOpen,
    onClose,
    onSave,
    isLoading = false,
}: RecoveryPasswordModalProps) {
    const [formData, setFormData] = useState<RecoveryPasswordFormData>({
        recoveryPassword: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({
        recoveryPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setFormData({
            recoveryPassword: '',
            confirmPassword: '',
        });

        setErrors({
            recoveryPassword: '',
            confirmPassword: '',
        });
    }, [isOpen]);

    const hasMinLength = formData.recoveryPassword.length >= 10;
    const hasUppercase = /[A-Z]/.test(formData.recoveryPassword);
    const hasNumber = /\d/.test(formData.recoveryPassword);
    const hasSpecialCharacter = /[^A-Za-z0-9\s]/.test(
        formData.recoveryPassword,
    );

    const isPasswordValid =
        hasMinLength && hasUppercase && hasNumber && hasSpecialCharacter;

    const passwordsMatch =
        formData.confirmPassword.length > 0 &&
        formData.recoveryPassword === formData.confirmPassword;

    const handleSave = async () => {
        const validationErrors = validateRecoveryPassword({
            recoveryPassword: formData.recoveryPassword,
            confirmPassword: formData.confirmPassword,
        });

        setErrors({
            recoveryPassword: validationErrors.recoveryPassword ?? '',
            confirmPassword: validationErrors.confirmPassword ?? '',
        });

        if (hasValidationErrors(validationErrors)) {
            return;
        }

        await onSave(formData.recoveryPassword);
    };

    return (
        <ModalBase
            isOpen={isOpen}
            onClose={onClose}
            title="Senha de recuperação"
            icon={<LockKeyholeIcon className="h-5 w-5 text-primary" />}
            maxWidth="md"
            canClose={!isLoading}
        >
            <div className="space-y-6">
                <div className="text-center">
                    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                        <LockKeyholeIcon className="h-10 w-10 text-primary" />
                    </div>

                    <h3 className="text-xl font-semibold text-foreground">
                        Crie uma senha de recuperação
                    </h3>

                    <p className="mt-2 text-sm text-foreground/50">
                        Essa senha será utilizada para ajudar a recuperar sua
                        conta caso você esqueça sua senha mestre.
                    </p>
                </div>

                <div className="space-y-4">
                    <InputTextForm
                        label="Senha de recuperação"
                        name="recoveryPassword"
                        type="password"
                        placeholder="Digite sua senha de recuperação"
                        value={formData.recoveryPassword}
                        disabled={isLoading}
                        onChange={(e) => {
                            setFormData((prev) => ({
                                ...prev,
                                recoveryPassword: e.target.value,
                            }));

                            if (errors.recoveryPassword) {
                                setErrors((prev) => ({
                                    ...prev,
                                    recoveryPassword: '',
                                }));
                            }
                        }}
                        error={errors.recoveryPassword}
                        leftIcon={<LockKeyholeIcon className="h-5 w-5" />}
                    />

                    <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs font-medium text-foreground/60">
                            Sua senha deve conter:
                        </p>

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <RequirementIndicator
                                label="Mínimo de 10 caracteres"
                                valid={hasMinLength}
                            />

                            <RequirementIndicator
                                label="Pelo menos 1 letra maiúscula"
                                valid={hasUppercase}
                            />

                            <RequirementIndicator
                                label="Pelo menos 1 número"
                                valid={hasNumber}
                            />

                            <RequirementIndicator
                                label="Pelo menos 1 caractere especial"
                                valid={hasSpecialCharacter}
                            />
                        </div>
                    </div>

                    <InputTextForm
                        label="Confirmar senha"
                        name="confirmRecoveryPassword"
                        type="password"
                        placeholder="Confirme sua senha de recuperação"
                        value={formData.confirmPassword}
                        disabled={isLoading}
                        onChange={(e) => {
                            setFormData((prev) => ({
                                ...prev,
                                confirmPassword: e.target.value,
                            }));

                            if (errors.confirmPassword) {
                                setErrors((prev) => ({
                                    ...prev,
                                    confirmPassword: '',
                                }));
                            }
                        }}
                        error={errors.confirmPassword}
                        leftIcon={<LockKeyholeIcon className="h-5 w-5" />}
                    />
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-start gap-3">
                        <ShieldCheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                        <p className="text-sm text-foreground/50">
                            Guarde essa senha em um local seguro. Você precisará
                            dela durante o processo de recuperação da sua conta.
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
                    <Button
                        type="button"
                        onClick={onClose}
                        variant="secondary"
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>

                    <Button
                        type="button"
                        onClick={handleSave}
                        disabled={
                            !isPasswordValid || !passwordsMatch || isLoading
                        }
                        isLoading={isLoading}
                        loadingText="Salvando..."
                        leftIcon={<CheckIcon className="h-4 w-4" />}
                    >
                        Salvar senha
                    </Button>
                </div>
            </div>
        </ModalBase>
    );
}
