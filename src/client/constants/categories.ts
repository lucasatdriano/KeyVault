export const DEFAULT_CATEGORIES = [
    { name: 'Streamings' },
    { name: 'Redes Sociais' },
    { name: 'Jogos' },
    { name: 'Aplicativos' },
    { name: 'Finanças' },
    { name: 'Lojas' },
    { name: 'Saúde' },
    { name: 'Instituições' },
    { name: 'Corporativos' },
    { name: 'Técnicos' },
    { name: 'Acesso Físico' },
    { name: 'Outros' },
];

export const CATEGORY_ORDER_MAP: Record<string, number> =
    DEFAULT_CATEGORIES.reduce(
        (acc, category, index) => {
            acc[category.name] = index;
            return acc;
        },
        {} as Record<string, number>,
    );

export const CATEGORY_COLORS: Record<string, string> = {
    Streamings: 'from-red-500 to-red-600',
    Finanças: 'from-emerald-500 to-emerald-600',
    'Redes Sociais': 'from-blue-500 to-blue-600',
    Jogos: 'from-violet-500 to-violet-600',
    Lojas: 'from-orange-500 to-orange-600',
    Saúde: 'from-teal-500 to-teal-600',
    Instituições: 'from-indigo-500 to-indigo-600',
    Corporativos: 'from-slate-500 to-slate-600',
    Técnicos: 'from-sky-500 to-sky-600',
    Aplicativos: 'from-cyan-500 to-cyan-600',
    'Acesso Físico': 'from-purple-500 to-purple-600',
    Outros: 'from-gray-500 to-gray-600',
};

export const CATEGORY_BADGE_COLORS: Record<string, string> = {
    Streamings: 'bg-red-500/20 text-red-400 border-red-500/30',
    Finanças: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'Redes Sociais': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Jogos: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    Lojas: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    Saúde: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    Instituições: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    Corporativos: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    Técnicos: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    Aplicativos: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    'Acesso Físico': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    Outros: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};
