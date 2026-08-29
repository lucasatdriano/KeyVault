import { Suspense } from 'react';

import RecoveryFlowClient from '@/src/app/(auth)/forgot-password/recovery/components/RecoveryFlowClient';

export default function RecoveryFlowPage() {
    return (
        <Suspense fallback={null}>
            <RecoveryFlowClient />
        </Suspense>
    );
}
