'use client';

import React, { useState } from 'react';
import { ILink, CategoryType } from '@/types';
import { cleanUrlDisplay, formatUrlWithProtocol } from '@/lib/utils';
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

// Stitch-exact category icon colors
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

// Stitch-exact category badge styles
const getCategoryBadge = (category: CategoryType) => {
  switch (category) {
    case 'Coding':
      return 'bg-[#3131c0]/20 text-[#c0c1ff]';
    case 'Projects':
      return 'bg-[#a44100]/20 text-[#ffb695]';
    case 'Career':
      return 'bg-[#2f2ebe]/20 text-[#b0b2ff]';
    case 'Education':
      return 'bg-[#3131c0]/20 text-[#c0c1ff]';
    case 'Social':
      return 'bg-[#a44100]/20 text-[#ffb695]';
    case 'Learning':
      return 'bg-[#464555]/30 text-[#c7c4d8]';
    default:
      return 'bg-[#464555]/30 text-[#c7c4d8]';
  }
};

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

  // ─── RECENT CARD (Dashboard) ──────────────────────────────────────────────
  if (variant === 'recent') {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className="group relative bg-[#171f33] border border-[#464555]/20 hover:border-[#464555]/50 rounded-xl p-4 flex gap-4 items-start transition-all hover:bg-[#131b2e] shadow-lg"
      >
        {/* Left Icon Box */}
        <div className="w-12 h-12 shrink-0 rounded-lg bg-[#31394d] flex items-center justify-center shadow-inner border border-[#464555]/20">
          {getCategoryIcon(link.category)}
        </div>

        {/* Content */}
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

          <div className="flex items-center gap-2 mt-0.5">
            <a
              href={formatUrlWithProtocol(link.url)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-mono text-[#c3c0ff] hover:underline truncate"
            >
              {cleanUrlDisplay(link.url)}
            </a>
            <button
              onClick={handleCopy}
              title="Copy URL"
              className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#222a3d] hover:bg-[#31394d] text-[#c3c0ff] flex items-center gap-1 shrink-0 transition active:scale-95 border border-[#464555]/30"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {link.description && (
            <p className="text-xs text-[#c7c4d8] line-clamp-1 mt-1">{link.description}</p>
          )}
        </div>

        {/* Hover Actions — Stitch-exact floating overlay */}
        <div className="absolute right-4 top-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[#131b2e] pl-2 rounded-l-lg shadow-[-10px_0_10px_rgba(19,27,46,0.9)] border-l border-y border-[#464555]/30">
          <button
            onClick={handleCopy}
            title="Copy Link"
            className="p-1.5 text-[#c7c4d8] hover:text-[#c3c0ff] hover:bg-[#222a3d] rounded transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={handleOpen}
            title="Open Link"
            className="p-1.5 text-[#c7c4d8] hover:text-[#dae2fd] hover:bg-[#222a3d] rounded transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(link);
              }}
              title="Edit"
              className="p-1.5 text-[#c7c4d8] hover:text-[#dae2fd] hover:bg-[#222a3d] rounded transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(link);
              }}
              title="Delete"
              className="p-1.5 text-[#c7c4d8] hover:text-[#ffb4ab] hover:bg-[#ffb4ab]/10 rounded transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  // ─── GRID CARD (My Links / Categories) ───────────────────────────────────
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="group relative bg-[#171f33] border border-[#464555]/20 hover:border-[#464555]/40 p-5 rounded-xl transition-all flex flex-col justify-between h-48 shadow-lg hover:shadow-xl hover:bg-[#131b2e]"
    >
      <div>
        {/* Top: Badge + Actions */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${getCategoryBadge(
              link.category
            )}`}
          >
            {link.category}
          </span>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              title="Copy URL"
              className="p-1.5 rounded-lg text-[#c7c4d8] hover:text-[#c3c0ff] hover:bg-[#222a3d] transition"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={handleOpen}
              title="Open link"
              className="p-1.5 rounded-lg text-[#c7c4d8] hover:text-[#dae2fd] hover:bg-[#222a3d] transition"
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
                className="p-1.5 rounded-lg text-[#c7c4d8] hover:text-[#c3c0ff] hover:bg-[#222a3d] transition"
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
                className="p-1.5 rounded-lg text-[#c7c4d8] hover:text-[#ffb4ab] hover:bg-[#ffb4ab]/10 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-[#dae2fd] text-base leading-snug group-hover:text-white transition line-clamp-1 mb-2">
          {link.name}
        </h3>

        {/* Description */}
        {link.description && (
          <p className="text-xs text-[#c7c4d8] line-clamp-1 mb-2">{link.description}</p>
        )}
      </div>

      {/* Footer: URL + Visible Copy Button */}
      <div className="flex items-center justify-between text-xs text-[#918fa1] transition pt-2.5 border-t border-[#464555]/20">
        <div className="flex items-center gap-1.5 truncate group-hover:text-[#c3c0ff] min-w-0 flex-1">
          <Link2 className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate font-mono text-[11px]">{cleanUrlDisplay(link.url)}</span>
        </div>
        <button
          onClick={handleCopy}
          title="Copy URL"
          className="ml-2 px-2.5 py-1 rounded text-[11px] font-semibold bg-[#222a3d] hover:bg-[#31394d] text-[#c3c0ff] flex items-center gap-1 shrink-0 transition active:scale-95 border border-[#464555]/30"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
