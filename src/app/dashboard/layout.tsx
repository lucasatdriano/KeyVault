'use client';

import React from 'react';
import Sidebar from '@/src/components/layout/sideBar/SideBar';
import BottomBar from '@/src/components/layout/bottomBar/BottomBar';
import SidebarMobile from '@/src/components/layout/sideBar/SideBarMobile';
import { HeaderProvider } from '@/src/providers/HeaderProvider';

const mockUser = {
    name: 'Alex Ferreira',
    email: 'alex@gmail.com',
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <HeaderProvider>
            <div className="min-h-screen bg-background flex">
                <div className="hidden lg:block">
                    <Sidebar user={mockUser} />
                </div>

                <SidebarMobile />

                <div className="flex-1 flex flex-col min-h-screen pb-20 lg:pb-0">
                    <main className="flex-1">{children}</main>
                    <div className="lg:hidden">
                        <BottomBar />
                    </div>
                </div>
            </div>
        </HeaderProvider>
    );
}
