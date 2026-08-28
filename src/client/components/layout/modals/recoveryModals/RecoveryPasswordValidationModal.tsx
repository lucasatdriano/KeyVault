/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import {
    AlertCircleIcon,
    CheckIcon,
    LockKeyholeIcon,
    ShieldCheckIcon,
} from 'lucide-react';

import Button from '@/src/client/components/ui/buttons/Button';
import InputTextForm from '@/src/client/components/ui/inputs/InputTextForm';
import ModalBase from '../ModalBase';
import { validateRecoveryPasswordAnswer } from '@/src/client/validators/recovery.validator';
import { hasValidationErrors } from '@/src/client/validators';
import { RecoveryPasswordValidationFormData } from '@/src/client/types/recovery';

interface RecoveryPasswordValidationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerify: (recoveryPassword: string) => Promise<void> | void;
    isLoading?: boolean;
}

export default function RecoveryPasswordValidationModal({
    isOpen,
    onClose,
    onVerify,
    isLoading = false,
}: RecoveryPasswordValidationModalProps) {
    const [formData, setFormData] =
        useState<RecoveryPasswordValidationFormData>({
            recoveryPassword: '',
        });
    const [errors, setErrors] = useState({
        recoveryPassword: '',
    });

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setFormData({
            recoveryPassword: '',
        });

        setErrors({
            recoveryPassword: '',
        });
    }, [isOpen]);

    const handleVerify = async () => {
        const validationErrors = validateRecoveryPasswordAnswer({
            recoveryPassword: formData.recoveryPassword,
        });

        setErrors({
            recoveryPassword: validationErrors.recoveryPassword ?? '',
        });

        if (hasValidationErrors(validationErrors)) {
            return;
        }

        await onVerify(formData.recoveryPassword);
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
                        Informe sua senha de recuperação
                    </h3>

                    <p className="mt-2 text-sm text-foreground/50">
                        Digite a senha que você configurou como método de
                        recuperação da sua conta.
                    </p>
                </div>

                <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />

                        <p className="text-sm text-amber-500/80">
                            Após verificar sua senha, você continuará para o
                            próximo método de recuperação configurado.
                        </p>
                    </div>
                </div>

                <InputTextForm
                    label="Senha de recuperação"
                    name="recoveryPassword"
                    type="password"
                    placeholder="Digite sua senha de recuperação"
                    value={formData.recoveryPassword}
                    disabled={isLoading}
                    onChange={(e) => {
                        setFormData({
                            recoveryPassword: e.target.value,
                        });

                        if (errors.recoveryPassword) {
                            setErrors({
                                recoveryPassword: '',
                            });
                        }
                    }}
                    error={errors.recoveryPassword}
                    leftIcon={<LockKeyholeIcon className="h-5 w-5" />}
                />

                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-start gap-3">
                        <ShieldCheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                        <p className="text-sm text-foreground/50">
                            Sua senha será utilizada apenas para verificar sua
                            identidade durante este processo de recuperação.
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
                        onClick={handleVerify}
                        disabled={!formData.recoveryPassword || isLoading}
                        isLoading={isLoading}
                        loadingText="Verificando..."
                        leftIcon={<CheckIcon className="h-4 w-4" />}
                    >
                        Verificar senha
                    </Button>
                </div>
            </div>
        </ModalBase>
    );
}
