'use client';

import { useEffect, useRef } from 'react';

import { useSettingsStore } from '@/src/client/store/settings.store';
import { useVaultStore } from '@/src/client/store/vault.store';

export default function AutoLockHandler() {
    const autoLockMinutes = useSettingsStore((state) => state.autoLockMinutes);

    const clearVault = useVaultStore((state) => state.clearVault);
    const vaultKey = useVaultStore((state) => state.vaultKey);

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!vaultKey || autoLockMinutes <= 0) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }

            return;
        }

        const timeout = autoLockMinutes * 60 * 1000;

        const resetTimer = () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                clearVault();
            }, timeout);
        };

        const events = [
            'mousemove',
            'mousedown',
            'keydown',
            'scroll',
            'touchstart',
        ] as const;

        events.forEach((event) => {
            window.addEventListener(event, resetTimer);
        });

        resetTimer();

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }

            events.forEach((event) => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, [autoLockMinutes, vaultKey, clearVault]);

    return null;
}
