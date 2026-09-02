/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';

import { useCredentials } from '@/src/client/hooks/credentials/useCredentials';
import { useAccountProfile } from '@/src/client/hooks/user/useAccountProfile';
import { useSettingsStore } from '@/src/client/store/settings.store';
import { useAuthActions } from '@/src/client/hooks/auth/useAuthActions';

import Header from '@/src/client/components/layout/header/Header';
import ImportModal from '@/src/client/components/layout/modals/credentialsModals/ImportModal';
import ExportModal from '@/src/client/components/layout/modals/credentialsModals/ExportModal';
import DeleteAccountModal from '@/src/client/components/layout/modals/usersModals/DeleteAccountModal';

import SecuritySettingsCard from '@/src/app/(protected)/account/settings/components/SecuritySettingsCard';
import DataSettingsCard from '@/src/app/(protected)/account/settings/components/DataSettingsCard';
import AboutCard from '@/src/app/(protected)/account/settings/components/AboutCard';
import DangerZoneCard from '@/src/app/(protected)/account/settings/components/DangerZoneCard';

export default function SettingsPage() {
    const {
        sessionExpiration,
        isUpdatingSessionExpiration,
        handleSaveSessionExpiration,
    } = useAccountProfile();

    const { handleExport, handleImport } = useCredentials();

    const {
        hidePasswordDelay,
        autoLockMinutes,
        updateHidePasswordDelay,
        updateAutoLock,
    } = useSettingsStore();

    const { isDeletingAccount, handleDeleteAccount } = useAuthActions();

    const [showExportModal, setShowExportModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    const [lastSync, setLastSync] = useState<Date | null>(null);

    useEffect(() => {
        setLastSync(new Date());
    }, []);

    const handleSessionExpirationChange = async (value: number) => {
        await handleSaveSessionExpiration(value);
    };

    const handleAutoLockToggle = () => {
        if (autoLockMinutes > 0) {
            updateAutoLock(0);
            return;
        }
        updateAutoLock(5);
    };

    const handleExportData = async (): Promise<boolean> => {
        if (isExporting) return false;

        setIsExporting(true);

        try {
            await handleExport();
            setShowExportModal(false);
            return true;
        } catch {
            return false;
        } finally {
            setIsExporting(false);
        }
    };

    const handleImportData = async (file: File): Promise<boolean> => {
        if (isImporting) return false;

        setIsImporting(true);

        try {
            const success = await handleImport(file);
            if (success) {
                setShowImportModal(false);
            }
            return success;
        } catch {
            return false;
        } finally {
            setIsImporting(false);
        }
    };

    const handleDeleteAccountWrapper = async (): Promise<boolean> => {
        const success = await handleDeleteAccount();

        if (success) {
            setShowDeleteModal(false);
        }

        return success;
    };

    return (
        <>
            <div className="space-y-6">
                <Header variant="settings" />

                <SecuritySettingsCard
                    hidePasswordDelay={hidePasswordDelay}
                    sessionExpiration={sessionExpiration}
                    autoLockMinutes={autoLockMinutes}
                    isUpdatingSessionExpiration={isUpdatingSessionExpiration}
                    onHidePasswordDelayChange={updateHidePasswordDelay}
                    onSessionExpirationChange={handleSessionExpirationChange}
                    onAutoLockToggle={handleAutoLockToggle}
                />

                <DataSettingsCard
                    onExportClick={() => setShowExportModal(true)}
                    onImportClick={() => setShowImportModal(true)}
                />

                <AboutCard lastSync={lastSync} />

                <DangerZoneCard
                    onDeleteClick={() => setShowDeleteModal(true)}
                />
            </div>

            <ExportModal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                onExport={handleExportData}
                isExporting={isExporting}
            />

            <ImportModal
                isOpen={showImportModal}
                onClose={() => setShowImportModal(false)}
                onImport={handleImportData}
                isImporting={isImporting}
            />

            <DeleteAccountModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteAccountWrapper}
                isDeleting={isDeletingAccount}
            />
        </>
    );
}
