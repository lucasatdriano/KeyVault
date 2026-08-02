'use client';

import { useCallback, useEffect, useState } from 'react';
import { ShieldIcon } from 'lucide-react';

import Header from '@/src/client/components/layout/header/Header';
import AuditCard from './components/AuditCard';

import { AuditLog } from '@/src/client/types/audit';
import { mapAuditLog } from '@/src/client/utils/audit/audit.mapper';

import { getUserLogsAction } from '@/src/server/actions/audit/get-user-logs.action';
import InfoCard from '@/src/client/components/ui/cards/InfoCard';
import { AuditAction } from '@/src/generated/prisma/enums';

export default function AuditPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [search, setSearch] = useState('');
    const [action, setAction] = useState('');
    const [loading, setLoading] = useState(true);

    const loadLogs = useCallback(async () => {
        setLoading(true);

        const result = await getUserLogsAction({
            page: 1,
            limit: 20,
            action: action ? (action as AuditAction) : undefined,
            search: search || undefined,
        });

        if (result.success && result.data) {
            setLogs(result.data.data.map(mapAuditLog));
        }

        setLoading(false);
    }, [search, action]);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadLogs();
        }, 500);

        return () => clearTimeout(timer);
    }, [loadLogs]);

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
            <Header
                variant="audit"
                onSearch={setSearch}
                onFilterChange={setAction}
            />

            <AuditCard
                logs={logs}
                onRefresh={loadLogs}
                onExport={() => console.log('Exportando logs...')}
            />

            <InfoCard
                icon={ShieldIcon}
                footer={
                    <>
                        Última atualização: {new Date().toLocaleString('pt-BR')}
                    </>
                }
            >
                <>
                    <span className="font-medium text-foreground/80">
                        Retenção de logs:
                    </span>{' '}
                    Eventos de login e logout são removidos após 120 dias.
                    Demais eventos permanecem para manter o histórico da conta.
                </>
            </InfoCard>
        </div>
    );
}
