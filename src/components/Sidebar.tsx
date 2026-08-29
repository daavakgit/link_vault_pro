'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Rocket,
  LayoutGrid,
  Link2,
  FolderKanban,
  Settings,
  Plus,
  LogOut,
  Menu,
  X,
  Search,
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
    { label: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    { label: 'My Links', href: '/my-links', icon: Link2 },
    { label: 'Categories', href: '/categories', icon: FolderKanban },
    { label: 'Search', href: '/search', icon: Search },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Top Navbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0a0f1d] border-b border-[#1b253b] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Rocket className="w-4 h-4" />
          </div>
          <span className="font-semibold text-white tracking-tight text-base">LinkVault Pro</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-slate-400 hover:text-white rounded-lg bg-[#141c2e]"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#080d19] border-r border-[#172238] flex flex-col justify-between p-5 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header & Navigation */}
        <div className="flex flex-col gap-6">
          {/* Logo Header */}
          <Link href="/dashboard" className="flex items-center gap-3 pt-1 px-1 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition">
              <Rocket className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white tracking-tight text-lg leading-tight">
                LinkVault Pro
              </span>
              <span className="text-xs text-slate-400 font-medium">Personal Workspace</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-[#1b253e] text-white shadow-sm border border-[#2b3a5c]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#121929]'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-indigo-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-4 pt-4 border-t border-[#172238]">
          {/* Add New Link Button */}
          <button
            onClick={() => {
              setMobileOpen(false);
              onOpenAddModal();
            }}
            className="w-full bg-[#5852f6] hover:bg-[#4a44eb] active:scale-[0.98] text-white font-medium py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 text-sm transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add New Link</span>
          </button>

          {/* User Info card or simple Logout */}
          {user ? (
            <Link
              href="/settings"
              className="flex items-center justify-between bg-[#0e1626] border border-[#1b263e] p-3 rounded-xl hover:border-indigo-500/40 transition group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <img
                  src={
                    user.avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                      user.name
                    )}`
                  }
                  alt={user.name}
                  className="w-9 h-9 rounded-full bg-slate-700 object-cover shrink-0 border border-slate-600"
                />
                <div className="flex flex-col truncate">
                  <span className="text-sm font-semibold text-white truncate leading-tight group-hover:text-indigo-300">
                    {user.name}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-indigo-400">
                    Pro Plan
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleLogout();
                }}
                title="Logout"
                className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-[#19243a] transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-red-400 text-sm font-medium transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
