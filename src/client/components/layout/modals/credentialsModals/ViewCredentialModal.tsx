'use client';

import React, { useState } from 'react';
import {
    Key,
    Mail,
    Globe,
    FileText,
    Calendar,
    Edit,
    Copy,
    Eye,
    EyeOff,
    Shield,
    Lock,
} from 'lucide-react';
import { Credential } from '@/src/shared/types/credential';
import InputTextForm from '@/src/client/components/ui/inputs/InputTextForm';
import Button from '@/src/client/components/ui/buttons/Button';
import ModalBase from '../ModalBase';
import { getInitials } from '@/src/client/utils/credentials/credential-avatar';
import {
    getCategoryBadgeColor,
    getCategoryColor,
} from '@/src/client/utils/credentials/credential-category';

interface ViewCredentialModalProps {
    isOpen: boolean;
    onClose: () => void;
    credential: Credential | null;
    onEdit?: (credential: Credential) => void;
    onCopy?: (text: string) => void;
}

const ViewCredentialModal: React.FC<ViewCredentialModalProps> = ({
    isOpen,
    onClose,
    credential,
    onEdit,
    onCopy,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState<Credential | null>(credential);

    if (!credential) return null;

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        onCopy?.(text);
    };

    const handleSave = () => {
        if (formData) {
            onEdit?.(formData);
            setIsEditing(false);
        }
    };

    const handleChange = (field: keyof Credential, value: string) => {
        if (formData) {
            setFormData({ ...formData, [field]: value });
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <ModalBase
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? 'Editar Credencial' : 'Credencial'}
            icon={
                isEditing ? (
                    <Edit className="w-5 h-5 text-primary" />
                ) : (
                    <Shield className="w-5 h-5 text-primary" />
                )
            }
            maxWidth="lg"
            footer={
                <div className="flex flex-col sm:flex-row gap-3">
                    {isEditing ? (
                        <>
                            <Button
                                onClick={() => {
                                    setIsEditing(false);
                                    setFormData(credential);
                                }}
                                variant="secondary"
                                fullWidth
                            >
                                Cancelar
                            </Button>
                            <Button onClick={handleSave} fullWidth>
                                Salvar alterações
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                onClick={onClose}
                                variant="secondary"
                                fullWidth
                            >
                                Fechar
                            </Button>
                            <Button
                                onClick={() => setIsEditing(true)}
                                leftIcon={<Edit className="w-5 h-5" />}
                                fullWidth
                            >
                                Editar
                            </Button>
                        </>
                    )}
                </div>
            }
        >
            {isEditing ? (
                <div className="space-y-4">
                    <InputTextForm
                        label="Título"
                        value={formData?.title || ''}
                        onChange={(e) => handleChange('title', e.target.value)}
                        leftIcon={<Key className="w-5 h-5" />}
                    />

                    <InputTextForm
                        label="Usuário / E-mail"
                        value={formData?.email || formData?.username || ''}
                        onChange={(e) => handleChange('email', e.target.value)}
                        leftIcon={<Mail className="w-5 h-5" />}
                    />

                    <InputTextForm
                        label="Senha"
                        type="password"
                        value={formData?.password || ''}
                        onChange={(e) =>
                            handleChange('password', e.target.value)
                        }
                        leftIcon={<Lock className="w-5 h-5" />}
                    />

                    <InputTextForm
                        label="Website"
                        value={formData?.url || ''}
                        onChange={(e) => handleChange('url', e.target.value)}
                        leftIcon={<Globe className="w-5 h-5" />}
                    />

                    <div>
                        <label className="block text-foreground/90 text-sm font-medium mb-1.5">
                            Categoria
                        </label>
                        <select
                            value={formData?.category || ''}
                            onChange={(e) =>
                                handleChange('category', e.target.value)
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        >
                            <option value="E-mail" className="bg-background">
                                E-mail
                            </option>
                            <option
                                value="Desenvolvimento"
                                className="bg-background"
                            >
                                Desenvolvimento
                            </option>
                            <option value="Streaming" className="bg-background">
                                Streaming
                            </option>
                            <option
                                value="Redes Sociais"
                                className="bg-background"
                            >
                                Redes Sociais
                            </option>
                            <option value="Finanças" className="bg-background">
                                Finanças
                            </option>
                            <option value="Trabalho" className="bg-background">
                                Trabalho
                            </option>
                            <option value="Música" className="bg-background">
                                Música
                            </option>
                            <option value="Compras" className="bg-background">
                                Compras
                            </option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-foreground/90 text-sm font-medium mb-1.5">
                            Notas
                        </label>
                        <textarea
                            value={formData?.notes || ''}
                            onChange={(e) =>
                                handleChange('notes', e.target.value)
                            }
                            rows={3}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                            placeholder="Informações adicionais..."
                        />
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                        <div
                            className={`
                            w-16 h-16 rounded-2xl flex items-center justify-center
                            bg-linear-to-br ${getCategoryColor(credential.category)}
                            shadow-lg shadow-primary/10
                        `}
                        >
                            <span className="text-white font-bold text-xl">
                                {getInitials(credential.title)}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-foreground">
                                {credential.title}
                            </h3>
                            <span
                                className={`
                                inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium
                                border ${getCategoryBadgeColor(credential.category)}
                            `}
                            >
                                {credential.category}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {(credential.email || credential.username) && (
                            <div className="flex items-start gap-3">
                                <Mail className="w-5 h-5 text-foreground/30 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs text-foreground/40 uppercase tracking-wider font-medium">
                                        Usuário / E-mail
                                    </p>
                                    <p className="text-foreground font-medium">
                                        {credential.email ||
                                            credential.username}
                                    </p>
                                </div>
                            </div>
                        )}

                        {credential.password && (
                            <div className="flex items-start gap-3">
                                <Key className="w-5 h-5 text-foreground/30 shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-xs text-foreground/40 uppercase tracking-wider font-medium">
                                        Senha
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-foreground font-mono font-medium">
                                            {showPassword
                                                ? credential.password
                                                : '••••••••••'}
                                        </span>
                                        <button
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="p-1 rounded hover:bg-white/5 text-foreground/30 hover:text-foreground/60 transition-colors"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleCopy(credential.password!)
                                            }
                                            className="p-1 rounded hover:bg-white/5 text-foreground/30 hover:text-foreground/60 transition-colors"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {credential.url && (
                            <div className="flex items-start gap-3">
                                <Globe className="w-5 h-5 text-foreground/30 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs text-foreground/40 uppercase tracking-wider font-medium">
                                        Website
                                    </p>
                                    <a
                                        href={credential.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline font-medium"
                                    >
                                        {credential.url}
                                    </a>
                                </div>
                            </div>
                        )}

                        {credential.notes && (
                            <div className="flex items-start gap-3">
                                <FileText className="w-5 h-5 text-foreground/30 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs text-foreground/40 uppercase tracking-wider font-medium">
                                        Notas
                                    </p>
                                    <p className="text-foreground/70 text-sm leading-relaxed">
                                        {credential.notes}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 border-t border-white/10">
                        <div className="flex flex-col sm:flex-row gap-2 text-xs text-foreground/40">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>
                                    Criado em {formatDate(credential.createdAt)}
                                </span>
                            </div>
                            {credential.updatedAt &&
                                credential.updatedAt !==
                                    credential.createdAt && (
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>
                                            Alterado em{' '}
                                            {formatDate(credential.updatedAt)}
                                        </span>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            )}
        </ModalBase>
    );
};

export default ViewCredentialModal;
