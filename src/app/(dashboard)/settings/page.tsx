'use client';

import React, { useState, useEffect } from 'react';
import { useLinkVault } from '@/context/LinkVaultContext';
import {
  User,
  Mail,
  Pencil,
  Shield,
  Palette,
  Moon,
  Sun,
  Monitor,
  AlertTriangle,
  Lock,
  Check,
  X,
  Loader2,
  Save,
  KeyRound,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
  const { user, links, refreshUserData, showToast } = useLinkVault();

  // Profile Form State
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Avatar Modal State
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [tempAvatar, setTempAvatar] = useState('');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  // Password State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Appearance State
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');

  // 2FA Toggle State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAvatar(user.avatar || '');
      setTempAvatar(user.avatar || '');
    }
  }, [user]);

  const presetAvatars = [
    `https://api.dicebear.com/7.x/avataaars/svg?seed=Alex`,
    `https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah`,
    `https://api.dicebear.com/7.x/avataaars/svg?seed=Michael`,
    `https://api.dicebear.com/7.x/avataaars/svg?seed=Elena`,
    `https://api.dicebear.com/7.x/avataaars/svg?seed=David`,
    `https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica`,
  ];

  // Calculate distinct categories count
  const categoriesCount = new Set(links.map((l) => l.category)).size;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }

    try {
      setIsSavingProfile(true);
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
      setIsSavingProfile(false);
    }
  };

  const handleApplyAvatar = async () => {
    const finalAvatar = customAvatarUrl.trim() || tempAvatar;
    setAvatar(finalAvatar);
    setIsAvatarModalOpen(false);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), avatar: finalAvatar }),
      });
      if (res.ok) {
        await refreshUserData();
        showToast('Avatar updated successfully', 'success');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      setIsSavingPassword(true);
      const res = await fetch('/api/settings/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update password');

      showToast('Password updated successfully', 'success');
      setIsPasswordModalOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Error updating password');
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl pb-12">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Settings</h1>
      </div>

      {/* Main Grid matching Image 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Avatar Card & Stats Row) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Avatar Profile Card */}
          <div className="bg-[#0c1222] border border-[#1b253b] rounded-2xl p-6 flex flex-col items-center text-center shadow-xl relative">
            <div className="relative group">
              <img
                src={
                  avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                    name || 'User'
                  )}`
                }
                alt={user?.name || 'User'}
                className="w-28 h-28 rounded-full bg-slate-800 object-cover border-2 border-[#23314f] shadow-lg"
              />
              <button
                onClick={() => {
                  setTempAvatar(avatar);
                  setIsAvatarModalOpen(true);
                }}
                className="absolute bottom-1 right-1 bg-[#5852f6] hover:bg-[#4842eb] text-white p-2 rounded-full shadow-lg border-2 border-[#0c1222] transition active:scale-95"
                title="Edit Avatar"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>

            <h2 className="text-xl font-bold text-white mt-4 tracking-tight">
              {user?.name || 'Alex Chen'}
            </h2>
            <span className="text-xs text-slate-400 font-mono mt-1 mb-5">
              {user?.email || 'alex.chen@example.com'}
            </span>

            <button
              onClick={() => {
                setTempAvatar(avatar);
                setIsAvatarModalOpen(true);
              }}
              className="w-full bg-[#162035] hover:bg-[#1f2d4a] border border-[#23314f] text-slate-200 text-xs font-semibold py-2.5 rounded-xl transition"
            >
              Edit Profile
            </button>
          </div>

          {/* Stats Summary Row Card matching Image 1 */}
          <div className="bg-[#0c1222] border border-[#1b253b] rounded-2xl p-5 grid grid-cols-2 text-center divide-x divide-[#1b253b] shadow-xl">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-extrabold text-white tracking-tight">
                {links.length}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">
                Links
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-extrabold text-white tracking-tight">
                {categoriesCount}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">
                Categories
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (Account, Appearance, Security, Danger Zone) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Card 1: Account Information */}
          <div className="bg-[#0c1222] border border-[#1b253b] rounded-2xl p-6 shadow-xl flex flex-col gap-5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
              <User className="w-4 h-4 text-indigo-400" />
              <span>Account Information</span>
            </div>

            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#080d1a] border border-[#1b253b] rounded-xl text-slate-100 text-sm px-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  placeholder="Full Name"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || 'alex.chen@example.com'}
                  disabled
                  className="w-full bg-[#080d1a] border border-[#1b253b] rounded-xl text-slate-400 text-sm px-4 py-2.5 cursor-not-allowed opacity-70"
                />
              </div>

              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="bg-[#5852f6] hover:bg-[#4842eb] active:scale-95 text-white font-semibold text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition"
                >
                  {isSavingProfile ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>

          {/* Card 2: Appearance */}
          <div className="bg-[#0c1222] border border-[#1b253b] rounded-2xl p-6 shadow-xl flex flex-col gap-5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
              <Palette className="w-4 h-4 text-purple-400" />
              <span>Appearance</span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Dark */}
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 text-xs font-semibold transition ${
                  theme === 'dark'
                    ? 'bg-[#141d33] border-[#5852f6] text-white shadow-md shadow-indigo-600/20 ring-1 ring-[#5852f6]'
                    : 'bg-[#080d1a] border-[#1b253b] text-slate-400 hover:text-white'
                }`}
              >
                <Moon className="w-5 h-5 text-indigo-400" />
                <span>Dark</span>
              </button>

              {/* Light */}
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 text-xs font-semibold transition ${
                  theme === 'light'
                    ? 'bg-[#141d33] border-[#5852f6] text-white shadow-md shadow-indigo-600/20 ring-1 ring-[#5852f6]'
                    : 'bg-[#080d1a] border-[#1b253b] text-slate-400 hover:text-white'
                }`}
              >
                <Sun className="w-5 h-5 text-amber-400" />
                <span>Light</span>
              </button>

              {/* System */}
              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 text-xs font-semibold transition ${
                  theme === 'system'
                    ? 'bg-[#141d33] border-[#5852f6] text-white shadow-md shadow-indigo-600/20 ring-1 ring-[#5852f6]'
                    : 'bg-[#080d1a] border-[#1b253b] text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-5 h-5 text-cyan-400" />
                <span>System</span>
              </button>
            </div>
          </div>

          {/* Card 3: Security */}
          <div className="bg-[#0c1222] border border-[#1b253b] rounded-2xl p-6 shadow-xl flex flex-col gap-6">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Security</span>
            </div>

            {/* Row 1: Change Password */}
            <div className="flex items-center justify-between py-2 border-b border-[#182339]">
              <div>
                <h3 className="text-sm font-bold text-white mb-0.5">Change Password</h3>
                <p className="text-xs text-slate-400">
                  Update your password to keep your account secure.
                </p>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="bg-[#18243c] hover:bg-[#202e4d] border border-[#2b3a5c] text-slate-200 text-xs font-semibold px-4 py-2 rounded-xl transition"
              >
                Update
              </button>
            </div>

            {/* Row 2: Two-Factor Authentication */}
            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="text-sm font-bold text-white mb-0.5">
                  Two-Factor Authentication
                </h3>
                <p className="text-xs text-slate-400">
                  Add an extra layer of security to your account.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTwoFactorEnabled(!twoFactorEnabled);
                  showToast(
                    twoFactorEnabled ? '2FA disabled' : '2FA security enabled',
                    'info'
                  );
                }}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  twoFactorEnabled ? 'bg-[#5852f6]' : 'bg-[#1c273e]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    twoFactorEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Card 4: Danger Zone matching Image 1 */}
          <div className="bg-[#0c1222] border border-red-900/40 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
            <div className="flex items-center gap-2 text-sm font-bold text-red-400">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>Danger Zone</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white mb-0.5">Delete Account</h3>
                <p className="text-xs text-slate-400">
                  Permanently delete your account and all data.
                </p>
              </div>
              <button
                onClick={() =>
                  showToast('Account deletion protection enabled for demo', 'info')
                }
                className="bg-red-950/60 hover:bg-red-900/80 border border-red-800/60 text-red-300 text-xs font-semibold px-4 py-2 rounded-xl transition"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Selector Modal */}
      <AnimatePresence>
        {isAvatarModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0c1222] border border-[#1b253b] rounded-2xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-5"
            >
              <div className="flex items-center justify-between border-b border-[#182339] pb-3">
                <h3 className="text-lg font-bold text-white">Choose Your Avatar</h3>
                <button
                  onClick={() => setIsAvatarModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Avatar Presets */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Preset Avatars
                </span>
                <div className="grid grid-cols-6 gap-3">
                  {presetAvatars.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setTempAvatar(preset);
                        setCustomAvatarUrl('');
                      }}
                      className={`rounded-full overflow-hidden border-2 transition ${
                        tempAvatar === preset && !customAvatarUrl
                          ? 'border-[#5852f6] scale-110 shadow-lg shadow-indigo-600/30'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset} alt="preset" className="w-12 h-12 object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Image URL */}
              <div className="flex flex-col gap-2 pt-2 border-t border-[#182339]">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Or Custom Image URL
                </span>
                <input
                  type="url"
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full bg-[#080d1a] border border-[#1b253b] text-slate-100 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#182339]">
                <button
                  onClick={() => setIsAvatarModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyAvatar}
                  className="bg-[#5852f6] hover:bg-[#4842eb] text-white text-xs font-semibold px-5 py-2 rounded-xl shadow-lg shadow-indigo-600/25"
                >
                  Apply Avatar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Change Password Modal */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0c1222] border border-[#1b253b] rounded-2xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-5"
            >
              <div className="flex items-center justify-between border-b border-[#182339] pb-3">
                <div className="flex items-center gap-2 text-white font-bold">
                  <KeyRound className="w-4 h-4 text-indigo-400" />
                  <span>Update Password</span>
                </div>
                <button
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {passwordError && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/50 text-red-300 text-xs">
                  {passwordError}
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full bg-[#080d1a] border border-[#1b253b] text-slate-100 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full bg-[#080d1a] border border-[#1b253b] text-slate-100 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                    className="w-full bg-[#080d1a] border border-[#1b253b] text-slate-100 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[#182339]">
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingPassword}
                    className="bg-[#5852f6] hover:bg-[#4842eb] text-white text-xs font-semibold px-5 py-2 rounded-xl shadow-lg shadow-indigo-600/25 flex items-center gap-2"
                  >
                    {isSavingPassword && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Update Password</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
