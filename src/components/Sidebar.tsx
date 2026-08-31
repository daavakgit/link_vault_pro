'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Link2,
  FolderKanban,
  User,
  Plus,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { IUser } from '@/types';

interface SidebarProps {
  user: IUser | null;
  onOpenAddModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, onOpenAddModal }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Links', href: '/my-links', icon: Link2 },
    { label: 'Categories', href: '/categories', icon: FolderKanban },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);

  return (
    <>
      {/* Mobile Top Bar matching provided HTML */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex justify-between items-center w-full px-4 py-3 border-b border-[#464555]/30 bg-[#0b1326]/90 backdrop-blur-md">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-[#dae2fd] p-1.5 rounded hover:bg-[#171f33] transition-colors active:scale-95"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <span className="font-bold text-[#dae2fd] text-lg tracking-tight">LinkVault</span>
        {user ? (
          <Link href="/profile">
            <img
              src={
                user.avatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`
              }
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#222a3d]"
            />
          </Link>
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#171f33]" />
        )}
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        />
      )}

      {/* Desktop Sidebar / Mobile Slide-in Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 flex flex-col h-screen border-r border-[#464555]/20 bg-[#171f33] p-4 gap-2 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header with Mobile Close button */}
        <div className="mb-6 px-2 pt-2 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#c3c0ff] tracking-tight">LinkVault Pro</h1>
            <p className="text-[11px] font-semibold text-[#c7c4d8] mt-0.5 uppercase tracking-wider">
              Personal Workspace
            </p>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-[#c7c4d8] hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary CTA — Add New Link */}
        <button
          onClick={() => {
            setMobileOpen(false);
            onOpenAddModal();
          }}
          className="w-full flex items-center justify-center gap-2 bg-[#c3c0ff] text-[#1d00a5] py-2 px-4 rounded-lg font-bold text-sm hover:brightness-110 active:scale-[0.98] transition-all mb-4 shadow-[0_0_15px_rgba(195,192,255,0.15)]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Add New Link
        </button>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all active:scale-[0.98] ${
                  active
                    ? 'text-[#c3c0ff] bg-[#c3c0ff]/10 border-r-2 border-[#c3c0ff]'
                    : 'text-[#c7c4d8] hover:bg-[#222a3d] hover:text-[#dae2fd]'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-[#c3c0ff]' : 'text-[#c7c4d8]'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer: User Info + Logout */}
        <div className="mt-auto pt-4 border-t border-[#464555]/20 flex flex-col gap-1">
          {user && (
            <Link
              href="/profile"
              className="flex items-center gap-3 px-3 py-2 mb-2 rounded-lg hover:bg-[#222a3d] transition-colors cursor-pointer"
            >
              <img
                src={
                  user.avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`
                }
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-[#464555]/50"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[#dae2fd] leading-tight">
                  {user.name.split(' ')[0]}
                </span>
                <span className="text-[10px] text-[#c7c4d8] uppercase tracking-wider font-semibold">
                  Pro Plan
                </span>
              </div>
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[#c7c4d8] hover:bg-[#222a3d] hover:text-[#ffb4ab] transition-all active:scale-[0.98]"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Floating Action Button (+) matching provided HTML */}
      <button
        onClick={onOpenAddModal}
        title="Add New Link"
        className="fixed bottom-20 right-4 md:hidden w-12 h-12 bg-[#c3c0ff] text-[#1d00a5] rounded-full shadow-[0_8px_16px_rgba(195,192,255,0.25)] flex items-center justify-center z-40 active:scale-95 transition-transform hover:brightness-110"
      >
        <Plus className="w-6 h-6 stroke-[3]" />
      </button>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 md:hidden bg-[#2d3449] rounded-t-xl shadow-lg border-t border-[#464555]/30">
        <Link
          href="/dashboard"
          onClick={() => setMobileOpen(false)}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all active:scale-90 min-w-[56px] ${
            pathname === '/dashboard'
              ? 'bg-[#4f46e5] text-[#dad7ff]'
              : 'text-[#c7c4d8] hover:bg-[#31394d]'
          }`}
        >
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-[10px] font-semibold mt-1">Home</span>
        </Link>
        <Link
          href="/my-links"
          onClick={() => setMobileOpen(false)}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all active:scale-90 min-w-[56px] ${
            pathname.startsWith('/my-links')
              ? 'bg-[#4f46e5] text-[#dad7ff]'
              : 'text-[#c7c4d8] hover:bg-[#31394d]'
          }`}
        >
          <Link2 className="w-6 h-6" />
          <span className="text-[10px] font-semibold mt-1">Links</span>
        </Link>
        <Link
          href="/categories"
          onClick={() => setMobileOpen(false)}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all active:scale-90 min-w-[56px] ${
            pathname.startsWith('/categories')
              ? 'bg-[#4f46e5] text-[#dad7ff]'
              : 'text-[#c7c4d8] hover:bg-[#31394d]'
          }`}
        >
          <FolderKanban className="w-6 h-6" />
          <span className="text-[10px] font-semibold mt-1">Categories</span>
        </Link>
        <Link
          href="/profile"
          onClick={() => setMobileOpen(false)}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all active:scale-90 min-w-[56px] ${
            pathname.startsWith('/profile') || pathname.startsWith('/settings')
              ? 'bg-[#4f46e5] text-[#dad7ff]'
              : 'text-[#c7c4d8] hover:bg-[#31394d]'
          }`}
        >
          <User className="w-6 h-6" />
          <span className="text-[10px] font-semibold mt-1">Profile</span>
        </Link>
      </nav>
    </>
  );
};
