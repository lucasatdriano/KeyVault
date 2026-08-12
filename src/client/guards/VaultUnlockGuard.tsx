'use client';

import UnlockVaultModal from '../components/layout/modals/authModals/UnlockVaultModal';

import { useVaultStore } from '../store/vault.store';
import { useAuthStore } from '../store/auth.store';

export default function VaultUnlockGuard({
    children,
}: {
    children: React.ReactNode;
}) {
    const vaultKey = useVaultStore((state) => state.vaultKey);
    const isLoggingOut = useAuthStore((state) => state.isLoggingOut);

    if (isLoggingOut) {
        return null;
    }

    if (!vaultKey) {
        return <UnlockVaultModal />;
    }

    return <>{children}</>;
}
