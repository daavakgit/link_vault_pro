'use client';

import React from 'react';
import { LinkVaultProvider, useLinkVault } from '@/context/LinkVaultContext';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { user, openAddModal } = useLinkVault();

  return (
    /* Stitch: bg-surface text-on-surface h-screen flex overflow-hidden */
    <div className="bg-[#0b1326] text-[#dae2fd] h-screen flex overflow-hidden font-sans antialiased">
      {/* Sidebar — fixed 256px, desktop only */}
      <Sidebar user={user} onOpenAddModal={openAddModal} />

      {/* Main content area — takes remaining width */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden md:pl-64 pt-14 md:pt-0">
        {/* Sticky Header — bell + avatar only, no search */}
        <Header user={user} />

        {/* Scrollable page canvas */}
        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-16 md:py-10 pb-24 md:pb-12">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <LinkVaultProvider>
      <DashboardContent>{children}</DashboardContent>
    </LinkVaultProvider>
  );
}
