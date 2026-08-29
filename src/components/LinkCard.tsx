'use client';

import React, { useState } from 'react';
import { ILink, CategoryType } from '@/types';
import { cleanUrlDisplay, formatUrlWithProtocol } from '@/lib/utils';
import { CATEGORY_COLORS } from '@/lib/constants';
import {
  Link2,
  Copy,
  ExternalLink,
  Edit2,
  Trash2,
  Check,
  Code,
  Palette,
  FileText,
  Video,
  Bookmark,
  Briefcase,
  GraduationCap,
  Users,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface LinkCardProps {
  link: ILink;
  variant?: 'grid' | 'recent';
  onEdit?: (link: ILink) => void;
  onDelete?: (link: ILink) => void;
  onCopy?: (url: string) => void;
}

export const LinkCard: React.FC<LinkCardProps> = ({
  link,
  variant = 'grid',
  onEdit,
  onDelete,
  onCopy,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(link.url);
    setCopied(true);
    if (onCopy) onCopy(link.url);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(formatUrlWithProtocol(link.url), '_blank', 'noopener,noreferrer');
  };

  const getCategoryIcon = (category: CategoryType) => {
    switch (category) {
      case 'Coding':
        return <Code className="w-5 h-5 text-indigo-400" />;
      case 'Projects':
        return <Palette className="w-5 h-5 text-purple-400" />;
      case 'Career':
        return <Briefcase className="w-5 h-5 text-blue-400" />;
      case 'Education':
        return <GraduationCap className="w-5 h-5 text-cyan-400" />;
      case 'Social':
        return <Users className="w-5 h-5 text-pink-400" />;
      case 'Learning':
        return <FileText className="w-5 h-5 text-emerald-400" />;
      default:
        return <Bookmark className="w-5 h-5 text-slate-400" />;
    }
  };

  const badgeStyle = CATEGORY_COLORS[link.category as CategoryType] || CATEGORY_COLORS.Others;

  if (variant === 'recent') {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className="group relative bg-[#101726] border border-[#1b253b] hover:border-[#2b3a5c] p-4 rounded-2xl transition-all flex items-start gap-4 shadow-sm hover:shadow-lg hover:shadow-indigo-950/20"
      >
        {/* Left Icon Box */}
        <div className="w-11 h-11 rounded-xl bg-[#172136] border border-[#23314f] flex items-center justify-center shrink-0 group-hover:bg-[#1f2d4a] transition">
          {getCategoryIcon(link.category)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-semibold text-white text-base truncate group-hover:text-indigo-200 transition">
              {link.name}
            </h3>
            <span
              className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
            >
              {link.category}
            </span>
          </div>

          <p className="text-xs text-indigo-300/80 font-mono truncate mb-1">
            {cleanUrlDisplay(link.url)}
          </p>

          {link.description && (
            <p className="text-xs text-slate-400 line-clamp-1 leading-relaxed">
              {link.description}
            </p>
          )}
        </div>

        {/* Actions Menu */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            title="Copy URL"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1d2944] transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleOpen}
            title="Open link"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1d2944] transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    );
  }

  // Grid Card View (My Links Page)
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="group relative bg-[#101726] border border-[#1b253b] hover:border-[#2d3d61] p-5 rounded-2xl transition-all flex flex-col justify-between h-44 shadow-sm hover:shadow-xl hover:shadow-indigo-950/30"
    >
      <div>
        {/* Top Header: Badge + Actions */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
          >
            {link.category}
          </span>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              title="Copy URL"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a253d] transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleOpen}
              title="Open link"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a253d] transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(link);
                }}
                title="Edit link"
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-[#1a253d] transition"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(link);
                }}
                title="Delete link"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-[#1a253d] transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-white text-base leading-snug group-hover:text-indigo-200 transition line-clamp-1 mb-2">
          {link.name}
        </h3>

        {/* Description if present */}
        {link.description && (
          <p className="text-xs text-slate-400 line-clamp-1 mb-2 font-normal">
            {link.description}
          </p>
        )}
      </div>

      {/* Footer: Clean URL */}
      <div className="flex items-center gap-1.5 text-xs text-slate-400 group-hover:text-indigo-300 transition pt-2 border-t border-[#162033]">
        <Link2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span className="truncate font-mono">{cleanUrlDisplay(link.url)}</span>
      </div>
    </motion.div>
  );
};
