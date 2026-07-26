import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'KeyVault - Gerenciador de Senhas',
    description:
        'Suas senhas, protegidas por você. Gerencie suas credenciais com segurança.',
    authors: [{ name: 'Lucas Adriano' }],
    keywords: [
        'Gerenciamento de Senhas',
        'Next.js',
        'TypeScript',
        'Senhas',
        'Guardar senhas',
        'KeyVault',
    ],
    icons: {
        icon: '/icons/shield-check.svg',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="pt-br"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">{children}</body>
        </html>
    );
}
