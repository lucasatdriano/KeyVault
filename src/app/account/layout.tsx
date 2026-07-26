'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/src/components/layout/sideBar/SideBar';
import BottomBar from '@/src/components/layout/bottomBar/BottomBar';

const mockUser = {
    name: 'Alex Ferreira',
    email: 'alex@gmail.com',
};

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleMenuClick = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="min-h-screen bg-background flex">
            <div className="hidden lg:block">
                <Sidebar user={mockUser} />
            </div>

            {isSidebarOpen && (
                <>
                    <div
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                    <div className="fixed left-0 top-0 bottom-0 z-50 w-72 lg:hidden">
                        <Sidebar user={mockUser} />
                    </div>
                </>
            )}

            <div className="flex-1 flex flex-col min-h-screen pb-20 lg:pb-0">
                <main className="flex-1">{children}</main>

                <div className="lg:hidden">
                    <BottomBar />
                </div>
            </div>
        </div>
    );
}
