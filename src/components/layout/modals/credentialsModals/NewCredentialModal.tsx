'use client';

import React, { useState } from 'react';
import { Key, Mail, Globe, Plus, Lock } from 'lucide-react';
import Button from '@/src/components/ui/buttons/Button';
import InputTextForm from '@/src/components/ui/inputs/InputTextForm';
import ModalBase from '../ModalBase';
import { NewCredentialData } from '@/src/types/credential';

interface NewCredentialModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: NewCredentialData) => void;
}

const NewCredentialModal: React.FC<NewCredentialModalProps> = ({
    isOpen,
    onClose,
    onSave,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<NewCredentialData>({
        title: '',
        username: '',
        email: '',
        password: '',
        url: '',
        category: 'Social',
        notes: '',
    });

    const handleChange = (field: keyof NewCredentialData, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onSave(formData);
            onClose();

            setFormData({
                title: '',
                username: '',
                email: '',
                password: '',
                url: '',
                category: 'Social',
                notes: '',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ModalBase
            isOpen={isOpen}
            onClose={onClose}
            title="Nova Credencial"
            icon={<Plus className="w-5 h-5 text-primary" />}
            maxWidth="lg"
            footer={
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={onClose} variant="secondary" fullWidth>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        isLoading={isLoading}
                        loadingText="Salvando..."
                        fullWidth
                    >
                        Salvar
                    </Button>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <InputTextForm
                    label="Título"
                    placeholder="ex: GitHub"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    leftIcon={<Key className="w-5 h-5" />}
                    required
                />

                <InputTextForm
                    label="Usuário / E-mail"
                    placeholder="seu@email.com"
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
                    leftIcon={<Mail className="w-5 h-5" />}
                    required
                />

                <InputTextForm
                    label="Senha"
                    type="password"
                    placeholder="********"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    leftIcon={<Lock className="w-5 h-5" />}
                    required
                />

                <InputTextForm
                    label="Website"
                    placeholder="https://exemplo.com"
                    value={formData.url || ''}
                    onChange={(e) => handleChange('url', e.target.value)}
                    leftIcon={<Globe className="w-5 h-5" />}
                />

                <div>
                    <label className="block text-foreground/90 text-sm font-medium mb-1.5">
                        Categoria
                    </label>
                    <select
                        value={formData.category}
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
                        <option value="Social" className="bg-background">
                            Social
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
                        value={formData.notes || ''}
                        onChange={(e) => handleChange('notes', e.target.value)}
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                        placeholder="Informações adicionais..."
                    />
                </div>
            </form>
        </ModalBase>
    );
};

export default NewCredentialModal;
