'use client';

import { Suspense } from 'react';

import { VerifyEmailClient } from '@/src/app/(auth)/verify-email/components/VerifyEmailClient';

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={null}>
            <VerifyEmailClient />
        </Suspense>
    );
}
