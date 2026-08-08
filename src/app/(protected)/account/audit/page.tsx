/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useCallback, useEffect, useState } from 'react';
import { ShieldIcon } from 'lucide-react';

import { AuditAction } from '@/src/generated/prisma/enums';

import { getUserLogsAction } from '@/src/server/actions/audit/get-user-logs.action';

import { generateResourceSearchHash } from '@/src/shared/crypto/resource-search';
import { decryptString } from '@/src/shared/crypto/cipher';

import { mapAuditSearch } from '@/src/client/utils/audit/audit-search.mapper';
import { AuditLog } from '@/src/client/types/audit';
import { mapAuditLog } from '@/src/client/utils/audit/audit.mapper';
import { useVaultStore } from '@/src/client/store/vault.store';
import { usePagination } from '@/src/client/hooks/ui/usePagination';

import Header from '@/src/client/components/layout/header/Header';
import AuditCard from './components/AuditCard';
import Pagination from '@/src/client/components/layout/pagination/Pagination';
import InfoCard from '@/src/client/components/ui/cards/InfoCard';

export default function AuditPage() {
    const pagination = usePagination({
        initialPage: 1,
        initialItemsPerPage: 20,
    });
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const vaultKey = useVaultStore((state) => state.vaultKey);
    const [search, setSearch] = useState('');
    const [action, setAction] = useState('');
    const [loading, setLoading] = useState(true);

    const loadLogs = useCallback(
        async (page: number = pagination.currentPage) => {
            setLoading(true);

            const mapped = mapAuditSearch(search);

            let resourceSearchHash: string | undefined;

            if (mapped.resourceName && vaultKey) {
                resourceSearchHash = await generateResourceSearchHash(
                    mapped.resourceName,
                    vaultKey,
                );
            }

            const result = await getUserLogsAction({
                page,
                limit: pagination.itemsPerPage,
                action: action ? (action as AuditAction) : undefined,
                resourceSearchHash,
            });

            if (result.success && result.data) {
                pagination.setTotalItems(result.data.total);

                const decryptedLogs = await Promise.all(
                    result.data.data.map(async (log) => {
                        let resource = null;

                        if (log.credential && vaultKey) {
                            const json = await decryptString(
                                {
                                    cipherText: log.credential.cipherText,
                                    iv: log.credential.iv,
                                },
                                vaultKey,
                            );

                            const credential = JSON.parse(json);
                            resource = credential.title;
                        }

                        return mapAuditLog({
                            ...log,
                            resource,
                        });
                    }),
                );

                setLogs(decryptedLogs);
            }

            setLoading(false);
        },
        [search, action, vaultKey, pagination],
    );

    const handlePageChange = useCallback(
        (page: number) => {
            pagination.goToPage(page);
            loadLogs(page);
        },
        [pagination, loadLogs],
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            pagination.resetPagination();
            loadLogs(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [search, action, pagination, loadLogs]);

    useEffect(() => {
        loadLogs(1);
    }, [loadLogs]);

    if (loading && logs.length === 0) {
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
                onRefresh={() => loadLogs(pagination.currentPage)}
                onExport={() => console.log('Exportando logs...')}
            />

            {!loading && logs.length > 0 && (
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalItems}
                    itemsPerPage={pagination.itemsPerPage}
                    onPageChange={handlePageChange}
                />
            )}

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
