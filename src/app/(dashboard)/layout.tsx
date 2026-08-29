'use client';

import React from 'react';
import { LinkVaultProvider, useLinkVault } from '@/context/LinkVaultContext';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { user, openAddModal } = useLinkVault();

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex">
      {/* Sidebar */}
      <Sidebar user={user} onOpenAddModal={openAddModal} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 pt-14 lg:pt-0">
        <Header user={user} />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
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
