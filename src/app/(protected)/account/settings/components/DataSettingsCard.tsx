'use client';

import {
    DatabaseIcon,
    DownloadIcon,
    UploadIcon,
    ChevronRightIcon,
} from 'lucide-react';

interface DataSettingsCardProps {
    onExportClick: () => void;
    onImportClick: () => void;
}

export default function DataSettingsCard({
    onExportClick,
    onImportClick,
}: DataSettingsCardProps) {
    return (
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
                    onClick={onExportClick}
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
                    onClick={onImportClick}
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
    );
}
