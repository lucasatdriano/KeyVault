'use client';

import React from 'react';
import { SearchIcon, PlusIcon } from 'lucide-react';
import Button from '../../ui/buttons/Button';
import InputTextForm from '../../ui/inputs/InputTextForm';

interface HeaderSearchProps {
    icon: React.ReactNode;
    iconBgColor: string;
    title: string;
    subtitle: string;
    onSearch?: (query: string) => void;
    onNewCredential?: () => void;
    showNewButton?: boolean;
    showFilter?: boolean;
    searchPlaceholder?: string;
    filterOptions?: { value: string; label: string }[];
}

const HeaderSearch: React.FC<HeaderSearchProps> = ({
    icon,
    iconBgColor,
    title,
    subtitle,
    onSearch,
    onNewCredential,
    showNewButton = true,
    showFilter = true,
    searchPlaceholder = 'Pesquisar...',
    filterOptions = [
        { value: '', label: 'Categoria' },
        { value: 'email', label: 'E-mail' },
        { value: 'social', label: 'Social' },
        { value: 'streaming', label: 'Streaming' },
        { value: 'financas', label: 'Finanças' },
    ],
}) => {
    return (
        <div className="px-4 py-4 border-b border-white/10 bg-background/50">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-12 h-12 rounded-2xl ${iconBgColor} flex items-center justify-center`}
                        >
                            {icon}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">
                                {title}
                            </h1>
                            <p className="text-sm text-foreground/60">
                                {subtitle}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {showNewButton && (
                            <>
                                <Button
                                    onClick={onNewCredential}
                                    className="lg:hidden p-2 rounded-xl hover:bg-white/5 text-foreground/60 hover:text-foreground transition-colors"
                                    aria-label="Nova credencial"
                                >
                                    <PlusIcon />
                                </Button>

                                <Button
                                    leftIcon={<PlusIcon />}
                                    onClick={onNewCredential}
                                    size="sm"
                                    className="hidden lg:flex"
                                >
                                    Nova Credencial
                                </Button>
                            </>
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
