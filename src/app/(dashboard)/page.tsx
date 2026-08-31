'use client';

import React, { useEffect, useState } from 'react';
import { useLinkVault } from '@/context/LinkVaultContext';
import { StatCard } from '@/components/StatCard';
import { LinkCard } from '@/components/LinkCard';
import { Link2, FolderKanban, Calendar, Plus, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { DashboardStats } from '@/types';

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

  const userName = user?.name || 'Daavak';
  const recentLinks = links.slice(0, 4);

  return (
    <div className="flex flex-col gap-8">
      {/* Executive Professional Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#464555]/20 pb-6">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#3131c0]/20 text-[#c0c1ff] border border-[#3131c0]/40 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#c0c1ff]" />
              Executive Workspace
            </span>
            <span className="text-xs text-[#918fa1] font-mono">
              Vault ID: #{user?._id ? user._id.slice(-6).toUpperCase() : 'PRO-88'}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#dae2fd] tracking-tight">
            Welcome back, {userName}
          </h1>
          <p className="text-sm text-[#c7c4d8] max-w-xl leading-relaxed">
            Overview of your digital assets, categorized links, and active vault analytics.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-[#4f46e5] hover:bg-[#4338ca] active:scale-95 text-white font-semibold px-5 py-2.5 rounded-lg shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 text-sm transition self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Link</span>
        </button>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          title="Total Links"
          value={stats.totalLinks}
          badge={`+${stats.percentageChange}%`}
          subtitle="vs last month"
          icon={<Link2 className="w-5 h-5 text-[#c3c0ff]" />}
          loading={statsLoading}
        />
        <StatCard
          title="Categories"
          value={stats.categoriesCount}
          subtitle="Active folders"
          icon={<FolderKanban className="w-5 h-5 text-[#c0c1ff]" />}
          loading={statsLoading}
        />
        <StatCard
          title="Added This Week"
          value={stats.addedThisWeek}
          subtitle="New entries"
          icon={<Calendar className="w-5 h-5 text-[#ffb695]" />}
          loading={statsLoading}
        />
      </div>

      {/* Recent Links Section */}
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex items-center justify-between border-b border-[#464555]/20 pb-2">
          <h2 className="text-xl font-bold text-[#dae2fd] tracking-tight">Recent Links</h2>
          <Link
            href="/my-links"
            className="text-xs font-semibold text-[#c3c0ff] hover:text-white flex items-center gap-1 transition"
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
                className="h-28 bg-[#171f33] border border-[#464555]/20 rounded-xl animate-pulse p-4"
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
          <div className="bg-[#171f33] border border-[#464555]/20 rounded-xl p-8 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-[#4f46e5]/20 border border-[#4f46e5]/30 flex items-center justify-center text-[#c3c0ff] mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-[#dae2fd] mb-1">No saved links yet</h3>
            <p className="text-xs text-[#c7c4d8] max-w-sm mb-4">
              Get started by adding your first important link to LinkVault.
            </p>
            <button
              onClick={openAddModal}
              className="bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-semibold px-4 py-2 rounded-lg transition flex items-center gap-1.5 shadow-lg shadow-indigo-600/20"
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
