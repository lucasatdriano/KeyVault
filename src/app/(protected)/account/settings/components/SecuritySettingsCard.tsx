'use client';

import { ShieldIcon } from 'lucide-react';

import {
    HIDE_PASSWORD_OPTIONS,
    SESSION_TIMEOUT_OPTIONS,
} from '@/src/client/constants/settings';
import InputSelectForm from '@/src/client/components/ui/inputs/InputSelectForm';

interface SecuritySettingsCardProps {
    hidePasswordDelay: number;
    sessionExpiration: number;
    autoLockMinutes: number;
    isUpdatingSessionExpiration: boolean;
    onHidePasswordDelayChange: (value: number) => void;
    onSessionExpirationChange: (value: number) => void;
    onAutoLockToggle: () => void;
}

export default function SecuritySettingsCard({
    hidePasswordDelay,
    sessionExpiration,
    autoLockMinutes,
    isUpdatingSessionExpiration,
    onHidePasswordDelayChange,
    onSessionExpirationChange,
    onAutoLockToggle,
}: SecuritySettingsCardProps) {
    return (
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mx-4">
            <div className="flex items-center gap-2 mb-4">
                <ShieldIcon className="w-5 h-5 text-foreground/40" />
                <h2 className="text-sm font-semibold text-foreground/40 uppercase tracking-wider">
                    Segurança
                </h2>
            </div>

            <p className="text-xs text-foreground/40 mb-4">
                Configure o comportamento de segurança da sessão.
            </p>

            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                    <div>
                        <p className="text-sm font-medium text-foreground">
                            Tempo para ocultar senha
                        </p>
                        <p className="text-xs text-foreground/40">
                            Define por quanto tempo uma senha permanecerá
                            visível após ser revelada
                        </p>
                    </div>

                    <div className="w-64">
                        <InputSelectForm
                            value={hidePasswordDelay}
                            className="text-sm"
                            onChange={(event) =>
                                onHidePasswordDelayChange(
                                    Number(event.target.value),
                                )
                            }
                            options={HIDE_PASSWORD_OPTIONS.map((option) => ({
                                value: String(option.value),
                                label: option.label,
                            }))}
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                    <div>
                        <p className="text-sm font-medium text-foreground">
                            Tempo de sessão
                        </p>
                        <p className="text-xs text-foreground/40">
                            Define a duração das novas sessões após o login
                        </p>
                    </div>

                    <div className="w-64">
                        <InputSelectForm
                            value={sessionExpiration}
                            className="text-sm"
                            onChange={(event) =>
                                onSessionExpirationChange(
                                    Number(event.target.value),
                                )
                            }
                            options={SESSION_TIMEOUT_OPTIONS.map((option) => ({
                                value: String(option.value),
                                label: option.label,
                            }))}
                            disabled={isUpdatingSessionExpiration}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                    <div>
                        <p className="text-sm font-medium text-foreground">
                            Bloquear automaticamente
                        </p>
                        <p className="text-xs text-foreground/40">
                            Bloquear o KeyVault quando o computador ficar
                            inativo
                            {autoLockMinutes > 0 && ` após 3 minutos`}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onAutoLockToggle}
                        className={`cursor-pointer relative w-12 h-7 rounded-full transition-all duration-200 ${
                            autoLockMinutes > 0 ? 'bg-primary' : 'bg-white/20'
                        }`}
                        aria-label={
                            autoLockMinutes > 0
                                ? 'Desativar bloqueio automático'
                                : 'Ativar bloqueio automático'
                        }
                    >
                        <div
                            className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-200 ${
                                autoLockMinutes > 0 ? 'left-6' : 'left-1'
                            }`}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}
