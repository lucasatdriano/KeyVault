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

import { Credential } from '@/src/shared/types/credential';
import { DecryptedCategory } from '@/src/shared/types/category';

import { getCategoriesAction } from '@/src/server/actions/category/get-categories.action';
import { updateCredentialAction } from '@/src/server/actions/credentials/update-credential.action';
import { generateResourceSearchHash } from '@/src/shared/crypto/resource-search';
import { decryptString, encryptString } from '@/src/shared/crypto/cipher';
import { bytesToBase64 } from '@/src/shared/crypto/encoding';
import { generateSalt } from '@/src/shared/crypto/random';

import { useVaultStore } from '@/src/client/store/vault.store';
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

interface ViewCredentialModalProps {
    isOpen: boolean;
    onClose: () => void;
    credential: Credential | null;
    onEdit?: () => void;
    onCopy?: (text: string, credentialId: string) => void;
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
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<DecryptedCategory[]>([]);
    const vaultKey = useVaultStore((state) => state.vaultKey);

    const [formData, setFormData] = useState<Credential | null>(credential);
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
        const loadCategories = async () => {
            if (!vaultKey) {
                return;
            }

            try {
                const result = await getCategoriesAction();

                if (!result.success || !result.data) {
                    return;
                }

                const decrypted = await Promise.all(
                    result.data.map(async (category) => {
                        const name = await decryptString(
                            {
                                cipherText: category.cipherText,
                                iv: category.iv,
                            },
                            vaultKey,
                        );

                        return {
                            id: category.id,
                            name,
                        };
                    }),
                );

                setCategories(decrypted);
            } catch (error) {
                console.error('Erro ao carregar categorias:', error);
            }
        };

        if (isEditing) {
            loadCategories();
        }
    }, [isEditing, vaultKey]);

    useEffect(() => {
        setFormData(credential);
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

    if (!credential) return null;

    const handleCopy = (text: string) => {
        if (!credential) return;
        navigator.clipboard.writeText(text);
        onCopy?.(text, credential.id);
    };

    const handleSave = async () => {
        if (!formData || !vaultKey) {
            toast.error('Dados inválidos ou vault key não encontrada.');
            return;
        }

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

        setIsLoading(true);

        try {
            const payload = {
                title: formData.title,
                username: formData.username || '',
                email: formData.email || '',
                password: formData.password,
                url: formData.url || '',
                notes: formData.notes || '',
            };

            const encrypted = await encryptString(
                JSON.stringify(payload),
                vaultKey,
            );

            let resourceSearchHash: string | null = null;
            if (formData.title !== credential.title) {
                resourceSearchHash = await generateResourceSearchHash(
                    formData.title,
                    vaultKey,
                );
            }

            let categoryId: string | null = null;
            if (formData.category && formData.category !== 'Outros') {
                const foundCategory = categories.find(
                    (cat) => cat.name === formData.category,
                );
                categoryId = foundCategory?.id || null;
            }

            const salt = bytesToBase64(generateSalt());

            const result = await updateCredentialAction({
                id: credential.id,
                categoryId: categoryId,
                cipherText: encrypted.cipherText,
                iv: encrypted.iv,
                salt,
                resourceSearchHash,
                version: 1,
                algorithm: 'AES-256-GCM',
                favorite: credential.favorite,
            });

            if (!result.success) {
                toast.error(result.error);
                return;
            }

            toast.success('Credencial atualizada com sucesso!');
            setIsEditing(false);
            onEdit?.();
        } catch (error) {
            console.error(error);
            toast.error('Erro ao atualizar credencial.');
        } finally {
            setIsLoading(false);
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

    const categoryOptions = [
        { value: 'Outros', label: 'Outros' },
        ...categories.map((cat) => ({
            value: cat.name,
            label: cat.name,
        })),
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
                                    setFormData(credential);
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
                                disabled={isLoading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleSave}
                                isLoading={isLoading}
                                loadingText="Salvando..."
                                fullWidth
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
                        value={formData?.title || ''}
                        onChange={(e) => handleChange('title', e.target.value)}
                        leftIcon={<KeyIcon className="w-5 h-5" />}
                        error={errors.title}
                        required
                    />

                    <InputTextForm
                        label="Usuário / E-mail"
                        placeholder="usuario@email.com"
                        value={formData?.email || formData?.username || ''}
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
                        value={formData?.password || ''}
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
                        value={formData?.url || ''}
                        onChange={(e) => handleChange('url', e.target.value)}
                        leftIcon={<GlobeIcon className="w-5 h-5" />}
                        error={errors.url}
                    />

                    <InputSelectForm
                        label="Categoria"
                        options={categoryOptions}
                        placeholder="Selecione uma categoria"
                        value={formData?.category || 'Outros'}
                        onChange={(e) =>
                            handleChange('category', e.target.value)
                        }
                        error={errors.category}
                    />

                    <InputTextAreaForm
                        label="Notas"
                        placeholder="Informações adicionais..."
                        value={formData?.notes || ''}
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
                                    Criado em {formatDate(credential.createdAt)}
                                </span>
                            </div>
                            {credential.updatedAt &&
                                credential.updatedAt !==
                                    credential.createdAt && (
                                    <div className="flex items-center gap-1">
                                        <CalendarIcon className="w-3.5 h-3.5" />
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
