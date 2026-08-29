'use client';

import { useState } from 'react';
import { KeyIcon, LockKeyholeIcon } from 'lucide-react';

import { unlockVaultAction } from '@/src/server/actions/auth/unlock-vault.action';

import { decryptVaultKey } from '@/src/shared/crypto/vault';

import { useVaultStore } from '@/src/client/store/vault.store';

import Button from '@/src/client/components/ui/buttons/Button';
import InputTextForm from '@/src/client/components/ui/inputs/InputTextForm';
import ModalBase from '@/src/client/components/layout/modals/ModalBase';

export default function UnlockVaultModal() {
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const setVaultKey = useVaultStore((state) => state.setVaultKey);

    const handleSubmit = async () => {
        if (!password.trim()) {
            setError('Digite sua senha.');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            const result = await unlockVaultAction();

            if (!result.success || !result.data) {
                setError(
                    result.error || 'Não foi possível desbloquear o cofre.',
                );
                return;
            }

            const encryptedVault = JSON.parse(result.data.encryptedVaultKey);

            const vaultKey = await decryptVaultKey(encryptedVault, password);

            setVaultKey(vaultKey);

            setPassword('');
        } catch (error) {
            console.error('Erro ao desbloquear cofre:', error);

            setError('Senha incorreta.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ModalBase
            isOpen
            onClose={() => {}}
            title="Desbloquear Cofre"
            maxWidth="sm"
            icon={<LockKeyholeIcon className="h-5 w-5 text-primary" />}
            className="pointer-events-auto"
            canClose={false}
        >
            <div className="space-y-5">
                <div>
                    <p className="text-sm text-foreground/60">
                        Sua sessão continua ativa, mas o cofre está bloqueado.
                    </p>

                    <p className="mt-1 text-sm text-foreground/40">
                        Digite sua senha para acessar suas credenciais
                        novamente.
                    </p>
                </div>

                <InputTextForm
                    type="password"
                    label="Sua Senha"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setError('');
                    }}
                    error={error}
                    autoFocus
                    disabled={isLoading}
                    onKeyDown={async (e) => {
                        if (e.key === 'Enter') {
                            await handleSubmit();
                        }
                    }}
                    leftIcon={<KeyIcon className="w-5 h-5" />}
                />
            </div>

            <div className="mt-6">
                <Button
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    isLoading={isLoading}
                    loadingText="Desbloqueando..."
                >
                    Desbloquear
                </Button>
            </div>
        </ModalBase>
    );
}
