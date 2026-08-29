'use client';

import React from 'react';
import { CategoryType } from '@/types';
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
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              isSelected
                ? 'bg-[#5852f6] text-white shadow-md shadow-indigo-600/25'
                : 'bg-[#101726] hover:bg-[#182238] text-slate-300 border border-[#1e2942]'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};
