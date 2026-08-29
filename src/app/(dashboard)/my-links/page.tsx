'use client';

import React, { useState, useEffect } from 'react';
import { useLinkVault } from '@/context/LinkVaultContext';
import { CategoryPills } from '@/components/CategoryPills';
import { LinkCard } from '@/components/LinkCard';
import { Plus, Search, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MyLinksPage() {
  const {
    links,
    loading,
    fetchLinks,
    openAddModal,
    openEditModal,
    openDeleteModal,
    showToast,
  } = useLinkVault();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLinks(selectedCategory, searchTerm);
  }, [selectedCategory, searchTerm, fetchLinks]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">My Links</h1>
        <p className="text-sm text-slate-400 mt-1">Manage all your saved links.</p>
      </div>

      {/* Filter and Search Bar Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Filter Pills */}
        <CategoryPills
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />

        {/* Search Input Box */}
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search links..."
            className="w-full bg-[#101726] border border-[#1d273e] text-slate-100 placeholder-slate-500 text-sm pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>
      </div>

      {/* Grid of Link Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-44 bg-[#101726] border border-[#1b253b] rounded-2xl animate-pulse p-5"
            />
          ))}
        </div>
      ) : links.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {links.map((link) => (
            <LinkCard
              key={link._id}
              link={link}
              variant="grid"
              onEdit={openEditModal}
              onDelete={openDeleteModal}
              onCopy={() => showToast('Link copied to clipboard', 'info')}
            />
          ))}

          {/* Dotted + Add New Link Card (Matching Stitch design) */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            onClick={openAddModal}
            className="border-2 border-dashed border-[#202c46] hover:border-indigo-500/50 bg-[#0d1320]/50 hover:bg-[#101726] rounded-2xl h-44 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-indigo-300 transition cursor-pointer group shadow-sm"
          >
            <div className="w-10 h-10 rounded-full bg-[#162035] border border-[#23314f] flex items-center justify-center group-hover:border-indigo-500/40 group-hover:bg-indigo-600/20 transition">
              <Plus className="w-5 h-5 text-slate-400 group-hover:text-indigo-400" />
            </div>
            <span className="text-xs font-semibold tracking-wide">Add New Link</span>
          </motion.div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-[#101726] border border-[#1b253b] rounded-2xl p-12 text-center flex flex-col items-center justify-center my-6">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">
            {searchTerm || selectedCategory !== 'All' ? 'No matching links' : 'No links yet'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
            {searchTerm || selectedCategory !== 'All'
              ? 'Try adjusting your search query or category filter.'
              : 'Start building your personal LinkVault by saving your first important URL.'}
          </p>
          <button
            onClick={openAddModal}
            className="bg-[#5852f6] hover:bg-[#4842eb] text-white text-sm font-medium px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-indigo-600/25"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Link</span>
          </button>
        </div>
      )}
    </div>
  );
}
