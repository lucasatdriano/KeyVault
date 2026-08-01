import { redirect } from 'next/navigation';
import AuthPage from './(auth)/page';
import { currentUserAction } from '../server/actions/auth/current-user.action';

export default async function Home() {
    const user = await currentUserAction();

    if (user) {
        redirect('/dashboard');
    }

    return <AuthPage />;
}
