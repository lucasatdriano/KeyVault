'use client';

import { useRouter } from 'next/navigation';

import SplashScreen from './splash/page';

export default function AuthPage() {
    const router = useRouter();

    const handleSplashComplete = () => {
        router.push('/login');
    };

    return <SplashScreen onGetStarted={handleSplashComplete} />;
}
