import { useHeader } from '@/src/hooks/useHeader';
import { Sidebar } from 'lucide-react';

const mockUser = {
    name: 'Alex Ferreira',
    email: 'alex@gmail.com',
};

export default function SidebarMobile() {
    const { isSidebarOpen, closeSidebar } = useHeader();

    if (!isSidebarOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
                onClick={closeSidebar}
            />
            <div className="fixed left-0 top-0 bottom-0 z-50 w-72 lg:hidden">
                <Sidebar user={mockUser} />
            </div>
        </>
    );
}
