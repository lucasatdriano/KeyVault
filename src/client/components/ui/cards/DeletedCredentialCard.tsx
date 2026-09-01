'use client';

import { useState } from 'react';
import { RotateCcwIcon, CalendarIcon, ClockIcon } from 'lucide-react';

import { Credential } from '@/src/shared/types/credential';

import { getInitials } from '@/src/client/utils/credentials/credential-avatar';
import {
    getCategoryBadgeColor,
    getCategoryColor,
} from '@/src/client/utils/credentials/credential-category';
import {
    formatDateTime,
    getDaysRemaining,
} from '@/src/client/utils/formatters/date';

interface DeletedCredentialCardProps {
    credential: Credential;
    onRestore?: (id: string) => void;
    onPermanentDelete?: (id: string) => void;
    onCopy?: (text: string) => void;
}

export default function DeletedCredentialCard({
    credential,
    onRestore,
}: DeletedCredentialCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    const daysRemaining = getDaysRemaining(credential.updatedAt);
    const isExpiringSoon = daysRemaining <= 7;

    const handleRestore = () => {
        onRestore?.(credential.id);
    };

    return (
        <>
            <div
                className="bg-white/5 rounded-2xl border border-white/10 hover:border-error/20 transition-all p-4 group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4 min-w-0">
                        <div
                            className={`
                            w-12 h-12 rounded-xl flex items-center justify-center shrink-0
                            bg-linear-to-br ${getCategoryColor(credential.category)}
                            shadow-lg shadow-primary/10
                        `}
                        >
                            <span className="text-white font-bold text-sm">
                                {getInitials(credential.title)}
                            </span>
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-base font-semibold text-foreground truncate">
                                {credential.title}
                            </h3>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-foreground/40 truncate">
                                    {credential.email || credential.username}
                                </span>
                                <span
                                    className={`text-xs px-2 py-0.5 rounded-full text-foreground/30 shrink-0 ${getCategoryBadgeColor(credential.category)}`}
                                >
                                    {credential.category}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="hidden sm:flex flex-col items-end">
                            <div
                                className={`
                                text-xs font-medium px-2 py-1 rounded-lg transition-all
                                ${
                                    isExpiringSoon
                                        ? 'bg-error/20 text-red-400'
                                        : 'bg-white/5 text-foreground/40'
                                }
                                ${isHovered ? 'scale-105' : ''}
                            `}
                            >
                                {daysRemaining > 0
                                    ? `${daysRemaining} dias restantes`
                                    : 'Expirou'}
                            </div>
                            <span className="text-[10px] text-foreground/20 mt-0.5 flex items-center gap-1">
                                <ClockIcon className="w-3 h-3" />
                                {formatDateTime(credential.updatedAt)}
                            </span>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleRestore}
                                className="cursor-pointer p-2 rounded-xl hover:bg-blue-500/10 text-foreground/40 hover:text-blue-500 transition-all"
                                title="Restaurar"
                            >
                                <RotateCcwIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-white/5 sm:hidden">
                    <div className="flex items-center gap-1 text-xs text-foreground/40">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span>{formatDateTime(credential.updatedAt)}</span>
                    </div>
                    <div
                        className={`
                        text-xs font-medium px-2 py-0.5 rounded-full
                        ${
                            isExpiringSoon
                                ? 'bg-error/20 text-red-400'
                                : 'bg-white/5 text-foreground/40'
                        }
                    `}
                    >
                        {daysRemaining > 0
                            ? `${daysRemaining} dias restantes`
                            : 'Expirou'}
                    </div>
                </div>
            </div>
        </>
    );
}
