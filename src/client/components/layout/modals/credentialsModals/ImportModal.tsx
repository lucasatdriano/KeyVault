'use client';

import { useRef } from 'react';
import { DatabaseIcon, FileTextIcon, UploadIcon } from 'lucide-react';

import Button from '@/src/client/components/ui/buttons/Button';
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
                <div>
                    <p className="text-sm text-foreground/60">
                        Selecione um arquivo de exportação do KeyVault para
                        importar suas credenciais.
                    </p>
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
                        leftIcon={
                            !isImporting ? (
                                <UploadIcon className="w-5 h-5" />
                            ) : undefined
                        }
                    >
                        {isImporting ? 'Importando...' : 'Selecionar arquivo'}
                    </Button>
                </div>
            </div>
        </ModalBase>
    );
}
