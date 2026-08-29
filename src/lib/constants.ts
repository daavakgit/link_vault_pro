import { CategoryType } from '@/types';

export const CATEGORIES: CategoryType[] = [
  'Coding',
  'Projects',
  'Career',
  'Education',
  'Social',
  'Learning',
  'Others',
];

export const CATEGORY_COLORS: Record<CategoryType, { bg: string; text: string; border: string }> = {
  Coding: {
    bg: 'bg-indigo-950/70',
    text: 'text-indigo-300',
    border: 'border-indigo-800/40',
  },
  Projects: {
    bg: 'bg-purple-950/70',
    text: 'text-purple-300',
    border: 'border-purple-800/40',
  },
  Career: {
    bg: 'bg-blue-950/70',
    text: 'text-blue-300',
    border: 'border-blue-800/40',
  },
  Education: {
    bg: 'bg-cyan-950/70',
    text: 'text-cyan-300',
    border: 'border-cyan-800/40',
  },
  Social: {
    bg: 'bg-pink-950/70',
    text: 'text-pink-300',
    border: 'border-pink-800/40',
  },
  Learning: {
    bg: 'bg-emerald-950/70',
    text: 'text-emerald-300',
    border: 'border-emerald-800/40',
  },
  Others: {
    bg: 'bg-slate-800/70',
    text: 'text-slate-300',
    border: 'border-slate-700/40',
  },
};
