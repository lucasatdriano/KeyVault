import React from 'react';
import { redirect } from 'next/navigation';

import { AuthProvider } from '@/src/client/providers/AuthProvider';
import { currentUserAction } from '@/src/server/actions/auth/current-user.action';
import { SidebarProvider } from '@/src/client/providers/SidebarProvider';

import Sidebar from '@/src/client/components/layout/sidebar/Sidebar';
import SidebarDrawer from '@/src/client/components/layout/sidebar/SidebarDrawer';
import BottomBar from '@/src/client/components/layout/bottomBar/BottomBar';

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const result = await currentUserAction();

    if (!result.success || !result.data) {
        redirect('/');
    }

    const user = result.data;

    return (
        <AuthProvider
            user={{
                id: user.id,
                name: user.name,
                email: user.email,
                emailVerified: user.emailVerified,
                createdAt: String(user.createdAt),
            }}
        >
            <SidebarProvider>
                <div className="min-h-screen bg-background flex">
                    <div className="hidden lg:block">
                        <Sidebar />
                    </div>

                    <SidebarDrawer />

                    <div className="flex-1 flex flex-col min-h-screen pb-20 lg:pb-0">
                        <main className="flex-1">{children}</main>

                        <div className="lg:hidden">
                            <BottomBar />
                        </div>
                    </div>
                </div>
            </SidebarProvider>
        </AuthProvider>
    );
}
