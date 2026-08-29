/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import {
    KeyIcon,
    ShieldCheckIcon,
    AlertCircleIcon,
    CheckIcon,
} from 'lucide-react';

import { hasValidationErrors } from '@/src/client/validators';
import { validateRecoveryKey } from '@/src/client/validators/recovery.validator';
import { RecoveryKeyFormData } from '@/src/client/types/recovery';

import Button from '@/src/client/components/ui/buttons/Button';
import InputTextForm from '@/src/client/components/ui/inputs/InputTextForm';
import ModalBase from '@/src/client/components/layout/modals/ModalBase';

interface RecoveryKeyValidationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerify: (recoveryKey: string) => Promise<void> | void;
    title?: string;
    isLoading?: boolean;
}

export default function RecoveryKeyValidationModal({
    isOpen,
    onClose,
    onVerify,
    title = 'Chave de recuperação',
    isLoading = false,
}: RecoveryKeyValidationModalProps) {
    const [formData, setFormData] = useState<RecoveryKeyFormData>({
        recoveryKey: '',
    });
    const [errors, setErrors] = useState({
        recoveryKey: '',
    });

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setFormData({
            recoveryKey: '',
        });

        setErrors({
            recoveryKey: '',
        });
    }, [isOpen]);

    const handleVerify = async () => {
        const validationErrors = validateRecoveryKey({
            recoveryKey: formData.recoveryKey,
        });

        setErrors({
            recoveryKey: validationErrors.recoveryKey ?? '',
        });

        if (hasValidationErrors(validationErrors)) {
            return;
        }

        await onVerify(formData.recoveryKey.trim().toUpperCase());
    };

    return (
        <ModalBase
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            icon={<KeyIcon className="h-5 w-5 text-primary" />}
            maxWidth="md"
            canClose={!isLoading}
        >
            <div className="space-y-6">
                <div className="text-center">
                    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                        <KeyIcon className="h-10 w-10 text-primary" />
                    </div>

                    <h3 className="text-xl font-semibold text-foreground">
                        Informe sua chave de recuperação
                    </h3>

                    <p className="mt-2 text-sm text-foreground/50">
                        Digite a chave gerada quando você configurou este método
                        de recuperação.
                    </p>
                </div>

                <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />

                        <p className="text-sm text-amber-500/80">
                            Sua chave de recuperação é única e só pode ser
                            utilizada se ainda estiver válida.
                        </p>
                    </div>
                </div>

                <InputTextForm
                    label="Chave de recuperação"
                    name="recoveryKey"
                    type="text"
                    placeholder="KV-******-******-******"
                    value={formData.recoveryKey}
                    disabled={isLoading}
                    onChange={(e) => {
                        setFormData({
                            recoveryKey: e.target.value.toUpperCase(),
                        });

                        if (errors.recoveryKey) {
                            setErrors({
                                recoveryKey: '',
                            });
                        }
                    }}
                    error={errors.recoveryKey}
                    leftIcon={<KeyIcon className="h-5 w-5" />}
                />

                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-start gap-3">
                        <ShieldCheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                        <p className="text-sm text-foreground/50">
                            Após verificar sua chave, você continuará para o
                            próximo método de recuperação configurado.
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
                        disabled={!formData.recoveryKey.trim() || isLoading}
                        isLoading={isLoading}
                        loadingText="Verificando..."
                        leftIcon={<CheckIcon className="h-4 w-4" />}
                    >
                        Verificar chave
                    </Button>
                </div>
            </div>
        </ModalBase>
    );
}
