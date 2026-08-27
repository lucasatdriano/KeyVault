/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import {
    CheckIcon,
    CircleIcon,
    LockKeyholeIcon,
    ShieldCheckIcon,
} from 'lucide-react';

import Button from '@/src/client/components/ui/buttons/Button';
import InputTextForm from '@/src/client/components/ui/inputs/InputTextForm';
import ModalBase from '../ModalBase';

interface RecoveryPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (recoveryPassword: string) => Promise<void> | void;
    isLoading?: boolean;
}

interface PasswordRequirementProps {
    label: string;
    valid: boolean;
}

function PasswordRequirement({ label, valid }: PasswordRequirementProps) {
    return (
        <div
            className={`flex items-center gap-2 text-xs ${
                valid ? 'text-green-500' : 'text-foreground/40'
            }`}
        >
            {valid ? (
                <CheckIcon className="h-3.5 w-3.5" />
            ) : (
                <CircleIcon className="h-3.5 w-3.5" />
            )}

            <span>{label}</span>
        </div>
    );
}

export default function RecoveryPasswordModal({
    isOpen,
    onClose,
    onSave,
    isLoading = false,
}: RecoveryPasswordModalProps) {
    const [recoveryPassword, setRecoveryPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setRecoveryPassword('');
        setConfirmPassword('');
        setError('');
    }, [isOpen]);

    const hasMinLength = recoveryPassword.length >= 10;
    const hasUppercase = /[A-Z]/.test(recoveryPassword);
    const hasNumber = /\d/.test(recoveryPassword);
    const hasSpecialCharacter = /[^A-Za-z0-9\s]/.test(recoveryPassword);

    const isPasswordValid =
        hasMinLength && hasUppercase && hasNumber && hasSpecialCharacter;

    const passwordsMatch =
        confirmPassword.length > 0 && recoveryPassword === confirmPassword;

    const handleSave = async () => {
        if (!isPasswordValid) {
            setError(
                'A senha de recuperação não atende aos requisitos necessários.',
            );

            return;
        }

        if (recoveryPassword !== confirmPassword) {
            setError('As senhas não coincidem.');

            return;
        }

        setError('');

        await onSave(recoveryPassword);
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
                        value={recoveryPassword}
                        disabled={isLoading}
                        onChange={(e) => {
                            setRecoveryPassword(e.target.value);

                            if (error) {
                                setError('');
                            }
                        }}
                        error={error}
                        leftIcon={<LockKeyholeIcon className="h-5 w-5" />}
                    />

                    <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs font-medium text-foreground/60">
                            Sua senha deve conter:
                        </p>

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <PasswordRequirement
                                label="Mínimo de 10 caracteres"
                                valid={hasMinLength}
                            />

                            <PasswordRequirement
                                label="Pelo menos 1 letra maiúscula"
                                valid={hasUppercase}
                            />

                            <PasswordRequirement
                                label="Pelo menos 1 número"
                                valid={hasNumber}
                            />

                            <PasswordRequirement
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
                        value={confirmPassword}
                        disabled={isLoading}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);

                            if (error) {
                                setError('');
                            }
                        }}
                        error={
                            confirmPassword.length > 0 && !passwordsMatch
                                ? 'As senhas não coincidem.'
                                : undefined
                        }
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
