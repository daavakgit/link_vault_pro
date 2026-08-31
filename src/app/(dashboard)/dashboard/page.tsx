'use client';

import React, { useEffect, useState } from 'react';
import { useLinkVault } from '@/context/LinkVaultContext';
import {
  Link2,
  FolderKanban,
  Calendar,
  Plus,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Code,
  Palette,
  FileText,
  Bookmark,
  Briefcase,
  GraduationCap,
  Users,
  Copy,
  ExternalLink,
  Edit2,
  Trash2,
  Check,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import { DashboardStats, ILink, CategoryType } from '@/types';
import { cleanUrlDisplay, formatUrlWithProtocol } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { user, links, loading, openAddModal, openEditModal, openDeleteModal, showToast } =
    useLinkVault();

  const [stats, setStats] = useState<DashboardStats>({
    totalLinks: 0,
    categoriesCount: 0,
    addedThisWeek: 0,
    percentageChange: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const getCategoryIcon = (category: CategoryType) => {
    switch (category) {
      case 'Coding':
        return <Code className="w-6 h-6 text-[#c3c0ff]" />;
      case 'Projects':
        return <Palette className="w-6 h-6 text-[#ffb695]" />;
      case 'Career':
        return <Briefcase className="w-6 h-6 text-[#c0c1ff]" />;
      case 'Education':
        return <GraduationCap className="w-6 h-6 text-[#c3c0ff]" />;
      case 'Social':
        return <Users className="w-6 h-6 text-[#ffb695]" />;
      case 'Learning':
        return <FileText className="w-6 h-6 text-[#c0c1ff]" />;
      default:
        return <Bookmark className="w-6 h-6 text-[#dae2fd]" />;
    }
  };

  const getCategoryBadge = (category: CategoryType) => {
    switch (category) {
      case 'Coding':
        return 'bg-[#3131c0]/20 text-[#c0c1ff] border border-[#3131c0]/40';
      case 'Projects':
        return 'bg-[#a44100]/20 text-[#ffb695] border border-[#a44100]/40';
      case 'Career':
        return 'bg-[#2f2ebe]/20 text-[#c0c1ff] border border-[#2f2ebe]/40';
      default:
        return 'bg-[#464555]/30 text-[#c7c4d8] border border-[#464555]/40';
    }
  };

  const handleCopy = (e: React.MouseEvent, link: ILink) => {
    e.stopPropagation();
    navigator.clipboard.writeText(link.url);
    setCopiedId(link._id);
    showToast('Link copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpen = (e: React.MouseEvent, link: ILink) => {
    e.stopPropagation();
    window.open(formatUrlWithProtocol(link.url), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-12 font-sans">
      {/* Executive Professional Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#464555]/20 pb-6">
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
          <h2 className="text-3xl font-extrabold text-[#dae2fd] tracking-tight">
            Welcome back, {userName}
          </h2>
          <p className="text-sm text-[#c7c4d8] max-w-2xl leading-relaxed">
            Overview of your digital assets, categorized links, and active vault analytics.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="hidden md:flex items-center justify-center gap-2 bg-[#4f46e5] text-white hover:bg-[#4338ca] py-2.5 px-5 rounded-lg text-sm font-semibold transition-all active:scale-95 whitespace-nowrap shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Link</span>
        </button>
      </section>

      {/* Stats Overview Bento Grid matching Stitch HTML */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Stat Card 1 */}
        <div className="bg-[#171f33] border border-[#464555]/20 rounded-xl p-5 flex flex-col justify-between relative overflow-hidden group hover:border-[#464555]/40 transition-colors shadow-lg">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#c3c0ff]/5 rounded-full blur-2xl group-hover:bg-[#c3c0ff]/10 transition-colors" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#222a3d] flex items-center justify-center border border-[#464555]/20 text-[#c3c0ff]">
              <Link2 className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-[#c7c4d8]">Total Links</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-[#dae2fd]">
              {statsLoading ? '...' : stats.totalLinks}
            </span>
            <span className="text-xs text-[#c3c0ff] flex items-center gap-0.5 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" /> +12%
            </span>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-[#171f33] border border-[#464555]/20 rounded-xl p-5 flex flex-col justify-between relative overflow-hidden group hover:border-[#464555]/40 transition-colors shadow-lg">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#c0c1ff]/5 rounded-full blur-2xl group-hover:bg-[#c0c1ff]/10 transition-colors" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#222a3d] flex items-center justify-center border border-[#464555]/20 text-[#c0c1ff]">
              <FolderKanban className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-[#c7c4d8]">Categories</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-[#dae2fd]">
              {statsLoading ? '...' : stats.categoriesCount}
            </span>
            <span className="text-xs text-[#c7c4d8] font-normal">Active folders</span>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-[#171f33] border border-[#464555]/20 rounded-xl p-5 flex flex-col justify-between relative overflow-hidden group hover:border-[#464555]/40 transition-colors shadow-lg">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#ffb695]/5 rounded-full blur-2xl group-hover:bg-[#ffb695]/10 transition-colors" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#222a3d] flex items-center justify-center border border-[#464555]/20 text-[#ffb695]">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-[#c7c4d8]">Added This Week</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-[#dae2fd]">
              {statsLoading ? '...' : stats.addedThisWeek}
            </span>
            <span className="text-xs text-[#c7c4d8] font-normal">New entries</span>
          </div>
        </div>
      </section>

      {/* Recent Links Section matching Stitch HTML */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-[#464555]/20 pb-2">
          <h3 className="text-xl font-bold text-[#dae2fd]">Recent Links</h3>
          <Link
            href="/my-links"
            className="text-xs font-semibold text-[#c3c0ff] hover:text-white transition-colors flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-28 bg-[#171f33] border border-[#464555]/20 rounded-xl animate-pulse p-4"
              />
            ))}
          </div>
        ) : recentLinks.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {recentLinks.map((link) => (
              <motion.div
                key={link._id}
                whileHover={{ y: -2 }}
                className="bg-[#171f33] border border-[#464555]/20 hover:border-[#464555]/50 rounded-xl p-4 flex gap-4 items-start group transition-all hover:bg-[#131b2e] relative shadow-lg"
              >
                {/* Left Icon Box */}
                <div className="w-12 h-12 shrink-0 rounded-lg bg-[#31394d] flex items-center justify-center shadow-inner border border-[#464555]/20">
                  {getCategoryIcon(link.category)}
                </div>

                {/* Main Link Information */}
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-base font-semibold text-[#dae2fd] truncate group-hover:text-white transition-colors">
                      {link.name}
                    </h4>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider shrink-0 ${getCategoryBadge(
                        link.category
                      )}`}
                    >
                      {link.category}
                    </span>
                  </div>

                  <a
                    href={formatUrlWithProtocol(link.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs font-mono text-[#c3c0ff] hover:underline truncate w-fit"
                  >
                    {cleanUrlDisplay(link.url)}
                  </a>

                  <p className="text-xs text-[#c7c4d8] line-clamp-1 mt-0.5">
                    {link.description || 'No description provided.'}
                  </p>
                </div>

                {/* Floating Hover Actions matching Stitch HTML */}
                <div className="absolute right-4 top-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[#131b2e] pl-2 rounded-l-lg shadow-[-10px_0_10px_rgba(19,27,46,0.9)] border border-slate-700/50">
                  <button
                    onClick={(e) => handleCopy(e, link)}
                    className="p-1.5 text-[#c7c4d8] hover:text-[#c3c0ff] hover:bg-[#222a3d] rounded transition-colors"
                    title="Copy Link"
                  >
                    {copiedId === link._id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={(e) => handleOpen(e, link)}
                    className="p-1.5 text-[#c7c4d8] hover:text-white hover:bg-[#222a3d] rounded transition-colors"
                    title="Open Link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(link);
                    }}
                    className="p-1.5 text-[#c7c4d8] hover:text-indigo-300 hover:bg-[#222a3d] rounded transition-colors"
                    title="Edit Link"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteModal(link);
                    }}
                    className="p-1.5 text-[#c7c4d8] hover:text-red-400 hover:bg-red-950/40 rounded transition-colors"
                    title="Delete Link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Clean Empty State */
          <div className="bg-[#171f33] border border-[#464555]/20 rounded-xl p-10 text-center flex flex-col items-center justify-center shadow-lg">
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
      </section>
    </div>
  );
}
