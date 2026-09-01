'use client';

import { useRef } from 'react';
import {
    DatabaseIcon,
    FileTextIcon,
    UploadIcon,
    HelpCircleIcon,
} from 'lucide-react';

import Button from '@/src/client/components/ui/buttons/Button';
import Tooltip from '@/src/client/components/ui/tooltips/Tooltip';
import ModalBase from '@/src/client/components/layout/modals/ModalBase';

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (file: File) => Promise<boolean>;
    isImporting?: boolean;
}

export default function ImportModal({
    isOpen,
    onClose,
    onImport,
    isImporting = false,
}: ImportModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSelectFile = () => {
        if (isImporting) return;

        fileInputRef.current?.click();
    };

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        await onImport(file);

        event.target.value = '';
    };

    return (
        <ModalBase
            isOpen={isOpen}
            onClose={onClose}
            title="Importar dados"
            icon={<UploadIcon className="h-5 w-5 text-blue-500" />}
            maxWidth="md"
            canClose={!isImporting}
        >
            <div className="space-y-5">
                <div className="flex items-center gap-2">
                    <p className="text-sm text-foreground/60">
                        Selecione um arquivo de exportação do KeyVault para
                        importar suas credenciais.
                    </p>

                    <Tooltip
                        content={
                            <>
                                <p className="font-semibold mb-2 text-foreground">
                                    Formato do arquivo JSON:
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

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isImporting}
                />

                <div className="space-y-3">
                    <div className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <DatabaseIcon className="w-4 h-4 text-blue-500" />
                        </div>

                        <div>
                            <p className="text-sm text-foreground">
                                Backup do KeyVault
                            </p>

                            <p className="text-xs text-foreground/40">
                                Arquivo JSON de exportação
                            </p>
                        </div>
                    </div>

                    <div className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                        <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                            <FileTextIcon className="w-4 h-4 text-green-500" />
                        </div>

                        <div>
                            <p className="text-sm text-foreground">
                                Formato suportado
                            </p>

                            <p className="text-xs text-foreground/40">
                                JSON (.json)
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3">
                    <p className="text-xs text-yellow-500/80">
                        Importe apenas arquivos do KeyVault em que você confia.
                        As credenciais serão criptografadas novamente com a sua
                        Vault Key antes de serem salvas.
                    </p>
                </div>

                <div className="flex gap-3">
                    <Button
                        onClick={onClose}
                        variant="secondary"
                        fullWidth
                        disabled={isImporting}
                    >
                        Cancelar
                    </Button>

                    <Button
                        onClick={handleSelectFile}
                        fullWidth
                        disabled={isImporting}
                        isLoading={isImporting}
                        loadingText="Importando..."
                    >
                        {isImporting ? 'Importando...' : 'Selecionar Arquivo'}
                    </Button>
                </div>
            </div>
        </ModalBase>
    );
}
