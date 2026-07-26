'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield } from 'lucide-react';
import AuditCard, { AuditLog } from '@/src/components/ui/cards/AuditCard';
import Header from '@/src/components/layout/header/Header';

const auditLogs: AuditLog[] = [
    {
        id: '1',
        date: '2024-07-21',
        time: '07:30',
        event: 'Login realizado com sucesso',
        device: 'MacBook Pro 16"',
        ip: '177.32.x.x',
        type: 'login',
        details: 'Login bem-sucedido via Safari',
    },
    {
        id: '2',
        date: '2024-07-20',
        time: '12:45',
        event: 'Nova credencial adicionada: AWS Console',
        device: 'MacBook Pro 16"',
        ip: '177.32.x.x',
        type: 'create',
        details:
            'Credencial AWS Console adicionada à categoria Desenvolvimento',
    },
    {
        id: '3',
        date: '2024-07-19',
        time: '08:20',
        event: 'Credencial editada: GitHub',
        device: 'iPhone 15 Pro',
        ip: '189.45.x.x',
        type: 'edit',
        details: 'Senha e notas atualizadas',
    },
    {
        id: '4',
        date: '2024-07-19',
        time: '11:10',
        event: 'Logout manual',
        device: 'Windows PC — Trabalho',
        ip: '201.56.x.x',
        type: 'logout',
        details: 'Logout realizado manualmente',
    },
    {
        id: '5',
        date: '2024-07-19',
        time: '06:00',
        event: 'Login realizado com sucesso',
        device: 'Windows PC — Trabalho',
        ip: '201.56.x.x',
        type: 'login',
        details: 'Login bem-sucedido via Chrome',
    },
    {
        id: '6',
        date: '2024-07-18',
        time: '13:00',
        event: 'Senha mestre alterada',
        device: 'MacBook Pro 16"',
        ip: '177.32.x.x',
        type: 'password',
        details: 'Senha mestre alterada com sucesso',
    },
    {
        id: '7',
        date: '2024-07-18',
        time: '06:00',
        event: 'Novo dispositivo detectado: Windows PC — Trabalho',
        device: 'Windows PC — Trabalho',
        ip: '201.56.x.x',
        type: 'device',
        details: 'Novo dispositivo adicionado à conta',
    },
    {
        id: '8',
        date: '2024-07-17',
        time: '11:30',
        event: 'Credencial removida: LinkedIn',
        device: 'MacBook Pro 16"',
        ip: '177.32.x.x',
        type: 'delete',
        details: 'Credencial LinkedIn movida para a lixeira',
    },
    {
        id: '9',
        date: '2024-07-17',
        time: '17:15',
        event: 'Login realizado com sucesso',
        device: 'iPhone 15 Pro',
        ip: '189.45.x.x',
        type: 'login',
        details: 'Login bem-sucedido via KeyVault App',
    },
];

export default function AuditPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('Todos');
    const [logs] = useState<AuditLog[]>(auditLogs);

    const filteredLogs = logs.filter((log) => {
        const matchesSearch =
            log.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.ip.includes(searchQuery);
        const matchesType = filterType === 'Todos' || log.type === filterType;
        return matchesSearch && matchesType;
    });

    const handleExport = () => {
        console.log('Exportando logs...');
    };

    const handleRefresh = () => {
        console.log('Atualizando logs...');
    };

    return (
        <div className="space-y-6">
            <Header variant="audit" />

            <AuditCard
                logs={filteredLogs}
                onExport={handleExport}
                onRefresh={handleRefresh}
            />

            <div className="bg-white/5 rounded-xl p-4 border border-white/5 mx-4 mb-4">
                <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary/60 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-foreground/60">
                            <span className="font-medium text-foreground/80">
                                Retenção de logs:
                            </span>{' '}
                            O histórico de atividades é mantido por 90 dias.
                            Logs mais antigos são automaticamente removidos.
                        </p>
                        <p className="text-xs text-foreground/30 mt-1">
                            Última atualização:{' '}
                            {new Date().toLocaleString('pt-BR')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
