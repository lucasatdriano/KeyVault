'use client';

import { useState } from 'react';
import { HelpCircleIcon } from 'lucide-react';

import { RecoveryType } from '@/src/shared/types/recovery';

import { useRecovery } from '@/src/client/hooks/recovery/useRecovery';
import { getRecoveryLevel } from '@/src/client/utils/recovery/recovery-level';
import { QuizQuestion } from '@/src/client/types/recovery';

import InfoCard from '@/src/client/components/ui/cards/InfoCard';
import Header from '@/src/client/components/layout/header/Header';
import QuizFormModal from '@/src/client/components/layout/modals/recoveryModals/CreateQuestionsRecoveryModal';
import RecoveryKeyModal from '@/src/client/components/layout/modals/recoveryModals/RecoveryKeyModal';
import RecoveryPasswordModal from '@/src/client/components/layout/modals/recoveryModals/RecoveryPasswordModal';

import { recoveryMethodConfig } from '@/src/app/(protected)/account/recovery/components/recovery-method.config';
import RecoveryMethodCard from '@/src/app/(protected)/account/recovery/components/RecoveryMethodCard';
import RecoveryLevelCard from '@/src/app/(protected)/account/recovery/components/RecoveryLevelCard';
import RecoveryStatusCard from '@/src/app/(protected)/account/recovery/components/RecoveryStatusCard';

export default function RecoveryPage() {
    const {
        activeMethods,
        isLoading,
        isSubmitting,
        hasRecoveryKey,

        loadMethods,
        getMethod,

        handleEnableMethod: enableMethod,
        handleDisableMethod: disableMethod,
        handleConfigureQuestions,
        handleConfigureRecoveryPassword,
        handleGenerateRecoveryKey,
    } = useRecovery();

    const [showRecoveryKeyModal, setShowRecoveryKeyModal] = useState(false);
    const [showQuestionsModal, setShowQuestionsModal] = useState(false);
    const [showRecoveryPasswordModal, setShowRecoveryPasswordModal] =
        useState(false);

    const level = getRecoveryLevel(activeMethods.length);
    const isSecure = activeMethods.length >= 2;

    const handleEnableMethod = (type: RecoveryType) => {
        if (type === RecoveryType.QUESTIONS) {
            setShowQuestionsModal(true);
            return;
        }

        if (type === RecoveryType.RECOVERY_KEY) {
            setShowRecoveryKeyModal(true);
            return;
        }

        if (type === RecoveryType.RECOVERY_PASSWORD) {
            setShowRecoveryPasswordModal(true);
            return;
        }

        enableMethod(type);
    };

    const handleConfigureMethod = (type: RecoveryType) => {
        if (type === RecoveryType.QUESTIONS) {
            setShowQuestionsModal(true);
            return;
        }

        if (type === RecoveryType.RECOVERY_KEY) {
            setShowRecoveryKeyModal(true);
            return;
        }

        if (type === RecoveryType.RECOVERY_PASSWORD) {
            setShowRecoveryPasswordModal(true);
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
                                onEnable={() => handleEnableMethod(config.type)}
                                onDisable={() => disableMethod(config.type)}
                                onConfigure={
                                    config.type !== RecoveryType.EMAIL
                                        ? () =>
                                              handleConfigureMethod(config.type)
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

            <RecoveryKeyModal
                isOpen={showRecoveryKeyModal}
                onClose={(shouldReload) => {
                    setShowRecoveryKeyModal(false);

                    if (shouldReload) {
                        loadMethods();
                    }
                }}
                hasRecoveryKey={hasRecoveryKey}
                onGenerate={handleGenerateRecoveryKey}
            />

            <QuizFormModal
                isOpen={showQuestionsModal}
                onClose={() => setShowQuestionsModal(false)}
                onSave={async (questions: QuizQuestion[]) => {
                    const success = await handleConfigureQuestions(questions);

                    if (success) {
                        setShowQuestionsModal(false);
                    }

                    return success;
                }}
                maxQuestions={3}
                isLoading={isSubmitting}
            />

            <RecoveryPasswordModal
                isOpen={showRecoveryPasswordModal}
                onClose={() => setShowRecoveryPasswordModal(false)}
                onSave={async (recoveryPassword: string) => {
                    const success =
                        await handleConfigureRecoveryPassword(recoveryPassword);

                    if (success) {
                        setShowRecoveryPasswordModal(false);
                    }
                }}
                isLoading={isSubmitting}
            />
        </>
    );
}
