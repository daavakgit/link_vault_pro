'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  badge?: string;
  icon: React.ReactNode;
  loading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  badge,
  icon,
  loading = false,
}) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-[#101726] border border-[#1b253b] p-5 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-[#172136] border border-[#23314f] flex items-center justify-center shrink-0">
          {icon}
        </div>
        <span className="text-xs font-semibold text-slate-300 tracking-wide">{title}</span>
      </div>

      {loading ? (
        <div className="h-8 bg-[#182339] rounded animate-pulse w-20 my-1" />
      ) : (
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white tracking-tight">{value}</span>
          {badge && (
            <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-950/60 border border-indigo-800/40 px-2 py-0.5 rounded-full">
              ↗ {badge}
            </span>
          )}
          {subtitle && !badge && (
            <span className="text-xs text-slate-400 font-medium">{subtitle}</span>
          )}
        </div>
      )}
    </motion.div>
  );
};
