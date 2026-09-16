'use client';

import { useEffect, useState } from 'react';
import { HelpCircleIcon } from 'lucide-react';
import { toast } from 'sonner';

import { RecoveryType } from '@/src/shared/types/recovery';

import { useRecovery } from '@/src/client/hooks/recovery/useRecovery';
import { getRecoveryLevel } from '@/src/client/utils/recovery/recovery-level';
import { QuizQuestion, RecoveryQuestion } from '@/src/client/types/recovery';

import InfoCard from '@/src/client/components/ui/cards/InfoCard';
import Header from '@/src/client/components/layout/header/Header';
import QuizFormModal from '@/src/client/components/layout/modals/recoveryModals/CreateQuestionsRecoveryModal';
import RecoveryKeyModal from '@/src/client/components/layout/modals/recoveryModals/RecoveryKeyModal';
import RecoveryPasswordModal from '@/src/client/components/layout/modals/recoveryModals/RecoveryPasswordModal';
import QuizAnswerModal from '@/src/client/components/layout/modals/recoveryModals/AswerQuestionsRecoveryModal';
import RecoveryPasswordValidationModal from '@/src/client/components/layout/modals/recoveryModals/RecoveryPasswordValidationModal';
import RecoveryKeyValidationModal from '@/src/client/components/layout/modals/recoveryModals/RecoveryKeyValidationModal';

import { recoveryMethodConfig } from '@/src/app/(protected)/account/recovery/components/recovery-method.config';
import RecoveryMethodCard from '@/src/app/(protected)/account/recovery/components/RecoveryMethodCard';
import RecoveryLevelCard from '@/src/app/(protected)/account/recovery/components/RecoveryLevelCard';
import RecoveryStatusCard from '@/src/app/(protected)/account/recovery/components/RecoveryStatusCard';

type PendingAction =
    | { kind: 'configure'; type: RecoveryType }
    | { kind: 'disable'; type: RecoveryType };

