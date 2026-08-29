'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { ShieldIcon } from 'lucide-react';

import { AuditAction } from '@/src/generated/prisma/enums';

import { getUserLogsAction } from '@/src/server/actions/audit/get-user-logs.action';

import { generateResourceSearchHash } from '@/src/shared/crypto/resource-search';

import { ACTION_MAP } from '@/src/client/constants/actionAudit';
import { useVaultStore } from '@/src/client/store/vault.store';
import { usePagination } from '@/src/client/hooks/ui/usePagination';
import { mapAuditSearch } from '@/src/client/utils/audit/audit-search.mapper';
import { decryptAuditLogs } from '@/src/client/utils/audit/audit-decryption';
import { AuditLog } from '@/src/client/types/audit';

import InfoCard from '@/src/client/components/ui/cards/InfoCard';
import Header from '@/src/client/components/layout/header/Header';
import Pagination from '@/src/client/components/layout/pagination/Pagination';

import AuditCard from '@/src/app/(protected)/account/audit/components/AuditCard';

export default function AuditPage() {
    const pagination = usePagination({
        initialPage: 1,
        initialItemsPerPage: 20,
    });
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [search, setSearch] = useState('');
    const [action, setAction] = useState('');
    const [loading, setLoading] = useState(true);

    const isMounted = useRef(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const searchRef = useRef(search);
    const actionRef = useRef(action);

    const vaultKey = useVaultStore((state) => state.vaultKey);

    useEffect(() => {
        searchRef.current = search;
    }, [search]);

    useEffect(() => {
        actionRef.current = action;
    }, [action]);

    const loadLogs = useCallback(
        async (page: number) => {
            setLoading(true);

            if (!vaultKey) {
                setLoading(false);
                return;
            }

            try {
                const mapped = mapAuditSearch(searchRef.current);

                let resourceSearchHash: string | undefined;
                let selectedAction: AuditAction | undefined;

                if (mapped.resourceName) {
                    resourceSearchHash = await generateResourceSearchHash(
                        mapped.resourceName,
                        vaultKey,
                    );
                } else {
                    const searchTermLower = searchRef.current
                        .trim()
                        .toLowerCase();
                    const mappedAction = ACTION_MAP[searchTermLower];

                    if (mappedAction) {
                        selectedAction = mappedAction;
                    }
                }

                if (actionRef.current) {
                    selectedAction = ACTION_MAP[actionRef.current];
                }

                const result = await getUserLogsAction({
                    page,
                    limit: pagination.itemsPerPage,
                    action: selectedAction,
                    resourceSearchHash,
                });

                if (result.success && result.data) {
                    pagination.setTotalItems(result.data.total);

                    const decryptedLogs = await decryptAuditLogs({
                        logs: result.data.data,
                        vaultKey,
                    });

                    setLogs(decryptedLogs);
                }
            } catch (error) {
                console.error('Erro ao carregar logs:', error);
            } finally {
                setLoading(false);
            }
        },
        [vaultKey, pagination],
    );

    const handlePageChange = useCallback(
        (page: number) => {
            pagination.goToPage(page);
            loadLogs(page);
        },
        [pagination, loadLogs],
    );

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            loadLogs(1);
            return;
        }

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        pagination.resetPagination();

        timeoutRef.current = setTimeout(() => {
            loadLogs(1);
        }, 500);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, action]);

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
                selectedCategory={action}
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
