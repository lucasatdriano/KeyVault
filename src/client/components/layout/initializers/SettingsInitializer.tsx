'use client';

import { useEffect } from 'react';

import { useSettingsStore } from '@/src/client/store/settings.store';

interface SettingsInitializerProps {
    userId: string;
}

export default function SettingsInitializer({
    userId,
}: SettingsInitializerProps) {
    const loadUserSettings = useSettingsStore(
        (state) => state.loadUserSettings,
    );

    useEffect(() => {
        loadUserSettings(userId);
    }, [userId, loadUserSettings]);

    return null;
}
