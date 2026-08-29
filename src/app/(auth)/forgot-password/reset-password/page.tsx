import { Suspense } from 'react';

import ResetPasswordClient from '@/src/app/(auth)/forgot-password/reset-password/components/ResetPasswordClient';

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={null}>
            <ResetPasswordClient />
        </Suspense>
    );
}
