'use client';

import React, { useState, useEffect } from 'react';
import { useLinkVault } from '@/context/LinkVaultContext';
import { formatDate } from '@/lib/utils';
import { User, Mail, Calendar, Save, Loader2, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { user, refreshUserData, showToast } = useLinkVault();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const presetAvatars = [
    `https://api.dicebear.com/7.x/avataaars/svg?seed=Alex`,
    `https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah`,
    `https://api.dicebear.com/7.x/avataaars/svg?seed=Michael`,
    `https://api.dicebear.com/7.x/avataaars/svg?seed=Elena`,
    `https://api.dicebear.com/7.x/avataaars/svg?seed=David`,
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), avatar }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');

      await refreshUserData();
      showToast('Profile updated successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error updating profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Profile</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your personal account details.</p>
      </div>

      {/* Main Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#101726] border border-[#1b253b] rounded-2xl p-6 md:p-8 shadow-xl flex flex-col gap-6"
      >
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#1b253b]">
          <img
            src={
              avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                name || 'User'
              )}`
            }
            alt="Avatar"
            className="w-24 h-24 rounded-full bg-slate-800 object-cover border-2 border-indigo-500/40 shadow-lg"
          />
          <div className="flex flex-col text-center sm:text-left">
            <h3 className="text-xl font-bold text-white">{user?.name || 'User'}</h3>
            <p className="text-xs text-slate-400 font-mono">{user?.email}</p>

            {/* Avatar Selector */}
            <div className="flex items-center gap-2 mt-4 justify-center sm:justify-start">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Choose Preset:
              </span>
              {presetAvatars.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatar(preset)}
                  className={`w-7 h-7 rounded-full overflow-hidden border-2 transition ${
                    avatar === preset ? 'border-indigo-500 scale-110' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={preset} alt="preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#0d1320] border border-[#1e2a42] rounded-xl text-slate-100 text-sm pl-10 pr-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative opacity-70">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full bg-[#0d1320] border border-[#1e2a42] rounded-xl text-slate-400 text-sm pl-10 pr-4 py-2.5 cursor-not-allowed"
              />
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Email address cannot be changed.</span>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Member Since
            </label>
            <div className="relative opacity-70">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formatDate(user?.createdAt || new Date())}
                disabled
                className="w-full bg-[#0d1320] border border-[#1e2a42] rounded-xl text-slate-400 text-sm pl-10 pr-4 py-2.5 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#1b253b] flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#5852f6] hover:bg-[#4842eb] active:scale-95 text-white font-medium text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
