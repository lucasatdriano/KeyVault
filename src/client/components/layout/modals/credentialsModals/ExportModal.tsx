'use client';

import {
    DownloadIcon,
    LockIcon,
    ShieldAlertIcon,
    HelpCircleIcon,
} from 'lucide-react';

import Button from '@/src/client/components/ui/buttons/Button';
import Tooltip from '@/src/client/components/ui/tooltips/Tooltip';
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
                <div className="flex items-center gap-2">
                    <p className="text-sm text-foreground/60">
                        Suas credenciais serão exportadas para um arquivo JSON.
                        O conteúdo será descriptografado localmente antes da
                        exportação.
                    </p>

                    <Tooltip
                        content={
                            <>
                                <p className="font-semibold mb-2 text-foreground">
                                    Formato do arquivo JSON exportado:
                                </p>

                                <div className="bg-black/40 p-3 rounded-md overflow-x-auto max-h-60 overflow-y-auto">
                                    <pre className="font-mono text-green-400 whitespace-pre">
                                        {`{
  "version": 1,
  "exportedAt": "2026-01-01T00:00:00.000Z",
  "credentials": [
    {
      "title": "Exemplo",
      "username": "usuario",
      "email": "email@exemplo.com",
      "password": "senha123",
      "url": "https://exemplo.com",
      "notes": "Anotações",
      "category": "Categoria",
      "favorite": false
    }
  ]
}`}
                                    </pre>
                                </div>

                                <div className="mt-3 pt-2 text-xs border-t border-white/10 text-foreground/50">
                                    <span className="font-medium text-foreground/70">
                                        Campos opcionais:
                                    </span>{' '}
                                    username, email, url, notes
                                </div>

                                <div className="mt-2 text-xs text-yellow-500/70">
                                    <span className="font-medium">
                                        ⚠️ Atenção:
                                    </span>{' '}
                                    O arquivo contém dados descriptografados.
                                </div>
                            </>
                        }
                        position="bottom"
                    >
                        <button
                            type="button"
                            className="cursor-pointer text-foreground/30 hover:text-foreground/60 transition-colors"
                            aria-label="Ver formato do arquivo"
                        >
                            <HelpCircleIcon className="h-4 w-4" />
                        </button>
                    </Tooltip>
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
                    >
                        {isExporting ? 'Exportando...' : 'Exportar'}
                    </Button>
                </div>
            </div>
        </ModalBase>
    );
}
