'use client';

import { useSidebar } from '@/src/client/hooks/useSidebar';
import Sidebar from './Sidebar';

export default function SidebarDrawer() {
    const { isOpen, close } = useSidebar();

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
                onClick={close}
            />
            <div className="fixed left-0 top-0 bottom-0 z-50 w-72 lg:hidden">
                <Sidebar mobile />
            </div>
        </>
    );
}
