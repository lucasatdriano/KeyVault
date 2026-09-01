'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    AlertCircleIcon,
    CheckCircle2Icon,
    KeyIcon,
    LockKeyholeIcon,
    ShieldIcon,
} from 'lucide-react';

import { RecoveryType } from '@/src/shared/types/recovery';

import { useRecoveryFlow } from '@/src/client/hooks/auth/useRecoveryFlow';

import Button from '@/src/client/components/ui/buttons/Button';
import Logo from '@/src/client/components/layout/logo/Logo';
import RecoveryPasswordValidationModal from '@/src/client/components/layout/modals/recoveryModals/RecoveryPasswordValidationModal';
import RecoveryKeyValidationModal from '@/src/client/components/layout/modals/recoveryModals/RecoveryKeyValidationModal';
import QuizAnswerModal from '@/src/client/components/layout/modals/recoveryModals/AswerQuestionsRecoveryModal';

export default function RecoveryFlowClient() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const {
        challenge,
        questions,
        isLoading,
        isVerifying,
        loadCurrentChallenge,
        handleVerifyQuestions,
        handleVerifyRecoveryPassword,
        handleVerifyRecoveryKey,
        handleCancel,
    } = useRecoveryFlow();

    useEffect(() => {
        if (token) {
            loadCurrentChallenge(token);
        }
    }, [token, loadCurrentChallenge]);

    if (isLoading || !challenge) {
        return (
            <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
                <div className="flex flex-col items-center justify-center py-12">
                    <Logo variant="icon" size="lg" />

                    <p className="mt-6 text-sm text-foreground/60">
                        Carregando recuperação...
                    </p>
                </div>
            </div>
        );
    }

    const currentMethodLabel = {
        [RecoveryType.EMAIL]: 'Verificação por e-mail',
        [RecoveryType.QUESTIONS]: 'Perguntas de segurança',
        [RecoveryType.RECOVERY_PASSWORD]: 'Senha de recuperação',
        [RecoveryType.RECOVERY_KEY]: 'Chave de recuperação',
    }[challenge.type];

    const CurrentIcon = {
        [RecoveryType.EMAIL]: ShieldIcon,
        [RecoveryType.QUESTIONS]: ShieldIcon,
        [RecoveryType.RECOVERY_PASSWORD]: LockKeyholeIcon,
        [RecoveryType.RECOVERY_KEY]: KeyIcon,
    }[challenge.type];

    const currentStep = challenge.completedSteps + 1;

    const handleVerifyQuestionsWrapper = async (answers: string[]) => {
        if (!token) return;
        await handleVerifyQuestions(token, answers);
    };

    const handleVerifyRecoveryPasswordWrapper = async (
        recoveryPassword: string,
    ) => {
        if (!token) return;
        await handleVerifyRecoveryPassword(token, recoveryPassword);
    };

    const handleVerifyRecoveryKeyWrapper = async (recoveryKey: string) => {
        if (!token) return;
        await handleVerifyRecoveryKey(token, recoveryKey);
    };

    return (
        <>
            <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
                <div className="mb-6 flex justify-center">
                    <Logo variant="icon" size="lg" />
                </div>

                <div className="text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <CurrentIcon className="h-8 w-8 text-primary" />
                    </div>

                    <h1 className="text-2xl font-bold text-foreground">
                        Recuperação de conta
                    </h1>

                    <p className="mt-2 text-sm text-foreground/60">
                        Complete todos os métodos de recuperação configurados
                        para continuar.
                    </p>
                </div>

                <div className="mt-8">
                    <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm text-foreground/60">
                            Etapa {currentStep} de {challenge.totalSteps}
                        </span>

                        <span className="text-sm font-medium text-primary">
                            {currentMethodLabel}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        {Array.from({
                            length: challenge.totalSteps,
                        }).map((_, index) => {
                            const isCompleted =
                                index < challenge.completedSteps;

                            const isCurrent = index === challenge.currentStep;

                            return (
                                <div
                                    key={index}
                                    className={`flex h-2 flex-1 items-center justify-center rounded-full transition-all ${
                                        isCompleted
                                            ? 'bg-green-500'
                                            : isCurrent
                                              ? 'bg-primary'
                                              : 'bg-white/10'
                                    }`}
                                >
                                    {isCompleted && (
                                        <CheckCircle2Icon className="h-3 w-3 text-white" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-start gap-3">
                        <AlertCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                        <div>
                            <p className="font-medium text-foreground">
                                Próxima verificação
                            </p>

                            <p className="mt-1 text-sm text-foreground/60">
                                Complete a etapa atual para continuar a
                                recuperação da sua conta.
                            </p>
                        </div>
                    </div>
                </div>

                <Button
                    type="button"
                    onClick={handleCancel}
                    variant="secondary"
                    fullWidth
                    className="mt-6"
                    disabled={isVerifying}
                >
                    Cancelar recuperação
                </Button>
            </div>

            <QuizAnswerModal
                isOpen={challenge.type === RecoveryType.QUESTIONS}
                onClose={handleCancel}
                onVerify={handleVerifyQuestionsWrapper}
                questions={questions}
                isLoading={isVerifying}
            />

            <RecoveryPasswordValidationModal
                isOpen={challenge.type === RecoveryType.RECOVERY_PASSWORD}
                onClose={handleCancel}
                onVerify={handleVerifyRecoveryPasswordWrapper}
                isLoading={isVerifying}
            />

            <RecoveryKeyValidationModal
                isOpen={challenge.type === RecoveryType.RECOVERY_KEY}
                onClose={handleCancel}
                onVerify={handleVerifyRecoveryKeyWrapper}
                isLoading={isVerifying}
            />
        </>
    );
}
