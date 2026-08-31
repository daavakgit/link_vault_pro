'use client';

import React from 'react';
import { CATEGORIES } from '@/lib/constants';

interface CategoryPillsProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const allCategories = ['All', ...CATEGORIES];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      {allCategories.map((cat) => {
        const isSelected = selectedCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all active:scale-95 ${
              isSelected
                ? 'bg-[#4f46e5] text-[#dad7ff] shadow-lg shadow-indigo-600/20 border border-[#4f46e5]'
                : 'bg-[#171f33] hover:bg-[#222a3d] text-[#c7c4d8] border border-[#464555]/30'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};
