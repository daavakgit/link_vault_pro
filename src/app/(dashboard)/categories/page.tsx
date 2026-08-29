'use client';

import React, { useState } from 'react';
import { useLinkVault } from '@/context/LinkVaultContext';
import { CATEGORIES, CATEGORY_COLORS } from '@/lib/constants';
import { CategoryType } from '@/types';
import { LinkCard } from '@/components/LinkCard';
import { FolderKanban, Plus, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CategoriesPage() {
  const { links, loading, openAddModal, openEditModal, openDeleteModal, showToast } =
    useLinkVault();
  const [selectedCat, setSelectedCat] = useState<string>('All');

  const getLinksByCategory = (cat: CategoryType) => {
    return links.filter((l) => l.category === cat);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#dae2fd] tracking-tight">Categories</h1>
        <p className="text-sm text-[#c7c4d8] mt-1">
          Explore and manage your saved links by folder.
        </p>
      </div>

      {/* Category Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <button
          onClick={() => setSelectedCat('All')}
          className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
            selectedCat === 'All'
              ? 'bg-[#4f46e5] border-[#4f46e5] text-[#dad7ff] shadow-lg shadow-indigo-600/20'
              : 'bg-[#171f33] border-[#464555]/20 hover:bg-[#222a3d] text-[#c7c4d8]'
          }`}
        >
          <Layers className="w-5 h-5 mb-2" />
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider mb-0.5">All</span>
            <span className="text-lg font-extrabold">{links.length}</span>
          </div>
        </button>

        {CATEGORIES.map((cat) => {
          const count = getLinksByCategory(cat).length;
          const isSelected = selectedCat === cat;
          const style = CATEGORY_COLORS[cat];

          return (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                isSelected
                  ? 'bg-[#4f46e5] border-[#4f46e5] text-[#dad7ff] shadow-lg shadow-indigo-600/20'
                  : 'bg-[#171f33] border-[#464555]/20 hover:bg-[#222a3d] text-[#c7c4d8]'
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full border mb-2 ${style.bg} ${style.border}`}
              />
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider truncate mb-0.5">
                  {cat}
                </span>
                <span className="text-lg font-extrabold">{count}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Categorized Link Sections */}
      {selectedCat === 'All' ? (
        <div className="flex flex-col gap-10">
          {CATEGORIES.map((cat) => {
            const catLinks = getLinksByCategory(cat);
            if (catLinks.length === 0) return null;

            return (
              <div key={cat} className="flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-[#464555]/20 pb-2">
                  <FolderKanban className="w-4 h-4 text-[#c3c0ff]" />
                  <h2 className="text-base font-bold text-[#dae2fd] uppercase tracking-wider">
                    {cat}
                  </h2>
                  <span className="text-xs font-semibold text-[#c7c4d8] bg-[#222a3d] px-2 py-0.5 rounded-full">
                    {catLinks.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {catLinks.map((link) => (
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
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-[#172238] pb-2">
            <FolderKanban className="w-4 h-4 text-indigo-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              {selectedCat}
            </h2>
            <span className="text-xs font-semibold text-slate-400 bg-[#162035] px-2 py-0.5 rounded-full">
              {getLinksByCategory(selectedCat as CategoryType).length}
            </span>
          </div>

          {getLinksByCategory(selectedCat as CategoryType).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {getLinksByCategory(selectedCat as CategoryType).map((link) => (
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
            <div className="bg-[#171f33] border border-[#464555]/20 rounded-xl p-10 text-center flex flex-col items-center justify-center shadow-lg">
              <p className="text-[#c7c4d8] text-sm mb-4">No links stored under &quot;{selectedCat}&quot; category.</p>
              <button
                onClick={openAddModal}
                className="bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-semibold px-4 py-2 rounded-lg transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Link</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
