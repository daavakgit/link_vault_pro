'use client';

import React, { useState, useEffect } from 'react';
import { Search, Bell } from 'lucide-react';
import { IUser } from '@/types';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  user: IUser | null;
  onSearchChange?: (val: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onSearchChange }) => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchElem = document.getElementById('header-search-input');
        if (searchElem) searchElem.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <header className="flex items-center justify-between gap-4 py-4 px-6 bg-[#080d19] border-b border-[#172238] sticky top-0 z-30">
      {/* Search Input Box */}
      <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          id="header-search-input"
          type="text"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            if (onSearchChange) onSearchChange(e.target.value);
          }}
          placeholder="Search your links..."
          className="w-full bg-[#101726] border border-[#1d273e] text-slate-100 placeholder-slate-500 text-sm pl-10 pr-14 py-2 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-[#162035] border border-[#232f4a] px-1.5 py-0.5 rounded">
          <span>⌘</span>
          <span>K</span>
        </div>
      </form>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          title="Notifications"
          className="p-2 rounded-xl text-slate-400 hover:text-white bg-[#101726] border border-[#1d273e] hover:bg-[#182238] transition relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500" />
        </button>

        {/* Profile Avatar */}
        {user && (
          <button
            onClick={() => router.push('/profile')}
            className="flex items-center gap-2 p-0.5 rounded-full border border-indigo-500/40 hover:border-indigo-400 transition"
          >
            <img
              src={
                user.avatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                  user.name
                )}`
              }
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover bg-slate-800"
            />
          </button>
        )}
      </div>
    </header>
  );
};
