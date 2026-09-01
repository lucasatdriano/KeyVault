'use client';

import { useProfileData } from './useProfileData';
import { useProfileActions } from './useProfileActions';

export function useAccountProfile() {
    const profileData = useProfileData();
    const profileActions = useProfileActions();

    return {
        profile: profileData.profile,
        isLoading: profileData.isLoading,
        refreshProfile: profileData.refreshProfile,

        isEditing: profileActions.isEditing,
        isSaving: profileActions.isSaving,
        formData: profileActions.formData,
        handleEditClick: profileActions.handleEditClick,
        handleCancelEdit: profileActions.handleCancelEdit,
        handleNameChange: profileActions.handleNameChange,
        handleSaveName: profileActions.handleSaveName,

        isChangeEmailModalOpen: profileActions.isChangeEmailModalOpen,
        isEmailVerificationModalOpen:
            profileActions.isEmailVerificationModalOpen,
        verificationEmail: profileActions.verificationEmail,
        verificationToken: profileActions.verificationToken,
        handleSaveEmail: profileActions.handleSaveEmail,
        handleVerifyEmail: profileActions.handleVerifyEmail,
        handleResendEmail: profileActions.handleResendEmail,
        handleOpenChangeEmail: profileActions.handleOpenChangeEmail,
        handleCloseChangeEmail: profileActions.handleCloseChangeEmail,
        handleCloseEmailVerification:
            profileActions.handleCloseEmailVerification,

        isChangePasswordModalOpen: profileActions.isChangePasswordModalOpen,
        handleSavePassword: profileActions.handleSavePassword,
        handleOpenChangePassword: profileActions.handleOpenChangePassword,
        handleCloseChangePassword: profileActions.handleCloseChangePassword,

        sessionExpiration: profileActions.sessionExpiration,
        isUpdatingSessionExpiration: profileActions.isUpdatingSessionExpiration,
        handleSaveSessionExpiration: profileActions.handleSaveSessionExpiration,
    };
}
