'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { IUser } from '@/types';
import Link from 'next/link';

interface HeaderProps {
  user: IUser | null;
}

export const Header: React.FC<HeaderProps> = ({ user }) => {
  const [currentDateTime, setCurrentDateTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const dateString = now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      setCurrentDateTime(`${dateString} • ${timeString}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-4 md:px-12 border-b border-[#464555]/10 bg-[#0b1326]/90 backdrop-blur-md z-30 sticky top-0">
      {/* Live Date & Auto-updating Time Indicator */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#131b2e] border border-[#464555]/30 text-xs text-[#c7c4d8]">
        <div className="relative flex items-center justify-center">
          <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </div>
        <Clock className="w-3.5 h-3.5 text-[#c3c0ff]" />
        <span className="font-mono font-medium tracking-wide text-[#dae2fd]">
          {currentDateTime || 'Loading time...'}
        </span>
      </div>

      {/* Right User Avatar */}
      <div className="flex items-center gap-4">
        {user && (
          <Link href="/profile" className="flex items-center gap-2 group">
            <span className="hidden sm:inline text-xs font-semibold text-[#c7c4d8] group-hover:text-[#dae2fd] transition">
              {user.name}
            </span>
            <img
              src={
                user.avatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`
              }
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-[#222a3d] cursor-pointer hover:ring-[#c3c0ff]/60 transition-all"
            />
          </Link>
        )}
      </div>
    </header>
  );
};
