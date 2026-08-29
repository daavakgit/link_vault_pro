'use client';

import React, { useState } from 'react';
import { useLinkVault } from '@/context/LinkVaultContext';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  Palette,
  LogOut,
  User,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const { user, showToast } = useLinkVault();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'account' | 'security' | 'appearance'>('account');

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/settings/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update password');

      showToast('Password updated successfully', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setError(err.message || 'Error updating password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Settings</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your account preferences, security, and application settings.
        </p>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-[#172238] pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('account')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
            activeTab === 'account'
              ? 'bg-[#1e273d] text-white border border-[#2b3a5c]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#101726]'
          }`}
        >
          <User className="w-4 h-4 text-indigo-400" />
          <span>Account</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
            activeTab === 'security'
              ? 'bg-[#1e273d] text-white border border-[#2b3a5c]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#101726]'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Security</span>
        </button>

        <button
          onClick={() => setActiveTab('appearance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
            activeTab === 'appearance'
              ? 'bg-[#1e273d] text-white border border-[#2b3a5c]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#101726]'
          }`}
        >
          <Palette className="w-4 h-4 text-purple-400" />
          <span>Appearance</span>
        </button>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#101726] border border-[#1b253b] rounded-2xl p-6 md:p-8 shadow-xl"
      >
        {activeTab === 'account' && (
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-white mb-2">Account Overview</h2>
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#0d1320] border border-[#1e2a42]">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block mb-1">
                  CURRENT PLAN
                </span>
                <span className="text-lg font-extrabold text-indigo-400">PRO PLAN</span>
              </div>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1 rounded-full">
                Active
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                Registered Email
              </span>
              <p className="text-sm text-slate-200 font-mono bg-[#0d1320] p-3 rounded-xl border border-[#1e2a42]">
                {user?.email || 'user@example.com'}
              </p>
            </div>

            <div className="pt-6 border-t border-[#1b253b] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Log Out of LinkVault</h3>
                <p className="text-xs text-slate-400">End your active session on this device.</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-red-950/50 hover:bg-red-900/60 border border-red-800/50 text-red-300 text-xs font-semibold transition flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Change Password</h2>
              <p className="text-xs text-slate-400">
                Update your password to keep your account secure.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/50 text-red-300 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4 max-w-md">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full bg-[#0d1320] border border-[#1e2a42] rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full bg-[#0d1320] border border-[#1e2a42] rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  className="w-full bg-[#0d1320] border border-[#1e2a42] rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 bg-[#5852f6] hover:bg-[#4842eb] active:scale-95 text-white font-medium text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition self-start"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                <span>Update Password</span>
              </button>
            </form>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Theme & Appearance</h2>
              <p className="text-xs text-slate-400">Customize the visual styling of your workspace.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
              <div className="p-4 rounded-2xl bg-[#0d1320] border-2 border-indigo-500 flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700" />
                  <div>
                    <span className="text-sm font-bold text-white block">Dark Navy Theme</span>
                    <span className="text-[11px] text-indigo-400 font-medium">Stitch Default</span>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
