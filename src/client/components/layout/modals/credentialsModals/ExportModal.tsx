'use client';

import { DownloadIcon, LockIcon, ShieldAlertIcon } from 'lucide-react';

import Button from '@/src/client/components/ui/buttons/Button';
import ModalBase from '@/src/client/components/layout/modals/ModalBase';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExport: () => Promise<boolean>;
    isExporting?: boolean;
}

export default function ExportModal({
    isOpen,
    onClose,
    onExport,
    isExporting = false,
}: ExportModalProps) {
    const handleExport = async () => {
        await onExport();
    };

    return (
        <ModalBase
            isOpen={isOpen}
            onClose={onClose}
            title="Exportar dados"
            icon={<DownloadIcon className="h-5 w-5 text-green-500" />}
            maxWidth="md"
            canClose={!isExporting}
        >
            <div className="space-y-5">
                <div>
                    <p className="text-sm text-foreground/60">
                        Suas credenciais serão exportadas para um arquivo JSON.
                        O conteúdo será descriptografado localmente antes da
                        exportação.
                    </p>
                </div>

                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="flex items-start gap-2">
                        <LockIcon className="w-4 h-4 text-foreground/40 shrink-0 mt-0.5" />

                        <p className="text-xs text-foreground/40">
                            Os dados são descriptografados localmente usando sua
                            Vault Key. O servidor não recebe as credenciais em
                            texto puro.
                        </p>
                    </div>
                </div>

                <div className="bg-error/10 border border-error/20 rounded-xl p-3">
                    <div className="flex items-start gap-2">
                        <ShieldAlertIcon className="w-4 h-4 text-error shrink-0 mt-0.5" />

                        <p className="text-xs text-error/80">
                            <span className="font-medium">Atenção:</span> o
                            arquivo exportado conterá suas credenciais em
                            formato descriptografado, incluindo suas senhas.
                            Armazene-o em um local seguro e exclua o arquivo
                            após o uso.
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button
                        onClick={onClose}
                        variant="secondary"
                        fullWidth
                        disabled={isExporting}
                    >
                        Cancelar
                    </Button>

                    <Button
                        onClick={handleExport}
                        fullWidth
                        disabled={isExporting}
                        isLoading={isExporting}
                        loadingText="Exportando..."
                        leftIcon={
                            !isExporting ? (
                                <DownloadIcon className="w-5 h-5" />
                            ) : undefined
                        }
                    >
                        {isExporting ? 'Exportando...' : 'Exportar'}
                    </Button>
                </div>
            </div>
        </ModalBase>
    );
}
