import { redirect } from 'next/navigation';
import { getCurrentUser } from '../lib/auth/session';
import AuthPage from './(auth)/page';

export default async function Home() {
    const user = await getCurrentUser();

    if (user) {
        redirect('/dashboard');
    }

    return <AuthPage />;
}
