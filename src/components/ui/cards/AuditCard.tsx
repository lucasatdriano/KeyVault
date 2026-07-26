'use client';

import React, { useState } from 'react';
import {
    Activity,
    LogIn,
    LogOut,
    Key,
    Plus,
    Edit,
    Trash2,
    Monitor,
    MapPin,
    Calendar,
    ChevronDown,
    ChevronUp,
    Clock,
    RefreshCwIcon,
    DownloadIcon,
} from 'lucide-react';

export interface AuditLog {
    id: string;
    date: string;
    time: string;
    event: string;
    device: string;
    ip: string;
    type:
        | 'login'
        | 'logout'
        | 'create'
        | 'edit'
        | 'delete'
        | 'password'
        | 'device';
    details?: string;
}

interface AuditCardProps {
    logs: AuditLog[];
    onExport?: () => void;
    onRefresh?: () => void;
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date
        .toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        })
        .toUpperCase();
};

const getEventIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
        login: <LogIn className="w-4 h-4 text-green-500" />,
        logout: <LogOut className="w-4 h-4 text-orange-500" />,
        create: <Plus className="w-4 h-4 text-blue-500" />,
        edit: <Edit className="w-4 h-4 text-yellow-500" />,
        delete: <Trash2 className="w-4 h-4 text-red-500" />,
        password: <Key className="w-4 h-4 text-purple-500" />,
        device: <Monitor className="w-4 h-4 text-cyan-500" />,
    };
    return icons[type] || <Activity className="w-4 h-4 text-foreground/40" />;
};

const getEventBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
        login: 'bg-green-500/20 text-green-500 border-green-500/30',
        logout: 'bg-orange-500/20 text-orange-500 border-orange-500/30',
        create: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
        edit: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
        delete: 'bg-red-500/20 text-red-500 border-red-500/30',
        password: 'bg-purple-500/20 text-purple-500 border-purple-500/30',
        device: 'bg-cyan-500/20 text-cyan-500 border-cyan-500/30',
    };
    return colors[type] || 'bg-white/5 text-foreground/40 border-white/10';
};

const getEventDisplayName = (type: string) => {
    const names: Record<string, string> = {
        login: 'Login',
        logout: 'Logout',
        create: 'Nova senha',
        edit: 'Edição',
        delete: 'Exclusão',
        password: 'Senha',
        device: 'Dispositivo',
    };
    return names[type] || 'Atividade';
};

const AuditCard: React.FC<AuditCardProps> = ({ logs, onExport, onRefresh }) => {
    const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>(
        {},
    );

    const groupByDate = (items: AuditLog[]) => {
        const groups: Record<string, AuditLog[]> = {};
        items.forEach((log) => {
            if (!groups[log.date]) {
                groups[log.date] = [];
            }
            groups[log.date].push(log);
        });
        return groups;
    };

    const groupedLogs = groupByDate(logs);
    const sortedDates = Object.keys(groupedLogs).sort((a, b) =>
        b.localeCompare(a),
    );

    const toggleDateExpansion = (date: string) => {
        setExpandedDates((prev) => ({
            ...prev,
            [date]: !prev[date],
        }));
    };

    const totalEvents = logs.length;
    const uniqueDevices = new Set(logs.map((l) => l.device)).size;

    if (logs.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-10 h-10 text-foreground/20" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                    Nenhum evento encontrado
                </h3>
                <p className="text-foreground/40 text-sm max-w-sm mx-auto">
                    Não há registros de atividade para os filtros selecionados.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4 mx-4">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                    <span className="text-xs text-foreground/40">
                        {totalEvents} {totalEvents === 1 ? 'evento' : 'eventos'}{' '}
                        · {uniqueDevices} dispositivos
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    {onExport && (
                        <button
                            onClick={onExport}
                            className="p-1.5 rounded-lg hover:bg-white/5 text-foreground/40 hover:text-foreground transition-colors"
                            title="Exportar"
                        >
                            <DownloadIcon className="w-4 h-4" />
                        </button>
                    )}
                    {onRefresh && (
                        <button
                            onClick={onRefresh}
                            className="p-1.5 rounded-lg hover:bg-white/5 text-foreground/40 hover:text-foreground transition-colors"
                            title="Atualizar"
                        >
                            <RefreshCwIcon className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {sortedDates.map((date) => {
                const items = groupedLogs[date];
                const isExpanded =
                    expandedDates[date] !== undefined
                        ? expandedDates[date]
                        : true;

                return (
                    <div
                        key={date}
                        className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden"
                    >
                        <button
                            onClick={() => toggleDateExpansion(date)}
                            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-foreground/40" />
                                <span className="text-sm font-semibold text-foreground">
                                    {formatDate(date)}
                                </span>
                                <span className="text-xs text-foreground/40">
                                    {items.length}{' '}
                                    {items.length === 1 ? 'evento' : 'eventos'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-foreground/30">
                                    {isExpanded ? (
                                        <ChevronDown className="w-4 h-4" />
                                    ) : (
                                        <ChevronUp className="w-4 h-4" />
                                    )}
                                </span>
                            </div>
                        </button>

                        {isExpanded && (
                            <div className="divide-y divide-white/5">
                                {items.map((log) => (
                                    <div
                                        key={log.id}
                                        className="flex flex-col md:flex-row md:items-center gap-3 p-4 hover:bg-white/5 transition-colors"
                                    >
                                        <div className="flex items-start gap-3 flex-1 min-w-0">
                                            <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                                                {getEventIcon(log.type)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-foreground">
                                                    {log.event}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-foreground/40">
                                                    <span className="flex items-center gap-1">
                                                        <Monitor className="w-3 h-3" />
                                                        {log.device}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {log.ip}
                                                    </span>
                                                    {log.details && (
                                                        <span className="text-foreground/30">
                                                            · {log.details}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0 md:flex-col md:items-end">
                                            <span className="text-sm font-mono text-foreground/40 flex items-center gap-1">
                                                <Clock className="w-3 h-3 md:hidden" />
                                                {log.time}
                                            </span>
                                            <span
                                                className={`
                                                    px-2 py-0.5 rounded-full text-[10px] font-medium border
                                                    ${getEventBadgeColor(log.type)}
                                                `}
                                            >
                                                {getEventDisplayName(log.type)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default AuditCard;
