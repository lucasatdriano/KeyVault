'use client';

import { useState } from 'react';
import {
    ActivityIcon,
    CalendarIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    DownloadIcon,
    RefreshCwIcon,
} from 'lucide-react';

import AuditEventCard from './AuditEventCard';

import { AuditLog } from '@/src/client/types/audit';
import { formatDate } from '@/src/client/utils/formatters/date';
import { groupAuditLogs } from '@/src/client/utils/audit/audit.utils';

interface AuditCardProps {
    logs: AuditLog[];
    onExport?: () => void;
    onRefresh?: () => void;
}

export default function AuditCard({
    logs,
    onExport,
    onRefresh,
}: AuditCardProps) {
    const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>(
        {},
    );

    const groupedLogs = groupAuditLogs(logs);

    const totalEvents = logs.length;

    const uniqueDevices = new Set(logs.map((log) => `${log.os}-${log.device}`))
        .size;

    const toggleDateExpansion = (date: string) => {
        setExpandedDates((prev) => ({
            ...prev,
            [date]: !prev[date],
        }));
    };

    if (!logs.length) {
        return (
            <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/5">
                    <ActivityIcon className="h-10 w-10 text-foreground/20" />
                </div>

                <h3 className="mb-2 text-lg font-semibold text-foreground">
                    Nenhum evento encontrado
                </h3>

                <p className="mx-auto max-w-sm text-sm text-foreground/40">
                    Não há registros de atividade para os filtros selecionados.
                </p>
            </div>
        );
    }

    return (
        <div className="mx-4 space-y-4">
            <div className="flex items-center justify-between px-1">
                <span className="text-xs text-foreground/40">
                    {totalEvents} {totalEvents === 1 ? 'evento' : 'eventos'} ·{' '}
                    {uniqueDevices} dispositivos
                </span>

                <div className="flex items-center gap-1">
                    {onExport && (
                        <button
                            onClick={onExport}
                            title="Exportar"
                            className="cursor-pointer rounded-lg p-1.5 text-foreground/40 transition-colors hover:bg-white/5 hover:text-foreground"
                        >
                            <DownloadIcon className="h-4 w-4" />
                        </button>
                    )}

                    {onRefresh && (
                        <button
                            onClick={onRefresh}
                            title="Atualizar"
                            className="cursor-pointer rounded-lg p-1.5 text-foreground/40 transition-colors hover:bg-white/5 hover:text-foreground"
                        >
                            <RefreshCwIcon className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            {groupedLogs.map(({ date, logs }) => {
                const isExpanded = expandedDates[date] ?? true;

                return (
                    <section
                        key={date}
                        className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                    >
                        <button
                            onClick={() => toggleDateExpansion(date)}
                            className="flex w-full items-center justify-between p-4 transition-colors hover:bg-white/5"
                        >
                            <div className="flex items-center gap-3">
                                <CalendarIcon className="h-5 w-5 text-foreground/40" />

                                <span className="text-sm font-semibold text-foreground">
                                    {formatDate(date)}
                                </span>

                                <span className="text-xs text-foreground/40">
                                    {logs.length}{' '}
                                    {logs.length === 1 ? 'evento' : 'eventos'}
                                </span>
                            </div>

                            {isExpanded ? (
                                <ChevronDownIcon className="cursor-pointer h-4 w-4 text-foreground/30" />
                            ) : (
                                <ChevronUpIcon className="cursor-pointer h-4 w-4 text-foreground/30" />
                            )}
                        </button>

                        {isExpanded && (
                            <div className="divide-y divide-white/5">
                                {logs.map((log) => (
                                    <AuditEventCard key={log.id} log={log} />
                                ))}
                            </div>
                        )}
                    </section>
                );
            })}
        </div>
    );
}
