'use client';

import React, { useState } from 'react';
import { Trash2, RotateCcw, Calendar, Clock } from 'lucide-react';
import { Credential } from '@/src/shared/types/credential';
import DeleteConfirmationModal from '../../layout/modals/credentialsModals/DeleteConfirmationModal';

interface DeletedCredentialCardProps {
    credential: Credential;
    onRestore?: (id: string) => void;
    onPermanentDelete?: (id: string) => void;
    onCopy?: (text: string) => void;
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const getDaysRemaining = (deletedAt: string) => {
    const deleted = new Date(deletedAt);
    const now = new Date();
    const diffTime =
        deleted.getTime() + 30 * 24 * 60 * 60 * 1000 - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

const getInitials = (title: string) => {
    return title
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
        'E-mail': 'from-blue-500 to-blue-600',
        Desenvolvimento: 'from-purple-500 to-purple-600',
        Streaming: 'from-error to-red-600',
        Música: 'from-green-500 to-green-600',
        Compras: 'from-orange-500 to-orange-600',
        'Redes Sociais': 'from-pink-500 to-pink-600',
        Finanças: 'from-emerald-500 to-emerald-600',
        Trabalho: 'from-indigo-500 to-indigo-600',
        Saúde: 'from-teal-500 to-teal-600',
        Educação: 'from-cyan-500 to-cyan-600',
    };
    return colors[category] || 'from-primary to-secondary';
};

const DeletedCredentialCard: React.FC<DeletedCredentialCardProps> = ({
    credential,
    onRestore,
    onPermanentDelete,
}) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const daysRemaining = getDaysRemaining(credential.updatedAt);
    const isExpiringSoon = daysRemaining <= 7;

    const handleRestore = () => {
        onRestore?.(credential.id);
    };

    const handlePermanentDelete = () => {
        setShowDeleteModal(true);
    };

    const confirmPermanentDelete = () => {
        onPermanentDelete?.(credential.id);
        setShowDeleteModal(false);
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
                                <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-foreground/30 shrink-0">
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
                                <Clock className="w-3 h-3" />
                                {formatDate(credential.updatedAt)}
                            </span>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleRestore}
                                className="cursor-pointer p-2 rounded-xl hover:bg-blue-500/10 text-foreground/40 hover:text-blue-500 transition-all"
                                title="Restaurar"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handlePermanentDelete}
                                className="cursor-pointer p-2 rounded-xl hover:bg-error/10 text-foreground/40 hover:text-error transition-all"
                                title="Excluir permanentemente"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-white/5 sm:hidden">
                    <div className="flex items-center gap-1 text-xs text-foreground/40">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(credential.updatedAt)}</span>
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

            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmPermanentDelete}
                credentialTitle={credential.title}
                isPermanent={true}
            />
        </>
    );
};

export default DeletedCredentialCard;
