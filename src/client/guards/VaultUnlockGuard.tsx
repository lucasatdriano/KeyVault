'use client';

import UnlockVaultModal from '../components/layout/modals/authModals/UnlockVaultModal';
import { useVaultStore } from '../store/vault.store';

export default function VaultUnlockGuard({
    children,
}: {
    children: React.ReactNode;
}) {
    const vaultKey = useVaultStore((state) => state.vaultKey);

    if (!vaultKey) {
        return <UnlockVaultModal />;
    }

    return <>{children}</>;
}
