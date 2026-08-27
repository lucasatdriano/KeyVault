'use client';

import { useState } from 'react';
import {
    AlertTriangleIcon,
    CheckCircleIcon,
    HelpCircleIcon,
    ShieldCheckIcon,
} from 'lucide-react';

import { RecoveryType } from '@/src/shared/types/recovery';

import { useRecovery } from '@/src/client/hooks/recovery/useRecovery';
import { getRecoveryLevel } from '@/src/client/utils/recovery/recovery-level';
import { recoveryMethodConfig } from './components/recovery-method.config';

import Header from '@/src/client/components/layout/header/Header';
import InfoCard from '@/src/client/components/ui/cards/InfoCard';
import QuizFormModal from '@/src/client/components/layout/modals/recoveryModals/CreateQuestionsRecoveryModal';
import RecoveryKeyModal from '@/src/client/components/layout/modals/recoveryModals/RecoveryKeyModal';
import RecoveryPasswordModal from '@/src/client/components/layout/modals/recoveryModals/RecoveryPasswordModal';
import RecoveryMethodCard from './components/RecoveryMethodCard';
import { QuizQuestion } from '@/src/client/types/recovery';

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
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className={`flex h-12 w-12 items-center justify-center rounded-xl ${level.background}`}
                            >
                                <ShieldCheckIcon
                                    className={`h-6 w-6 ${level.color}`}
                                />
                            </div>

                            <div>
                                <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/40">
                                    Nível de Recuperação
                                </h2>

                                <p
                                    className={`text-2xl font-bold ${level.color}`}
                                >
                                    {level.label}
                                </p>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="text-xs text-foreground/40">
                                {activeMethods.length} de{' '}
                                {Object.keys(recoveryMethodConfig).length}{' '}
                                métodos ativos
                            </p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                        <div className="flex items-start gap-3">
                            {activeMethods.length >= 2 ? (
                                <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                            ) : (
                                <AlertTriangleIcon className="mt-0.5 h-5 w-5 shrink-0 text-yellow-500" />
                            )}

                            <div>
                                <p className="text-sm text-foreground/60">
                                    {activeMethods.length >= 2
                                        ? 'Bom! Adicione mais um método para aumentar a segurança da recuperação.'
                                        : 'Adicione mais métodos de recuperação para aumentar a segurança da sua conta.'}
                                </p>

                                <p className="mt-1 text-xs text-foreground/30">
                                    Recomendamos ativar ao menos 2 métodos
                                    independentes.
                                </p>
                            </div>
                        </div>
                    </div>
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
