/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useEffect } from 'react';
import {
    KeyIcon,
    MailIcon,
    GlobeIcon,
    FileTextIcon,
    CalendarIcon,
    EditIcon,
    CopyIcon,
    EyeIcon,
    EyeOffIcon,
    ShieldIcon,
    LockIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import {
    Credential,
    UpdateCredentialData,
} from '@/src/shared/types/credential';

import { getInitials } from '@/src/client/utils/credentials/credential-avatar';
import {
    getCategoryBadgeColor,
    getCategoryColor,
} from '@/src/client/utils/credentials/credential-category';

import InputTextForm from '@/src/client/components/ui/inputs/InputTextForm';
import InputSelectForm from '@/src/client/components/ui/inputs/InputSelectForm';
import InputTextAreaForm from '@/src/client/components/ui/inputs/InputTextAreaForm';
import Button from '@/src/client/components/ui/buttons/Button';
import ModalBase from '../ModalBase';
import { formatDateTime } from '@/src/client/utils/formatters/date';
import { useCategories } from '@/src/client/hooks/categories/useCategories';

interface ViewCredentialModalProps {
    isOpen: boolean;
    onClose: () => void;
    credential: Credential | null;
    onEdit?: () => void;
    onCopy?: (text: string, credentialId: string) => void;
    onUpdate?: (
        credential: Credential,
        formData: UpdateCredentialData,
    ) => Promise<{ success: boolean; error?: string }>;
    isUpdating?: boolean;
}

const ViewCredentialModal: React.FC<ViewCredentialModalProps> = ({
    isOpen,
    onClose,
    credential,
    onEdit,
    onCopy,
    onUpdate,
    isUpdating = false,
}) => {
    const {
        isLoading: isLoadingCategories,
        loadCategories,
        getCategorySelectOptions,
    } = useCategories({ autoLoad: false });

    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState<{
        title: string;
        username: string;
        email: string;
        password: string;
        url: string;
        notes: string;
        category: string;
    } | null>(null);

    const [errors, setErrors] = useState({
        title: '',
        username: '',
        email: '',
        password: '',
        url: '',
        category: '',
        notes: '',
    });

    useEffect(() => {
        if (isEditing) {
            loadCategories();
        }
    }, [isEditing, loadCategories]);

    useEffect(() => {
        if (credential) {
            setFormData({
                title: credential.title,
                username: credential.username || '',
                email: credential.email || '',
                password: credential.password,
                url: credential.url || '',
                notes: credential.notes || '',
                category: credential.category || 'Outros',
            });
        }
        setErrors({
            title: '',
            username: '',
            email: '',
            password: '',
            url: '',
            category: '',
            notes: '',
        });
    }, [credential]);

    if (!credential || !formData) return null;

    const handleCopy = (text: string) => {
        if (!credential) return;
        navigator.clipboard.writeText(text);
        onCopy?.(text, credential.id);
    };

    const handleSave = async () => {
        if (!formData) return;

        const newErrors = {
            title: formData.title ? '' : 'Título é obrigatório',
            username: '',
            email: '',
            password: formData.password ? '' : 'Senha é obrigatória',
            url: '',
            category: '',
            notes: '',
        };

        if (newErrors.title || newErrors.password) {
            setErrors(newErrors);
            return;
        }

        setErrors({
            title: '',
            username: '',
            email: '',
            password: '',
            url: '',
            category: '',
            notes: '',
        });

        try {
            const result = await onUpdate?.(credential, formData);

            if (result?.success) {
                toast.success('Credencial atualizada com sucesso!');
                setIsEditing(false);
                onEdit?.();
            } else {
                toast.error(result?.error || 'Erro ao atualizar credencial.');
            }
        } catch (error) {
            console.error(error);
            toast.error('Erro ao atualizar credencial.');
        }
    };

    const handleChange = (field: keyof Credential, value: string) => {
        if (formData) {
            setFormData({ ...formData, [field]: value });
        }
    };

    const categoryOptions = [
        { value: 'Outros', label: 'Outros' },
        ...getCategorySelectOptions(),
    ];

    return (
        <ModalBase
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? 'Editar Credencial' : 'Credencial'}
            icon={
                isEditing ? (
                    <EditIcon className="w-5 h-5 text-primary" />
                ) : (
                    <ShieldIcon className="w-5 h-5 text-primary" />
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
                                    if (credential) {
                                        setFormData({
                                            title: credential.title,
                                            username: credential.username || '',
                                            email: credential.email || '',
                                            password: credential.password,
                                            url: credential.url || '',
                                            notes: credential.notes || '',
                                            category:
                                                credential.category || 'Outros',
                                        });
                                    }
                                    setErrors({
                                        title: '',
                                        username: '',
                                        email: '',
                                        password: '',
                                        url: '',
                                        category: '',
                                        notes: '',
                                    });
                                }}
                                variant="secondary"
                                fullWidth
                                disabled={isUpdating}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleSave}
                                isLoading={isUpdating}
                                loadingText="Salvando..."
                                fullWidth
                                disabled={isLoadingCategories}
                            >
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
                                leftIcon={<EditIcon className="w-5 h-5" />}
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
                        placeholder="GitHub"
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        leftIcon={<KeyIcon className="w-5 h-5" />}
                        error={errors.title}
                        required
                    />

                    <InputTextForm
                        label="Usuário / E-mail"
                        placeholder="usuario@email.com"
                        value={formData.email || formData.username}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value.includes('@')) {
                                handleChange('email', value);
                                handleChange('username', '');
                            } else {
                                handleChange('username', value);
                                handleChange('email', '');
                            }
                        }}
                        leftIcon={<MailIcon className="w-5 h-5" />}
                        error={errors.username || errors.email}
                    />

                    <InputTextForm
                        label="Senha"
                        type="password"
                        placeholder="********"
                        value={formData.password}
                        onChange={(e) =>
                            handleChange('password', e.target.value)
                        }
                        leftIcon={<LockIcon className="w-5 h-5" />}
                        error={errors.password}
                        required
                    />

                    <InputTextForm
                        label="Website"
                        placeholder="https://exemplo.com"
                        value={formData.url}
                        onChange={(e) => handleChange('url', e.target.value)}
                        leftIcon={<GlobeIcon className="w-5 h-5" />}
                        error={errors.url}
                    />

                    <InputSelectForm
                        label="Categoria"
                        options={categoryOptions}
                        placeholder="Selecione uma categoria"
                        value={formData.category}
                        onChange={(e) =>
                            handleChange('category', e.target.value)
                        }
                        error={errors.category}
                    />

                    <InputTextAreaForm
                        label="Notas"
                        placeholder="Informações adicionais..."
                        value={formData.notes}
                        onChange={(e) => handleChange('notes', e.target.value)}
                        error={errors.notes}
                        rows={3}
                    />
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
                                <MailIcon className="w-5 h-5 text-foreground/30 shrink-0 mt-0.5" />
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
                                <KeyIcon className="w-5 h-5 text-foreground/30 shrink-0 mt-0.5" />
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
                                                <EyeOffIcon className="w-4 h-4" />
                                            ) : (
                                                <EyeIcon className="w-4 h-4" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleCopy(credential.password!)
                                            }
                                            className="p-1 rounded hover:bg-white/5 text-foreground/30 hover:text-foreground/60 transition-colors"
                                        >
                                            <CopyIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {credential.url && (
                            <div className="flex items-start gap-3">
                                <GlobeIcon className="w-5 h-5 text-foreground/30 shrink-0 mt-0.5" />
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
                                <FileTextIcon className="w-5 h-5 text-foreground/30 shrink-0 mt-0.5" />
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
                                <CalendarIcon className="w-3.5 h-3.5" />
                                <span>
                                    Criado em{' '}
                                    {formatDateTime(credential.createdAt)}
                                </span>
                            </div>
                            {credential.updatedAt &&
                                credential.updatedAt !==
                                    credential.createdAt && (
                                    <div className="flex items-center gap-1">
                                        <CalendarIcon className="w-3.5 h-3.5" />
                                        <span>
                                            Alterado em{' '}
                                            {formatDateTime(
                                                credential.updatedAt,
                                            )}
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
