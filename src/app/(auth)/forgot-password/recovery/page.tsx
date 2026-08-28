import { Suspense } from 'react';

import RecoveryFlowClient from './components/RecoveryFlowClient';

export default function RecoveryFlowPage() {
    return (
        <Suspense fallback={null}>
            <RecoveryFlowClient />
        </Suspense>
    );
}
