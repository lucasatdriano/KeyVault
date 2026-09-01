'use client';

import React, { useEffect, useState } from 'react';
import {
    KeyIcon,
    StarIcon,
    MoreVerticalIcon,
    Trash2Icon,
    CopyIcon,
    EyeIcon,
    EyeOffIcon,
    CalendarIcon,
    MailIcon,
    ShieldIcon,
} from 'lucide-react';

import { Credential } from '@/src/shared/types/credential';

import { useSettingsStore } from '@/src/client/store/settings.store';
import {
    getCategoryBadgeColor,
    getCategoryColor,
} from '@/src/client/utils/credentials/credential-category';
import { getInitials } from '@/src/client/utils/credentials/credential-avatar';

import DeleteConfirmationModal from '@/src/client/components/layout/modals/credentialsModals/DeleteCredentialModal';

interface CredentialCardProps {
    credential: Credential;
    onClick?: () => void;
    onEdit?: (credential: Credential) => void;
    onDelete?: (credential: Credential) => Promise<void>;
    onCopy?: (text: string, id: string) => void;
    onToggleFavorite?: (id: string) => void;
}

export default function CredentialCard({
    credential,
    onClick,
    onDelete,
    onCopy,
    onToggleFavorite,
}: CredentialCardProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const hidePasswordDelay = useSettingsStore(
        (state) => state.hidePasswordDelay,
    );

    useEffect(() => {
        if (!showPassword || hidePasswordDelay === -1) {
            return;
        }

        const timeout = setTimeout(() => {
            setShowPassword(false);
        }, hidePasswordDelay);

        return () => {
            clearTimeout(timeout);
        };
    }, [showPassword, hidePasswordDelay]);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();

        onCopy?.(credential.password, credential.id);
    };

    const handleDelete = () => {
        setShowDeleteModal(true);
        setShowMenu(false);
    };

    const confirmDelete = async () => {
        await onDelete?.(credential);
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

    const handleTogglePassword = (e: React.MouseEvent) => {
        e.stopPropagation();

        setShowPassword((previous) => !previous);
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
                                bg-linear-to-br ${getCategoryColor(
                                    credential.category,
                                )}
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
                                    type="button"
                                    onClick={handleToggleFavorite}
                                    className={`
                                        cursor-pointer transition-all duration-200 shrink-0
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
                                    <StarIcon
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
                                    border ${getCategoryBadgeColor(
                                        credential.category,
                                    )}
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
                            type="button"
                            onClick={() => setShowMenu(!showMenu)}
                            className="cursor-pointer p-1.5 rounded-lg hover:bg-white/5 text-foreground/40 hover:text-foreground transition-colors"
                            aria-label="Abrir menu"
                        >
                            <MoreVerticalIcon className="w-5 h-5" />
                        </button>

                        {showMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowMenu(false)}
                                />

                                <div className="absolute right-0 mt-1 w-48 bg-background/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl z-50 py-1">
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="cursor-pointer w-full flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-white/5 transition-colors"
                                    >
                                        <Trash2Icon className="w-4 h-4" />
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
                            <MailIcon className="w-4 h-4 text-foreground/30 shrink-0" />

                            <span className="text-foreground/70 truncate">
                                {credential.email || credential.username}
                            </span>
                        </div>
                    )}

                    {credential.password && (
                        <div className="flex items-center gap-2 text-sm">
                            <KeyIcon className="w-4 h-4 text-foreground/30 shrink-0" />

                            <span className="text-foreground/70 font-mono">
                                {showPassword
                                    ? credential.password
                                    : '**********'}
                            </span>

                            <div className="flex items-center gap-1 ml-auto">
                                <button
                                    type="button"
                                    onClick={handleTogglePassword}
                                    className="cursor-pointer p-1 rounded hover:bg-white/5 text-foreground/30 hover:text-foreground/60 transition-colors"
                                    aria-label={
                                        showPassword
                                            ? 'Ocultar senha'
                                            : 'Mostrar senha'
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOffIcon className="w-4 h-4" />
                                    ) : (
                                        <EyeIcon className="w-4 h-4" />
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    className="cursor-pointer p-1 rounded hover:bg-white/5 text-foreground/30 hover:text-foreground/60 transition-colors"
                                    aria-label="Copiar senha"
                                >
                                    <CopyIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1 text-foreground/40">
                            <CalendarIcon className="w-3.5 h-3.5" />

                            <span>{credential.createdAt}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <ShieldIcon className="w-3.5 h-3.5 text-green-500" />

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
}
