'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLinkVault } from '@/context/LinkVaultContext';
import { LinkCard } from '@/components/LinkCard';
import { Search, X, Lock, SearchX, Plus, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  const {
    links,
    loading,
    fetchLinks,
    openAddModal,
    openEditModal,
    openDeleteModal,
    showToast,
  } = useLinkVault();

  useEffect(() => {
    fetchLinks('All', query);
  }, [query, fetchLinks]);

  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Search Vault</h1>
      </div>

      {/* Large Search Input */}
      <div className="relative max-w-2xl w-full">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, URL, or description..."
          className="w-full bg-[#101726] border border-[#1d273e] text-slate-100 placeholder-slate-500 text-base pl-12 pr-12 py-3.5 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-inner"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#1b263e] transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Results Section */}
      {query.trim() && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#172238] pb-3">
            <h2 className="text-xs uppercase font-bold tracking-widest text-slate-400">
              RESULTS FOR &quot;{query}&quot;
            </h2>
            <span className="text-xs font-semibold text-indigo-400 bg-indigo-950/60 border border-indigo-800/40 px-2.5 py-0.5 rounded-full">
              {links.length} found
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-44 bg-[#101726] border border-[#1b253b] rounded-2xl animate-pulse"
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
            </div>
          ) : (
            <div className="bg-[#101726] border border-[#1b253b] rounded-2xl p-8 text-center flex flex-col items-center justify-center my-4">
              <div className="w-12 h-12 rounded-full bg-[#182238] border border-[#23314f] flex items-center justify-center text-slate-400 mb-3">
                <SearchX className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">No links found</h3>
              <p className="text-xs text-slate-400 max-w-sm mb-4">
                We couldn&apos;t find anything matching &quot;{query}&quot;. Try a different search term.
              </p>
              <button
                onClick={handleClear}
                className="px-4 py-2 rounded-xl border border-[#232f48] bg-[#131a29] hover:bg-[#1a253c] text-slate-300 text-xs font-medium transition"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      )}

      {/* Stitch Empty State Demonstrations Section */}
      <div className="flex flex-col gap-4 mt-6 pt-8 border-t border-[#172238]">
        <h2 className="text-xs uppercase font-bold tracking-widest text-slate-400">
          EMPTY STATE DEMONSTRATIONS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: No Links Yet */}
          <div className="bg-[#101726] border border-[#1b253b] rounded-2xl p-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-[#172136] border border-[#23314f] flex items-center justify-center text-indigo-400 mb-4 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">No links yet</h3>
            <p className="text-xs text-slate-400 max-w-xs mb-5 leading-relaxed">
              Start building your personal LinkVault by saving your first important URL.
            </p>
            <button
              onClick={openAddModal}
              className="bg-[#5852f6] hover:bg-[#4842eb] text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/25 flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Link</span>
            </button>
          </div>

          {/* Card 2: No Links Found */}
          <div className="bg-[#101726] border border-[#1b253b] rounded-2xl p-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-[#182238] border border-[#23314f] flex items-center justify-center text-slate-400 mb-4">
              <SearchX className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">No links found</h3>
            <p className="text-xs text-slate-400 max-w-xs mb-5 leading-relaxed">
              We couldn&apos;t find anything matching &quot;xyz123&quot;. Try a different search term or check your filters.
            </p>
            <button
              onClick={handleClear}
              className="px-5 py-2.5 rounded-xl border border-[#232f48] bg-[#121928] hover:bg-[#1a253c] text-slate-300 text-xs font-medium transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Clear Search</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-slate-400">Loading search...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