export default function RecoveryPage() {
    const {
        activeMethods,
        isLoading,
        isSubmitting,
        hasRecoveryKey,

        loadMethods,
        getMethod,

        getMissingActiveRecoveryMethods,
        verifyExistingRecoverySecrets,
        getQuestionsForReauth,

        handleDisableMethod,
        handleConfigureQuestions,
        handleConfigureRecoveryPassword,
        handleGenerateRecoveryKey,
    } = useRecovery();

    const [showRecoveryKeyModal, setShowRecoveryKeyModal] = useState(false);
    const [showQuestionsModal, setShowQuestionsModal] = useState(false);
    const [showRecoveryPasswordModal, setShowRecoveryPasswordModal] =
        useState(false);

    const [reauthQueue, setReauthQueue] = useState<RecoveryType[]>([]);
    const [reauthSecrets, setReauthSecrets] = useState<
        Partial<Record<RecoveryType, string>>
    >({});
    const [reauthQuestions, setReauthQuestions] = useState<RecoveryQuestion[]>(
        [],
    );
    const [isVerifyingReauth, setIsVerifyingReauth] = useState(false);
    const [pendingAction, setPendingAction] = useState<PendingAction | null>(
        null,
    );

    const currentReauthType = reauthQueue[0] ?? null;

    const level = getRecoveryLevel(activeMethods.length);
    const isSecure = activeMethods.length >= 2;

    const cancelReauth = () => {
        setReauthQueue([]);
        setReauthSecrets({});
        setReauthQuestions([]);
        setPendingAction(null);
    };

    const openTargetModal = (target: RecoveryType) => {
        if (target === RecoveryType.QUESTIONS) {
            setShowQuestionsModal(true);
        } else if (target === RecoveryType.RECOVERY_KEY) {
            setShowRecoveryKeyModal(true);
        } else if (target === RecoveryType.RECOVERY_PASSWORD) {
            setShowRecoveryPasswordModal(true);
        }
    };

    useEffect(() => {
        if (currentReauthType !== RecoveryType.QUESTIONS) {
            return;
        }

        let cancelled = false;

        getQuestionsForReauth()
            .then((questions) => {
                if (!cancelled) {
                    setReauthQuestions(questions);
                }
            })
            .catch((error: unknown) => {
                if (cancelled) {
                    return;
                }

                toast.error(
                    error instanceof Error
                        ? error.message
                        : 'Não foi possível carregar suas perguntas de recuperação.',
                );

                cancelReauth();
            });

        return () => {
            cancelled = true;
        };
    }, [currentReauthType, getQuestionsForReauth]);

    const beginConfigureFlow = (target: RecoveryType) => {
        if (isSubmitting || isVerifyingReauth) {
            return;
        }

        if (target === RecoveryType.EMAIL) {
            return;
        }

        const missing = getMissingActiveRecoveryMethods();

        if (missing.length === 0) {
            openTargetModal(target);

            return;
        }

        setPendingAction({ kind: 'configure', type: target });
        setReauthSecrets({});
        setReauthQueue(missing.map((method) => method.type));
    };

    const beginDisableFlow = (target: RecoveryType) => {
        if (isSubmitting || isVerifyingReauth) {
            return;
        }

        const missing = getMissingActiveRecoveryMethods();

        if (missing.length === 0) {
            handleDisableMethod(target);

            return;
        }

        setPendingAction({ kind: 'disable', type: target });
        setReauthSecrets({});
        setReauthQueue(missing.map((method) => method.type));
    };

    const handleReauthSubmit = async (type: RecoveryType, secret: string) => {
        const updatedSecrets = {
            ...reauthSecrets,
            [type]: secret,
        };

        const remaining = reauthQueue.slice(1);

        if (remaining.length > 0) {
            setReauthSecrets(updatedSecrets);
            setReauthQueue(remaining);

            return;
        }

        setIsVerifyingReauth(true);

        const isValid = await verifyExistingRecoverySecrets(updatedSecrets);

        setIsVerifyingReauth(false);

        if (!isValid) {
            toast.error(
                'Um ou mais dados informados estão incorretos. Tente novamente.',
            );

            const missing = getMissingActiveRecoveryMethods();

            setReauthSecrets({});
            setReauthQueue(missing.map((method) => method.type));

            return;
        }

        setReauthQueue([]);

        if (!pendingAction) {
            return;
        }

        if (pendingAction.kind === 'configure') {
            setReauthSecrets(updatedSecrets);
            openTargetModal(pendingAction.type);

            return;
        }

        const success = await handleDisableMethod(
            pendingAction.type,
            updatedSecrets,
        );

        cancelReauth();

        if (success) {
            toast.success('Método de recuperação desativado.');
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Header variant="recovery" />

                <div className="mx-4 rounded-2xl border border-white/10 bg-white/5 p-6">
                    <p className="text-sm text-foreground/40">
                        Carregando métodos de recuperação...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                <Header variant="recovery" />

                <div className="mx-4 rounded-2xl border border-white/10 bg-white/5 p-6">
                    <RecoveryLevelCard
                        level={level}
                        activeMethodsCount={activeMethods.length}
                    />

                    <RecoveryStatusCard isSecure={isSecure} />
                </div>

                <div className="mx-4 space-y-4">
                    {Object.values(recoveryMethodConfig).map((config) => {
                        const method = getMethod(config.type);
                        const isActive = method?.enabled ?? false;

                        return (
                            <RecoveryMethodCard
                                key={config.type}
                                config={config}
                                isActive={isActive}
                                isSubmitting={isSubmitting}
                                onEnable={() => beginConfigureFlow(config.type)}
                                onDisable={() => beginDisableFlow(config.type)}
                                onConfigure={
                                    config.type !== RecoveryType.EMAIL
                                        ? () => beginConfigureFlow(config.type)
                                        : undefined
                                }
                                isDisabled={config.isDisabled}
                                disabledReason={config.disabledReason}
                            />
                        );
                    })}
                </div>

                <InfoCard
                    icon={HelpCircleIcon}
                    title="Como funciona a recuperação?"
                    variant="primary"
                >
                    <>
                        Se você esquecer sua senha mestre, os métodos ativos
                        acima permitirão verificar sua identidade e criar uma
                        nova senha.{' '}
                        <span className="text-foreground/40">
                            Recomendamos ativar ao menos 2 métodos
                            independentes.
                        </span>
                    </>
                </InfoCard>
            </div>

            <QuizAnswerModal
                isOpen={currentReauthType === RecoveryType.QUESTIONS}
                onClose={cancelReauth}
                onVerify={async (answers) => {
                    const secret = answers
                        .map((answer) => answer.trim().toLowerCase())
                        .map((answer) => `${answer.length}:${answer}`)
                        .join('|');

                    await handleReauthSubmit(RecoveryType.QUESTIONS, secret);
                }}
                questions={reauthQuestions}
                title="Confirme suas perguntas de segurança"
                isLoading={isVerifyingReauth || isSubmitting}
            />

            <RecoveryPasswordValidationModal
                isOpen={currentReauthType === RecoveryType.RECOVERY_PASSWORD}
                onClose={cancelReauth}
                onVerify={async (recoveryPassword) => {
                    await handleReauthSubmit(
                        RecoveryType.RECOVERY_PASSWORD,
                        recoveryPassword.trim(),
                    );
                }}
                isLoading={isVerifyingReauth || isSubmitting}
            />

            <RecoveryKeyValidationModal
                isOpen={currentReauthType === RecoveryType.RECOVERY_KEY}
                onClose={cancelReauth}
                onVerify={async (recoveryKey) => {
                    await handleReauthSubmit(
                        RecoveryType.RECOVERY_KEY,
                        recoveryKey.trim().toUpperCase(),
                    );
                }}
                isLoading={isVerifyingReauth || isSubmitting}
            />

            <RecoveryKeyModal
                isOpen={showRecoveryKeyModal}
                onClose={(shouldReload) => {
                    setShowRecoveryKeyModal(false);
                    cancelReauth();

                    if (shouldReload) {
                        loadMethods();
                    }
                }}
                hasRecoveryKey={hasRecoveryKey}
                onGenerate={() => handleGenerateRecoveryKey(reauthSecrets)}
            />

            <QuizFormModal
                isOpen={showQuestionsModal}
                onClose={() => {
                    setShowQuestionsModal(false);
                    cancelReauth();
                }}
                onSave={async (questions: QuizQuestion[]) => {
                    const success = await handleConfigureQuestions(
                        questions,
                        reauthSecrets,
                    );

                    if (success) {
                        setShowQuestionsModal(false);
                        cancelReauth();
                    }

                    return success;
                }}
                maxQuestions={3}
                isLoading={isSubmitting}
            />

            <RecoveryPasswordModal
                isOpen={showRecoveryPasswordModal}
                onClose={() => {
                    setShowRecoveryPasswordModal(false);
                    cancelReauth();
                }}
                onSave={async (recoveryPassword: string) => {
                    const success = await handleConfigureRecoveryPassword(
                        recoveryPassword,
                        reauthSecrets,
                    );

                    if (success) {
                        setShowRecoveryPasswordModal(false);
                        cancelReauth();
                    }
                }}
                isLoading={isSubmitting}
            />
        </>
    );
}
