/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ShieldIcon,
    DatabaseIcon,
    DownloadIcon,
    UploadIcon,
    InfoIcon,
    AlertTriangleIcon,
    ChevronRightIcon,
    Trash2Icon,
    RefreshCwIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import { deleteAccountAction } from '@/src/server/actions/auth/delete-account.action';

import { ACCESS_TOKEN_DURATION } from '@/src/shared/constants/auth/auth.constants';

import { useCredentials } from '@/src/client/hooks/credentials/useCredentials';
import { useAccountProfile } from '@/src/client/hooks/user/useAccountProfile';
import { useSettingsStore } from '@/src/client/store/settings.store';

import Header from '@/src/client/components/layout/header/Header';
import ImportModal from '@/src/client/components/layout/modals/credentialsModals/ImportModal';
import ExportModal from '@/src/client/components/layout/modals/credentialsModals/ExportModal';
import DeleteAccountModal from '@/src/client/components/layout/modals/usersModals/DeleteAccountModal';
import InputSelectForm from '@/src/client/components/ui/inputs/InputSelectForm';

export default function SettingsPage() {
    const router = useRouter();

    const {
        sessionExpiration,
        isUpdatingSessionExpiration,
        handleSaveSessionExpiration,
    } = useAccountProfile();

    const { handleExport, handleImport } = useCredentials();

    const {
        hidePasswordDelay,
        autoLockMinutes,
        updateHidePasswordDelay,
        updateAutoLock,
    } = useSettingsStore();

    const [showExportModal, setShowExportModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);

    const [lastSync, setLastSync] = useState<Date | null>(null);

    useEffect(() => {
        setLastSync(new Date());
    }, []);

    const hidePasswordOptions = [
        {
            value: 3000,
            label: '3 segundos',
        },
        {
            value: 5000,
            label: '5 segundos (recomendado)',
        },
        {
            value: 10000,
            label: '10 segundos',
        },
        {
            value: 30000,
            label: '30 segundos',
        },
        {
            value: -1,
            label: 'Nunca',
        },
    ];

    const sessionTimeoutOptions = [
        {
            value: ACCESS_TOKEN_DURATION.MINUTES_30,
            label: '30 minutos',
        },
        {
            value: ACCESS_TOKEN_DURATION.HOUR_1,
            label: '1 hora',
        },
        {
            value: ACCESS_TOKEN_DURATION.HOURS_2,
            label: '2 horas',
        },
    ];

    const handleSessionExpirationChange = async (value: number) => {
        await handleSaveSessionExpiration(value);
    };

    const handleAutoLockToggle = () => {
        if (autoLockMinutes > 0) {
            updateAutoLock(0);
            return;
        }

        updateAutoLock(5);
    };

    const handleExportData = async (): Promise<boolean> => {
        if (isExporting) {
            return false;
        }

        setIsExporting(true);

        try {
            await handleExport();

            setShowExportModal(false);

            return true;
        } catch {
            return false;
        } finally {
            setIsExporting(false);
        }
    };

    const handleImportData = async (file: File): Promise<boolean> => {
        if (isImporting) {
            return false;
        }

        setIsImporting(true);

        try {
            const success = await handleImport(file);

            if (success) {
                setShowImportModal(false);
            }

            return success;
        } catch {
            return false;
        } finally {
            setIsImporting(false);
        }
    };

    const handleDeleteAccount = async (): Promise<boolean> => {
        if (isDeletingAccount) {
            return false;
        }

        setIsDeletingAccount(true);

        try {
            const result = await deleteAccountAction();

            if (!result.success) {
                toast.error(result.error ?? 'Erro ao excluir a conta.');

                return false;
            }

            toast.success('Conta excluída com sucesso.');

            setShowDeleteModal(false);

            router.push('/');

            return true;
        } catch (error) {
            console.error('Erro ao excluir conta:', error);

            toast.error('Erro ao excluir a conta.');

            return false;
        } finally {
            setIsDeletingAccount(false);
        }
    };

    return (
        <>
            <div className="space-y-6">
                <Header variant="settings" />

                <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mx-4">
                    <div className="flex items-center gap-2 mb-4">
                        <ShieldIcon className="w-5 h-5 text-foreground/40" />

                        <h2 className="text-sm font-semibold text-foreground/40 uppercase tracking-wider">
                            Segurança
                        </h2>
                    </div>

                    <p className="text-xs text-foreground/40 mb-4">
                        Configure o comportamento de segurança da sessão.
                    </p>

                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                            <div>
                                <p className="text-sm font-medium text-foreground">
                                    Tempo para ocultar senha
                                </p>

                                <p className="text-xs text-foreground/40">
                                    Define por quanto tempo uma senha
                                    permanecerá visível após ser revelada
                                </p>
                            </div>

                            <div className="w-64">
                                <InputSelectForm
                                    value={hidePasswordDelay}
                                    className="text-sm"
                                    onChange={(event) =>
                                        updateHidePasswordDelay(
                                            Number(event.target.value),
                                        )
                                    }
                                    options={hidePasswordOptions.map(
                                        (option) => ({
                                            value: String(option.value),
                                            label: option.label,
                                        }),
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                            <div>
                                <p className="text-sm font-medium text-foreground">
                                    Tempo de sessão
                                </p>

                                <p className="text-xs text-foreground/40">
                                    Define a duração das novas sessões após o
                                    login
                                </p>
                            </div>

                            <div className="w-64">
                                <InputSelectForm
                                    value={sessionExpiration}
                                    className="text-sm"
                                    onChange={(event) =>
                                        handleSessionExpirationChange(
                                            Number(event.target.value),
                                        )
                                    }
                                    options={sessionTimeoutOptions.map(
                                        (option) => ({
                                            value: String(option.value),
                                            label: option.label,
                                        }),
                                    )}
                                    disabled={isUpdatingSessionExpiration}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                            <div>
                                <p className="text-sm font-medium text-foreground">
                                    Bloquear automaticamente
                                </p>

                                <p className="text-xs text-foreground/40">
                                    Bloquear o KeyVault quando o computador
                                    ficar inativo
                                    {autoLockMinutes > 0 && ` após 3 minutos`}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleAutoLockToggle}
                                className={` cursor-pointer relative w-12 h-7 rounded-full transition-all duration-200 ${
                                    autoLockMinutes > 0
                                        ? 'bg-primary'
                                        : 'bg-white/20'
                                }`}
                                aria-label={
                                    autoLockMinutes > 0
                                        ? 'Desativar bloqueio automático'
                                        : 'Ativar bloqueio automático'
                                }
                            >
                                <div
                                    className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-200 ${
                                        autoLockMinutes > 0
                                            ? 'left-6'
                                            : 'left-1'
                                    }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mx-4">
                    <div className="flex items-center gap-2 mb-4">
                        <DatabaseIcon className="w-5 h-5 text-foreground/40" />

                        <h2 className="text-sm font-semibold text-foreground/40 uppercase tracking-wider">
                            Dados
                        </h2>
                    </div>

                    <p className="text-xs text-foreground/40 mb-4">
                        Importe ou exporte suas credenciais.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setShowExportModal(true)}
                            className="cursor-pointer flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                                    <DownloadIcon className="w-5 h-5 text-green-500" />
                                </div>

                                <div className="text-left">
                                    <p className="text-sm font-medium text-foreground">
                                        Exportar dados
                                    </p>

                                    <p className="text-xs text-foreground/40">
                                        Salve um backup das suas credenciais
                                    </p>
                                </div>
                            </div>

                            <ChevronRightIcon className="w-5 h-5 text-foreground/30" />
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowImportModal(true)}
                            className="cursor-pointer flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                    <UploadIcon className="w-5 h-5 text-blue-500" />
                                </div>

                                <div className="text-left">
                                    <p className="text-sm font-medium text-foreground">
                                        Importar dados
                                    </p>

                                    <p className="text-xs text-foreground/40">
                                        Importe um backup do KeyVault
                                    </p>
                                </div>
                            </div>

                            <ChevronRightIcon className="w-5 h-5 text-foreground/30" />
                        </button>
                    </div>
                </div>

                <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mx-4">
                    <div className="flex items-center gap-2 mb-4">
                        <InfoIcon className="w-5 h-5 text-foreground/40" />

                        <h2 className="text-sm font-semibold text-foreground/40 uppercase tracking-wider">
                            Sobre o KeyVault
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                            <span className="text-sm text-foreground/60">
                                Versão
                            </span>

                            <span className="text-sm font-medium text-foreground">
                                1.0.0
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                            <span className="text-sm text-foreground/60">
                                Criptografia
                            </span>

                            <span className="text-sm font-medium text-foreground">
                                AES-256-GCM
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                            <span className="text-sm text-foreground/60">
                                Derivação de chave
                            </span>

                            <span className="text-sm font-medium text-foreground">
                                Argon2id
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                            <span className="text-sm text-foreground/60">
                                Última sincronização
                            </span>

                            <span className="text-sm font-medium text-foreground flex items-center gap-1">
                                <RefreshCwIcon className="w-3 h-3 text-green-500" />

                                {lastSync
                                    ? lastSync.toLocaleString('pt-BR', {
                                          dateStyle: 'short',
                                          timeStyle: 'short',
                                      })
                                    : '—'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-error/5 border border-error/20 rounded-2xl p-6 mx-4 mb-4">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangleIcon className="w-5 h-5 text-error" />

                        <h2 className="text-sm font-semibold text-error uppercase tracking-wider">
                            Zona de Perigo
                        </h2>
                    </div>

                    <p className="text-xs text-foreground/40 mb-4">
                        Ações irreversíveis. Proceda com cuidado.
                    </p>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-error/5 border border-error/10 hover:bg-error/10 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center">
                                <Trash2Icon className="w-5 h-5 text-error" />
                            </div>

                            <div>
                                <p className="text-sm font-medium text-error">
                                    Excluir conta
                                </p>

                                <p className="text-xs text-foreground/40">
                                    Todos os dados serão permanentemente
                                    deletados
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowDeleteModal(true)}
                            className="cursor-pointer text-sm text-error font-medium hover:underline flex items-center gap-1"
                        >
                            Excluir
                            <ChevronRightIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <ExportModal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                onExport={handleExportData}
                isExporting={isExporting}
            />

            <ImportModal
                isOpen={showImportModal}
                onClose={() => setShowImportModal(false)}
                onImport={handleImportData}
                isImporting={isImporting}
            />

            <DeleteAccountModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteAccount}
                isDeleting={isDeletingAccount}
            />
        </>
    );
}
