'use client';

import React from 'react';
import Link from 'next/link';
import {
  Rocket,
  Shield,
  Zap,
  FolderKanban,
  Command,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070c19] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#070c19]/80 backdrop-blur-md border-b border-[#162035] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition">
              <Rocket className="w-4 h-4" />
            </div>
            <span className="font-bold text-white tracking-tight text-lg">LinkVault</span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition">
              Features
            </a>
            <a href="#pricing" className="hover:text-white transition">
              Pricing
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-300 hover:text-white transition px-3 py-1.5"
            >
              Sign In
            </Link>
            <Link
              href="/login?mode=register"
              className="bg-[#5852f6] hover:bg-[#4842eb] active:scale-95 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-lg shadow-indigo-600/25 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-36 pb-20 px-6 max-w-5xl mx-auto text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-800/40 text-indigo-300 text-xs font-medium mb-6">
            <SparkleIcon />
            <span>Redesigned LinkVault Workspace 2.0</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
            Your Links. <br />
            <span className="bg-gradient-to-r from-indigo-300 via-indigo-200 to-white bg-clip-text text-transparent">
              One Simple Vault.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl font-normal leading-relaxed mb-8">
            Store, organize and access all your important links from one beautiful workspace
            designed for focus and speed.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
            <Link
              href="/login?mode=register"
              className="bg-[#5852f6] hover:bg-[#4842eb] active:scale-95 text-white text-sm font-semibold px-6 py-3.5 rounded-xl shadow-xl shadow-indigo-600/30 transition flex items-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="bg-[#121a2b] hover:bg-[#1a253d] border border-[#202c46] text-slate-200 text-sm font-semibold px-6 py-3.5 rounded-xl transition"
            >
              Sign In
            </Link>
          </div>
        </motion.div>

        {/* Hero Showcase Image (Curved Monitor Preview matching Image 2) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative w-full max-w-4xl rounded-2xl overflow-hidden border border-[#1b2742] bg-[#0b1222] p-2 shadow-2xl shadow-indigo-950/50"
        >
          {/* Top Bar Mockup */}
          <div className="w-full bg-[#0d1528] px-4 py-2.5 rounded-t-xl flex items-center gap-2 border-b border-[#1b2742]">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="flex-1 max-w-xs mx-auto bg-[#141d33] border border-[#202d4b] rounded-md text-[11px] text-slate-400 py-1 px-3 text-center font-mono">
              linkvault.app/dashboard
            </div>
          </div>

          {/* Curved Screen Mockup Visual */}
          <div className="relative bg-[#070c19] p-6 rounded-b-xl overflow-hidden min-h-[340px] flex flex-col justify-between text-left border-t border-[#162138]">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/10 via-transparent to-purple-900/10 pointer-events-none" />

            {/* Dashboard Header Bar Mock */}
            <div className="flex items-center justify-between border-b border-[#172238] pb-4 mb-4">
              <div>
                <span className="text-lg font-bold text-white block">Good morning, Alex 👋</span>
                <span className="text-xs text-slate-400">Keep your links organized and secure.</span>
              </div>
              <div className="bg-[#5852f6] text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1">
                + Add New Link
              </div>
            </div>

            {/* Mini Cards Grid Mock */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-[#101726] border border-[#1b253b] p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 font-semibold block">Total Links</span>
                <span className="text-xl font-bold text-white">24</span>
              </div>
              <div className="bg-[#101726] border border-[#1b253b] p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 font-semibold block">Categories</span>
                <span className="text-xl font-bold text-white">6</span>
              </div>
              <div className="bg-[#101726] border border-[#1b253b] p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 font-semibold block">Added This Week</span>
                <span className="text-xl font-bold text-white">5</span>
              </div>
            </div>

            {/* Recent Items Grid Mock */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#101726] border border-[#1b253b] p-3.5 rounded-xl flex flex-col gap-1">
                <span className="text-xs font-bold text-indigo-300">Tailwind CSS Documentation</span>
                <span className="text-[10px] text-slate-400 font-mono">tailwindcss.com/docs</span>
              </div>
              <div className="bg-[#101726] border border-[#1b253b] p-3.5 rounded-xl flex flex-col gap-1">
                <span className="text-xs font-bold text-indigo-300">LinkVault Architecture</span>
                <span className="text-[10px] text-slate-400 font-mono">figma.com/architecture</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Engineered for Clarity Section */}
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto text-center">
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Engineered for Clarity
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Everything you need to manage knowledge, nothing you don&apos;t.
          </p>
        </div>

        {/* Feature Cards Grid matching Image 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/* Card 1: Secure Storage */}
          <div className="bg-[#0e1628] border border-[#1b2742] p-8 rounded-2xl flex flex-col gap-4 shadow-sm hover:border-indigo-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/70 border border-indigo-800/40 flex items-center justify-center text-indigo-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Secure Storage</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Your data is encrypted at rest and in transit. We prioritize privacy and security
                above all else, ensuring your vault remains yours alone.
              </p>
            </div>
          </div>

          {/* Card 2: Fast Search */}
          <div className="bg-[#0e1628] border border-[#1b2742] p-8 rounded-2xl flex flex-col gap-4 shadow-sm hover:border-indigo-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/70 border border-indigo-800/40 flex items-center justify-center text-indigo-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Fast Search</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Lightning-fast fuzzy search helps you find that one specific link instantly without
                digging through browser bookmarks.
              </p>
            </div>
          </div>

          {/* Card 3: Easy Organization */}
          <div className="bg-[#0e1628] border border-[#1b2742] p-8 rounded-2xl flex flex-col gap-4 shadow-sm hover:border-indigo-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/70 border border-indigo-800/40 flex items-center justify-center text-indigo-400">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Easy Organization</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Categorize with tags, folders, and smart collections tailored to your personal
                and professional workflow.
              </p>
            </div>
          </div>

          {/* Card 4: One-Click Access */}
          <div className="bg-[#0e1628] border border-[#1b2742] p-8 rounded-2xl flex flex-col gap-4 shadow-sm hover:border-indigo-500/40 transition relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/70 border border-indigo-800/40 flex items-center justify-center text-indigo-400">
              <Command className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">One-Click Access</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
                Pin your most-used links to a dedicated quick-access bar. Use keyboard shortcuts to
                open them without touching your mouse.
              </p>
            </div>
            <Command className="w-32 h-32 text-slate-800/20 absolute -right-6 -bottom-6 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Pricing / Plan Section */}
      <section id="pricing" className="py-16 px-6 max-w-4xl mx-auto text-center">
        <div className="bg-[#0e1628] border border-[#1b2742] rounded-3xl p-8 sm:p-12 flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-400 mb-2">
            FREE FOREVER PLAN
          </span>
          <h2 className="text-3xl font-extrabold text-white mb-4">Unlimited Workspace Access</h2>
          <p className="text-sm text-slate-400 max-w-md mb-8">
            Create unlimited links, custom folders, fast search index, and secure authentication
            with zero subscription fees.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-300 mb-8">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Unlimited Links
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 7 Category Folders
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> End-to-End Encryption
            </span>
          </div>
          <Link
            href="/login?mode=register"
            className="bg-[#5852f6] hover:bg-[#4842eb] active:scale-95 text-white font-semibold text-sm px-8 py-3.5 rounded-xl shadow-xl shadow-indigo-600/25 transition"
          >
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Bottom CTA Banner matching Image 2 */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center flex flex-col items-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          Stop searching for your important links.
        </h2>
        <p className="text-sm sm:text-base text-slate-400 max-w-md mb-8">
          Join thousands of professionals who have simplified their digital workspace.
        </p>
        <Link
          href="/login?mode=register"
          className="bg-[#5852f6] hover:bg-[#4842eb] active:scale-95 text-white text-sm font-semibold px-8 py-3.5 rounded-xl shadow-xl shadow-indigo-600/30 transition"
        >
          Create Your Vault
        </Link>
      </section>

      {/* Footer matching Image 2 */}
      <footer className="mt-auto border-t border-[#162035] py-8 px-6 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-indigo-400" />
            <span>LinkVault © 2026</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition">
              Terms
            </a>
            <a href="#" className="hover:text-white transition">
              Twitter
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  );
}
