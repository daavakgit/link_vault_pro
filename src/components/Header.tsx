'use client';

import React from 'react';
import { Bell } from 'lucide-react';
import { IUser } from '@/types';
import Link from 'next/link';

interface HeaderProps {
  user: IUser | null;
}

export const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="h-16 shrink-0 flex items-center justify-end px-4 md:px-16 border-b border-[#464555]/10 bg-[#0b1326]/80 backdrop-blur-md z-30 sticky top-0">
      {/* Right Actions only */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button
          title="Notifications"
          className="text-[#c7c4d8] hover:text-[#dae2fd] hover:bg-[#222a3d] p-2 rounded-full transition-colors relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#c3c0ff] rounded-full ring-2 ring-[#0b1326]" />
        </button>

        {/* Profile Avatar */}
        {user && (
          <Link href="/profile">
            <img
              src={
                user.avatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`
              }
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-[#222a3d] cursor-pointer hover:ring-[#c3c0ff]/50 transition-all"
            />
          </Link>
        )}
      </div>
    </header>
  );
};
