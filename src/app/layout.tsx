import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'LinkVault Pro — Personal Workspace & Digital Link Manager',
  description: 'Organize, encrypt, and access your critical links at lightning speed. Built for professionals who demand precision.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} dark antialiased`}>
      <body className="bg-[#070b14] text-slate-100 min-h-screen font-sans selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
