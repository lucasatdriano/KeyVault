'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Shield } from 'lucide-react';

import Header from '@/src/client/components/layout/header/Header';
import AuditCard, {
    AuditLog,
} from '@/src/client/components/ui/cards/AuditCard';

import { getUserLogsAction } from '@/src/server/actions/audit/get-user-logs.action';
import { mapAuditLog } from '@/src/client/utils/audit.mapper';

export default function AuditPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const initialLoadDone = useRef(false);

    const loadLogs = useCallback(async () => {
        setLoading(true);

        const result = await getUserLogsAction({
            page: 1,
            limit: 20,
        });

        if (result.success && result.data) {
            setLogs(result.data.data.map(mapAuditLog));
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        if (!initialLoadDone.current) {
            initialLoadDone.current = true;
            loadLogs();
        }
    }, [loadLogs]);

    const handleRefresh = async () => {
        await loadLogs();
    };

    const handleExport = () => {
        console.log('Exportando logs...');
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <Header variant="audit" />

                <div className="mx-4 rounded-xl border border-white/10 bg-white/5 p-8 text-center text-foreground/60">
                    Carregando histórico...
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Header variant="audit" />

            <AuditCard
                logs={logs}
                onRefresh={handleRefresh}
                onExport={handleExport}
            />

            <div className="mx-4 mb-4 rounded-xl border border-white/5 bg-white/5 p-4">
                <div className="flex items-start gap-3">
                    <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary/60" />

                    <div>
                        <p className="text-sm text-foreground/60">
                            <span className="font-medium text-foreground/80">
                                Retenção de logs:
                            </span>{' '}
                            Eventos de login e logout são removidos após 120
                            dias. Demais eventos permanecem para manter o
                            histórico da conta.
                        </p>

                        <p className="mt-1 text-xs text-foreground/30">
                            Última atualização:{' '}
                            {new Date().toLocaleString('pt-BR')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
