'use client';

import { useVaultStore } from '@/src/client/store/vault.store';
import { useAuthStore } from '@/src/client/store/auth.store';

import UnlockVaultModal from '@/src/client/components/layout/modals/authModals/UnlockVaultModal';

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
