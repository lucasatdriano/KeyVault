'use client';

import { ClockIcon, MapPinIcon, MonitorIcon } from 'lucide-react';

import { AuditLog } from '@/src/client/types/audit';

import {
    auditEventConfig,
    defaultAuditEvent,
} from '@/src/app/(protected)/account/audit/components/Audit-event.config';

interface AuditEventCardProps {
    log: AuditLog;
}

export default function AuditEventCard({ log }: AuditEventCardProps) {
    const config = auditEventConfig[log.type] ?? defaultAuditEvent;

    const Icon = config.icon;

    return (
        <div className="flex flex-col gap-3 p-4 transition-colors hover:bg-white/5 md:flex-row md:items-center">
            <div className="flex min-w-0 flex-1 items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
                    <Icon className={`h-4 w-4 ${config.iconClass}`} />
                </div>

                <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                        {log.event}
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-foreground/40">
                        <span className="flex items-center gap-1">
                            <MonitorIcon className="h-3 w-3" />
                            {log.device}
                        </span>

                        <span className="flex items-center gap-1">
                            <MapPinIcon className="h-3 w-3" />
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

            <div className="flex shrink-0 items-center gap-3 md:flex-col md:items-end">
                <span className="flex items-center gap-1 font-mono text-sm text-foreground/40">
                    <ClockIcon className="h-3 w-3 md:hidden" />
                    {log.time}
                </span>

                <span
                    className={`text-xs rounded-full border px-2 py-0.5 font-medium ${config.badgeClass}`}
                >
                    {config.label}
                </span>
            </div>
        </div>
    );
}
