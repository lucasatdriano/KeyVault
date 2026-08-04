'use client';

import React from 'react';
import { SearchIcon, PlusIcon, LucideIcon } from 'lucide-react';
import Button from '../../ui/buttons/Button';
import InputTextForm from '../../ui/inputs/InputTextForm';

interface HeaderSearchProps {
    icon: LucideIcon;
    iconClass: string;
    iconBgColor: string;
    title: string;
    subtitle: string;
    onSearch?: (query: string) => void;
    onFilterChange?: (value: string) => void;
    onNewCredential?: () => void;
    showNewButton?: boolean;
    showFilter?: boolean;
    searchPlaceholder?: string;
    filterOptions?: { value: string; label: string }[];
}

const HeaderSearch: React.FC<HeaderSearchProps> = ({
    icon: Icon,
    iconClass,
    iconBgColor,
    title,
    subtitle,
    onSearch,
    onFilterChange,
    onNewCredential,
    showNewButton = true,
    showFilter = true,
    searchPlaceholder = 'Pesquisar...',
    filterOptions = [
        { value: '', label: 'Todas as categorias' },
        { value: 'Streamings', label: 'Streamings' },
        { value: 'Finanças', label: 'Finanças' },
        { value: 'Redes Sociais', label: 'Redes Sociais' },
        { value: 'Jogos', label: 'Jogos' },
        { value: 'Lojas', label: 'Lojas' },
        { value: 'Saúde', label: 'Saúde' },
        { value: 'Instituições', label: 'Instituições' },
        { value: 'Corporativos', label: 'Corporativos' },
        { value: 'Técnicos', label: 'Técnicos' },
        { value: 'Aplicativos', label: 'Aplicativos' },
        { value: 'Acesso Físico', label: 'Acesso Físico' },
        { value: 'Outros', label: 'Outros' },
    ],
}) => {
    return (
        <div className="px-4 pt-0 pb-4 sm:pt-4 border-b border-white/10 bg-background/50">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-12 h-12 rounded-2xl ${iconBgColor} flex items-center justify-center`}
                        >
                            <Icon className={`w-6 h-6 ${iconClass}`} />
                        </div>
                        <div>
                            <h1 className="text-xl lg:text-2xl font-bold text-foreground">
                                {title}
                            </h1>
                            <p className="text-sm text-foreground/60">
                                {subtitle}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {showNewButton && (
                            <Button
                                onClick={onNewCredential}
                                size="sm"
                                className="px-2 lg:px-4"
                                aria-label="Nova credencial"
                            >
                                <PlusIcon className="w-5 h-5" />

                                <span className="hidden sm:inline">
                                    Nova Credencial
                                </span>
                            </Button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <InputTextForm
                        type="search"
                        placeholder={searchPlaceholder}
                        leftIcon={<SearchIcon className="w-5 h-5" />}
                        onChange={(e) => onSearch?.(e.target.value)}
                    />

                    {showFilter && (
                        <select
                            className="cursor-pointer bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all sm:w-40"
                            onChange={(e) => onFilterChange?.(e.target.value)}
                            defaultValue=""
                        >
                            {filterOptions.map((option) => (
                                <option
                                    key={option.value}
                                    value={option.value}
                                    className="bg-background"
                                >
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HeaderSearch;
