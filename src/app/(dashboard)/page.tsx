'use client';

import React, { useEffect, useState } from 'react';
import { useLinkVault } from '@/context/LinkVaultContext';
import { StatCard } from '@/components/StatCard';
import { LinkCard } from '@/components/LinkCard';
import { Link2, FolderKanban, Calendar, Plus, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { DashboardStats } from '@/types';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { user, links, loading, openAddModal, openEditModal, openDeleteModal, showToast } =
    useLinkVault();
  const [stats, setStats] = useState<DashboardStats>({
    totalLinks: 0,
    categoriesCount: 0,
    addedThisWeek: 0,
    percentageChange: 12,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setStatsLoading(true);
        const res = await fetch('/api/stats');
        const data = await res.json();
        if (data.stats) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setStatsLoading(false);
      }
    };
    loadStats();
  }, [links]);

  // Greeting helper based on hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const userName = user?.name ? user.name.split(' ')[0] : 'Alex';
  const recentLinks = links.slice(0, 4);

  return (
    <div className="flex flex-col gap-8">
      {/* Top Banner / Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>
              {getGreeting()}, {userName}
            </span>
            <span className="animate-bounce inline-block">👋</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Keep your important links organized, secure, and ready to access at lightning speed.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-[#5852f6] hover:bg-[#4842eb] active:scale-95 text-white font-medium px-5 py-3 rounded-xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 text-sm transition self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Link</span>
        </button>
      </div>

      {/* Stat Cards Grid (3 Cards matching Stitch design) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          title="Total Links"
          value={stats.totalLinks}
          badge={`+${stats.percentageChange}%`}
          subtitle="vs last month"
          icon={<Link2 className="w-5 h-5 text-indigo-400" />}
          loading={statsLoading}
        />
        <StatCard
          title="Categories"
          value={stats.categoriesCount}
          subtitle="Active folders"
          icon={<FolderKanban className="w-5 h-5 text-purple-400" />}
          loading={statsLoading}
        />
        <StatCard
          title="Added This Week"
          value={stats.addedThisWeek}
          subtitle="New entries"
          icon={<Calendar className="w-5 h-5 text-cyan-400" />}
          loading={statsLoading}
        />
      </div>

      {/* Recent Links Section */}
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">Recent Links</h2>
          <Link
            href="/my-links"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-28 bg-[#101726] border border-[#1b253b] rounded-2xl animate-pulse p-4"
              />
            ))}
          </div>
        ) : recentLinks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentLinks.map((link) => (
              <LinkCard
                key={link._id}
                link={link}
                variant="recent"
                onEdit={openEditModal}
                onDelete={openDeleteModal}
                onCopy={(url) => showToast('Link copied to clipboard', 'info')}
              />
            ))}
          </div>
        ) : (
          /* Empty state for recent links */
          <div className="bg-[#101726] border border-[#1b253b] rounded-2xl p-8 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">No saved links yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mb-4">
              Get started by adding your first important link to LinkVault.
            </p>
            <button
              onClick={openAddModal}
              className="bg-[#5852f6] hover:bg-[#4842eb] text-white text-xs font-medium px-4 py-2 rounded-xl transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Your First Link</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
