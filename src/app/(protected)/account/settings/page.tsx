'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Shield,
    Database,
    Download,
    Upload,
    Info,
    AlertTriangle,
    Lock,
    ChevronRight,
    Trash2,
    RefreshCw,
    FileText,
} from 'lucide-react';
import Button from '@/src/client/components/ui/buttons/Button';
import Header from '@/src/client/components/layout/header/Header';

export default function SettingsPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [settings, setSettings] = useState({
        hidePasswordTimeout: '5',
        sessionTimeout: '30',
        autoLock: true,
        clearClipboard: true,
        showPasswordsByDefault: false,
    });

    const hidePasswordOptions = [
        { value: '3', label: '3 segundos' },
        { value: '5', label: '5 segundos (recomendado)' },
        { value: '10', label: '10 segundos' },
        { value: '30', label: '30 segundos' },
        { value: 'never', label: 'Nunca' },
    ];

    const sessionTimeoutOptions = [
        { value: '15', label: '15 minutos' },
        { value: '30', label: '30 minutos' },
        { value: '60', label: '1 hora' },
        { value: '120', label: '2 horas' },
        { value: 'never', label: 'Nunca' },
    ];

    const handleSettingChange = (key: keyof typeof settings, value: any) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    const handleExport = () => {
        console.log('Exportando dados...');
        setShowExportModal(false);
    };

    const handleImport = () => {
        console.log('Importando dados...');
        setShowImportModal(false);
    };

    const handleDeleteAccount = () => {
        console.log('Excluindo conta...');
        setShowDeleteModal(false);
        router.push('/login');
    };

    const handleToggleSetting = (key: keyof typeof settings) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="space-y-6">
            <Header variant="settings" />

            <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mx-4">
                <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-foreground/40" />
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
                        </div>
                        <select
                            value={settings.hidePasswordTimeout}
                            onChange={(e) =>
                                handleSettingChange(
                                    'hidePasswordTimeout',
                                    e.target.value,
                                )
                            }
                            className="bg-background/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        >
                            {hidePasswordOptions.map((opt) => (
                                <option
                                    key={opt.value}
                                    value={opt.value}
                                    className="bg-background"
                                >
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                        <div>
                            <p className="text-sm font-medium text-foreground">
                                Tempo de sessão
                            </p>
                        </div>
                        <select
                            value={settings.sessionTimeout}
                            onChange={(e) =>
                                handleSettingChange(
                                    'sessionTimeout',
                                    e.target.value,
                                )
                            }
                            className="bg-background/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        >
                            {sessionTimeoutOptions.map((opt) => (
                                <option
                                    key={opt.value}
                                    value={opt.value}
                                    className="bg-background"
                                >
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                        <div>
                            <p className="text-sm font-medium text-foreground">
                                Bloquear automaticamente
                            </p>
                            <p className="text-xs text-foreground/40">
                                Bloquear o KeyVault quando o computador ficar
                                inativo
                            </p>
                        </div>
                        <button
                            onClick={() => handleToggleSetting('autoLock')}
                            className={`
                                relative w-12 h-7 rounded-full transition-all duration-200
                                ${settings.autoLock ? 'bg-primary' : 'bg-white/20'}
                            `}
                        >
                            <div
                                className={`
                                    absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-200
                                    ${settings.autoLock ? 'left-6' : 'left-1'}
                                `}
                            />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                        <div>
                            <p className="text-sm font-medium text-foreground">
                                Limpar área de transferência
                            </p>
                            <p className="text-xs text-foreground/40">
                                Apagar senha copiada após 30 segundos
                            </p>
                        </div>
                        <button
                            onClick={() =>
                                handleToggleSetting('clearClipboard')
                            }
                            className={`
                                relative w-12 h-7 rounded-full transition-all duration-200
                                ${settings.clearClipboard ? 'bg-primary' : 'bg-white/20'}
                            `}
                        >
                            <div
                                className={`
                                    absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-200
                                    ${settings.clearClipboard ? 'left-6' : 'left-1'}
                                `}
                            />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                        <div>
                            <p className="text-sm font-medium text-foreground">
                                Mostrar senhas por padrão
                            </p>
                            <p className="text-xs text-foreground/40">
                                Exibir senhas sem necessidade de clicar em
                                revelar
                            </p>
                        </div>
                        <button
                            onClick={() =>
                                handleToggleSetting('showPasswordsByDefault')
                            }
                            className={`
                                relative w-12 h-7 rounded-full transition-all duration-200
                                ${settings.showPasswordsByDefault ? 'bg-primary' : 'bg-white/20'}
                            `}
                        >
                            <div
                                className={`
                                    absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-200
                                    ${settings.showPasswordsByDefault ? 'left-6' : 'left-1'}
                                `}
                            />
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mx-4">
                <div className="flex items-center gap-2 mb-4">
                    <Database className="w-5 h-5 text-foreground/40" />
                    <h2 className="text-sm font-semibold text-foreground/40 uppercase tracking-wider">
                        Dados
                    </h2>
                </div>
                <p className="text-xs text-foreground/40 mb-4">
                    Importe ou exporte suas credenciais.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                        onClick={() => setShowExportModal(true)}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                                <Download className="w-5 h-5 text-green-500" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-medium text-foreground">
                                    Exportar dados
                                </p>
                                <p className="text-xs text-foreground/40">
                                    Salve um backup criptografado
                                </p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-foreground/30" />
                    </button>

                    <button
                        onClick={() => setShowImportModal(true)}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <Upload className="w-5 h-5 text-blue-500" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-medium text-foreground">
                                    Importar dados
                                </p>
                                <p className="text-xs text-foreground/40">
                                    De 1Password, Bitwarden ou CSV
                                </p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-foreground/30" />
                    </button>
                </div>
            </div>

            <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mx-4">
                <div className="flex items-center gap-2 mb-4">
                    <Info className="w-5 h-5 text-foreground/40" />
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
                            2.1.0
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
                            PBKDF2-SHA256
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                        <span className="text-sm text-foreground/60">
                            Última sincronização
                        </span>
                        <span className="text-sm font-medium text-foreground flex items-center gap-1">
                            <RefreshCw className="w-3 h-3 text-green-500" />
                            Agora
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-error/5 border border-error/20 rounded-2xl p-6 mx-4 mb-4">
                <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-error" />
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
                            <Trash2 className="w-5 h-5 text-error" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-error">
                                Excluir conta
                            </p>
                            <p className="text-xs text-foreground/40">
                                Todos os dados serão permanentemente deletados
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="text-sm text-error font-medium hover:underline flex items-center gap-1"
                    >
                        Excluir
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {showExportModal && (
                <>
                    <div
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowExportModal(false)}
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="relative w-full max-w-md bg-background/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6 animate-in slide-in-from-bottom-4 duration-300">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center border-2 border-green-500/20">
                                    <Download className="w-8 h-8 text-green-500" />
                                </div>
                            </div>

                            <h2 className="text-xl font-bold text-foreground text-center mb-2">
                                Exportar dados
                            </h2>
                            <p className="text-foreground/60 text-sm text-center mb-4">
                                Seus dados serão exportados em um arquivo
                                criptografado. Você precisará da sua senha
                                mestre para abri-lo.
                            </p>

                            <div className="bg-white/5 rounded-xl p-3 mb-4 border border-white/10">
                                <div className="flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-foreground/40" />
                                    <p className="text-xs text-foreground/40">
                                        Arquivo protegido com AES-256-GCM
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    onClick={() => setShowExportModal(false)}
                                    variant="secondary"
                                    fullWidth
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={handleExport}
                                    fullWidth
                                    leftIcon={<Download className="w-5 h-5" />}
                                >
                                    Exportar
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {showImportModal && (
                <>
                    <div
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowImportModal(false)}
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="relative w-full max-w-md bg-background/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6 animate-in slide-in-from-bottom-4 duration-300">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center border-2 border-blue-500/20">
                                    <Upload className="w-8 h-8 text-blue-500" />
                                </div>
                            </div>

                            <h2 className="text-xl font-bold text-foreground text-center mb-2">
                                Importar dados
                            </h2>
                            <p className="text-foreground/60 text-sm text-center mb-4">
                                Importe suas credenciais de outros
                                gerenciadores. Formatos suportados: 1Password,
                                Bitwarden, CSV.
                            </p>

                            <div className="space-y-3 mb-4">
                                <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                            <Shield className="w-4 h-4 text-orange-500" />
                                        </div>
                                        <span className="text-sm text-foreground">
                                            1Password
                                        </span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-foreground/30" />
                                </button>
                                <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                            <Database className="w-4 h-4 text-blue-500" />
                                        </div>
                                        <span className="text-sm text-foreground">
                                            Bitwarden
                                        </span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-foreground/30" />
                                </button>
                                <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                                            <FileText className="w-4 h-4 text-green-500" />
                                        </div>
                                        <span className="text-sm text-foreground">
                                            Arquivo CSV
                                        </span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-foreground/30" />
                                </button>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    onClick={() => setShowImportModal(false)}
                                    variant="secondary"
                                    fullWidth
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={handleImport}
                                    fullWidth
                                    leftIcon={<Upload className="w-5 h-5" />}
                                >
                                    Importar
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {showDeleteModal && (
                <>
                    <div
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowDeleteModal(false)}
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="relative w-full max-w-md bg-background/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6 animate-in slide-in-from-bottom-4 duration-300">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center border-2 border-error/20">
                                    <AlertTriangle className="w-8 h-8 text-error" />
                                </div>
                            </div>

                            <h2 className="text-xl font-bold text-foreground text-center mb-2">
                                Excluir conta?
                            </h2>
                            <p className="text-foreground/60 text-sm text-center mb-4">
                                Esta ação é{' '}
                                <span className="text-error font-medium">
                                    irreversível
                                </span>
                                . Todos os seus dados serão permanentemente
                                deletados.
                            </p>

                            <div className="bg-error/10 border border-error/20 rounded-xl p-3 mb-4">
                                <div className="flex items-start gap-2">
                                    <AlertTriangle className="w-4 h-4 text-error shrink-0 mt-0.5" />
                                    <p className="text-xs text-error/80">
                                        Você perderá acesso a todas as suas
                                        credenciais. Certifique-se de ter um
                                        backup antes de prosseguir.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    onClick={() => setShowDeleteModal(false)}
                                    variant="secondary"
                                    fullWidth
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={handleDeleteAccount}
                                    variant="error"
                                    fullWidth
                                    leftIcon={<Trash2 className="w-5 h-5" />}
                                >
                                    Excluir conta
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
