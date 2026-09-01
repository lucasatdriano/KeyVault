/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useCallback, useEffect, useState } from 'react';

import { getProfileAction } from '@/src/server/actions/user/get-profile.action';

import { ProfileDisplay } from '@/src/shared/types/profile';

import { useCredentialsStore } from '@/src/client/store/credential.store';
import { formatDateOnly } from '@/src/client/utils/formatters/date';

export function useProfileData() {
    const { credentialsCount } = useCredentialsStore();

    const [profile, setProfile] = useState<ProfileDisplay | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProfile = useCallback(async () => {
        try {
            const result = await getProfileAction();

            if (result.success && result.data) {
                const { user: userData, recoveryMethods } = result.data;

                setProfile({
                    name: userData.name,
                    email: userData.email,
                    memberSince: formatDateOnly(userData.createdAt),
                    recoveryMethods: recoveryMethods?.length || 0,
                    credentialsCount,
                });
            } else {
                console.error('Erro ao carregar perfil:', result.error);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
        } finally {
            setIsLoading(false);
        }
    }, [credentialsCount]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const refreshProfile = useCallback(async () => {
        setIsLoading(true);
        await fetchProfile();
    }, [fetchProfile]);

    return {
        profile,
        isLoading,
        refreshProfile,
        setProfile,
    };
}
