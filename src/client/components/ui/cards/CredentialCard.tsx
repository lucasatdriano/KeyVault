'use client';

import React, { useState } from 'react';
import {
    Key,
    Star,
    MoreVertical,
    Trash2,
    Copy,
    Eye,
    EyeOff,
    Calendar,
    Mail,
    Phone,
    Shield,
} from 'lucide-react';
import { Credential } from '@/src/shared/types/credential';
import DeleteConfirmationModal from '../../layout/modals/credentialsModals/DeleteConfirmationModal';

interface CredentialCardProps {
    credential: Credential;
    onClick?: () => void;
    onEdit?: (credential: Credential) => void;
    onDelete?: (id: string) => void;
    onCopy?: (text: string) => void;
    onToggleFavorite?: (id: string) => void;
}

const CredentialCard: React.FC<CredentialCardProps> = ({
    credential,
    onClick,
    onDelete,
    onCopy,
    onToggleFavorite,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

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

    const getCategoryBadgeColor = (category: string) => {
        const colors: Record<string, string> = {
            'E-mail': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            Desenvolvimento:
                'bg-purple-500/20 text-purple-400 border-purple-500/30',
            Streaming: 'bg-error/20 text-red-400 border-error/30',
            Música: 'bg-green-500/20 text-green-400 border-green-500/30',
            Compras: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
            'Redes Sociais': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
            Finanças:
                'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
            Trabalho: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
            Saúde: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
            Educação: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
        };
        return (
            colors[category] || 'bg-primary/20 text-primary border-primary/30'
        );
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        onCopy?.(text);
    };

    const handleDelete = () => {
        setShowDeleteModal(true);
        setShowMenu(false);
    };

    const confirmDelete = () => {
        onDelete?.(credential.id);
        setShowDeleteModal(false);
    };

    const handleCardClick = () => {
        if (onClick) {
            onClick();
        }
    };

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleFavorite?.(credential.id);
    };

    const isFavorite = credential.favorite || false;

    return (
        <>
            <div
                className="bg-white/5 rounded-2xl border border-white/10 hover:border-primary/20 transition-all duration-200 p-5 group cursor-pointer relative"
                onClick={handleCardClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 min-w-0">
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
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-semibold text-foreground truncate">
                                    {credential.title}
                                </h3>

                                <button
                                    onClick={handleToggleFavorite}
                                    className={`
                                        transition-all duration-200 shrink-0
                                        ${
                                            isHovered || isFavorite
                                                ? 'opacity-100 scale-100'
                                                : 'opacity-0 scale-75'
                                        }
                                        hover:scale-110 active:scale-90
                                    `}
                                    aria-label={
                                        isFavorite
                                            ? 'Remover dos favoritos'
                                            : 'Adicionar aos favoritos'
                                    }
                                >
                                    <Star
                                        className={`
                                            w-4 h-4
                                            transition-all duration-200
                                            ${
                                                isFavorite
                                                    ? 'text-yellow-500 fill-yellow-500'
                                                    : 'text-foreground/30 hover:text-yellow-500'
                                            }
                                        `}
                                    />
                                </button>
                            </div>
                            <span
                                className={`
                                inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium
                                border ${getCategoryBadgeColor(credential.category)}
                            `}
                            >
                                {credential.category}
                            </span>
                        </div>
                    </div>

                    <div
                        className="relative shrink-0"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-1.5 rounded-lg hover:bg-white/5 text-foreground/40 hover:text-foreground transition-colors"
                        >
                            <MoreVertical className="w-5 h-5" />
                        </button>

                        {showMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowMenu(false)}
                                />
                                <div className="absolute right-0 mt-1 w-48 bg-background/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl z-50 py-1">
                                    <button
                                        onClick={() => {
                                            setShowMenu(false);
                                            onToggleFavorite?.(credential.id);
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground/70 hover:bg-white/5 transition-colors"
                                    >
                                        <Star
                                            className={`w-4 h-4 ${isFavorite ? 'text-yellow-500 fill-yellow-500' : ''}`}
                                        />
                                        {isFavorite
                                            ? 'Remover dos favoritos'
                                            : 'Adicionar aos favoritos'}
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-white/5 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Excluir
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    {(credential.email || credential.username) && (
                        <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-foreground/30 shrink-0" />
                            <span className="text-foreground/70 truncate">
                                {credential.email || credential.username}
                            </span>
                        </div>
                    )}

                    {credential.phone && (
                        <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-foreground/30 shrink-0" />
                            <span className="text-foreground/70 truncate">
                                {credential.phone}
                            </span>
                        </div>
                    )}

                    {credential.password && (
                        <div className="flex items-center gap-2 text-sm">
                            <Key className="w-4 h-4 text-foreground/30 shrink-0" />
                            <span className="text-foreground/70 font-mono">
                                {showPassword
                                    ? credential.password
                                    : '**********'}
                            </span>
                            <div className="flex items-center gap-1 ml-auto">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowPassword(!showPassword);
                                    }}
                                    className="p-1 rounded hover:bg-white/5 text-foreground/30 hover:text-foreground/60 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCopy(credential.password!);
                                    }}
                                    className="p-1 rounded hover:bg-white/5 text-foreground/30 hover:text-foreground/60 transition-colors"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1 text-foreground/40">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{credential.createdAt}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5 text-green-500" />
                        <span className="text-[10px] text-foreground/30">
                            Seguro
                        </span>
                    </div>
                </div>
            </div>

            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                credentialTitle={credential.title}
            />
        </>
    );
};

export default CredentialCard;
