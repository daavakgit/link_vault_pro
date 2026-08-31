'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  X,
  Loader2,
  Save,
  KeyRound,
  Upload,
  Check,
  Image as ImageIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfilePage() {
  const { user, links, refreshUserData, showToast, theme, setTheme } = useLinkVault();

  // Profile Form State
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Avatar Modal State
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [tempAvatar, setTempAvatar] = useState('');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileUploadLoading, setFileUploadLoading] = useState(false);

  // Password State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

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

  // Local File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image file size must be under 5MB', 'error');
      return;
    }

    setFileUploadLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result as string;
      setTempAvatar(base64Data);
      setCustomAvatarUrl('');
      setFileUploadLoading(false);
      showToast('System image loaded! Click "Apply Avatar" to save.', 'info');
    };
    reader.onerror = () => {
      showToast('Failed to read image file', 'error');
      setFileUploadLoading(false);
    };
    reader.readAsDataURL(file);
  };

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
        showToast('Avatar saved to database successfully', 'success');
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
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 pb-12 font-sans">
      {/* Left Column: Profile Summary matching Google Stitch HTML */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Profile & Settings</h1>
          <p className="text-xs text-slate-400 mt-1">Manage your personal account details.</p>
        </div>

        {/* Profile Card */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 flex flex-col items-center text-center shadow-xl relative">
          <div className="relative w-24 h-24 mb-4">
            <img
              className="w-full h-full rounded-full object-cover border-2 border-indigo-400/30"
              src={
                avatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                  name || 'Alex'
                )}`
              }
              alt="Avatar"
            />
            <button
              onClick={() => {
                setTempAvatar(avatar);
                setIsAvatarModalOpen(true);
              }}
              className="absolute bottom-0 right-0 bg-[#171f33] text-slate-200 p-1.5 rounded-full border border-slate-700 hover:bg-[#31394d] transition-colors shadow-lg"
              title="Upload / Change Avatar"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>

          <h2 className="text-xl font-bold text-white mb-0.5">{user?.name || 'Alex Chen'}</h2>
          <p className="text-xs text-slate-400 font-mono mb-5">
            {user?.email || 'alex.chen@example.com'}
          </p>

          <button
            onClick={() => {
              setTempAvatar(avatar);
              setIsAvatarModalOpen(true);
            }}
            className="w-full bg-[#1E293B] border border-slate-700 text-white font-medium text-xs py-2 px-4 rounded-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            <span>Upload / Edit Avatar</span>
          </button>
        </div>

        {/* Quick Stats matching Stitch HTML */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-4 flex justify-between divide-x divide-slate-800 shadow-xl">
          <div className="flex flex-col items-center flex-1 px-2">
            <span className="text-2xl font-bold text-indigo-300">{links.length}</span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Links
            </span>
          </div>
          <div className="flex flex-col items-center flex-1 px-2">
            <span className="text-2xl font-bold text-indigo-300">{categoriesCount}</span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Categories
            </span>
          </div>
        </div>
      </div>

      {/* Right Column: Settings Sections matching Google Stitch HTML */}
      <div className="w-full lg:w-2/3 flex flex-col gap-6 lg:mt-12">
        {/* Account Information Section */}
        <section className="bg-[#0F172A] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 bg-[#171f33]/50 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Account Information</h3>
          </div>
          <form onSubmit={handleSaveProfile} className="p-6 flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#020617] border border-slate-700/80 rounded-lg px-4 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                placeholder="Full Name"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || 'alex.chen@example.com'}
                disabled
                className="w-full bg-[#020617] border border-slate-800 rounded-lg px-4 py-2 text-slate-500 text-sm cursor-not-allowed opacity-70"
              />
            </div>
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="bg-[#c3c0ff] text-[#1d00a5] font-bold text-xs px-6 py-2 rounded-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-2 shadow-md"
              >
                {isSavingProfile && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </section>

        {/* Appearance Section */}
        <section className="bg-[#0F172A] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 bg-[#171f33]/50 flex items-center gap-2">
            <Palette className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Appearance</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 gap-2 transition-all ${
                  theme === 'dark'
                    ? 'border-indigo-400 bg-indigo-950/40 text-indigo-300'
                    : 'border-slate-800 hover:bg-[#171f33] text-slate-400'
                }`}
              >
                <Moon className="w-5 h-5 text-indigo-400" />
                <span className="text-xs font-semibold">Dark</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border gap-2 transition-all ${
                  theme === 'light'
                    ? 'border-indigo-400 bg-indigo-950/40 text-indigo-300'
                    : 'border-slate-800 hover:bg-[#171f33] text-slate-400'
                }`}
              >
                <Sun className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-semibold">Light</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border gap-2 transition-all ${
                  theme === 'system'
                    ? 'border-indigo-400 bg-indigo-950/40 text-indigo-300'
                    : 'border-slate-800 hover:bg-[#171f33] text-slate-400'
                }`}
              >
                <Monitor className="w-5 h-5 text-cyan-400" />
                <span className="text-xs font-semibold">System</span>
              </button>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="bg-[#0F172A] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 bg-[#171f33]/50 flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Security</h3>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center py-1">
              <div>
                <h4 className="text-sm font-semibold text-white">Change Password</h4>
                <p className="text-xs text-slate-400">
                  Update your password to keep your account secure.
                </p>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="bg-[#1E293B] border border-slate-700 text-white font-medium text-xs py-2 px-4 rounded-lg hover:brightness-110 active:scale-[0.98] transition-all"
              >
                Update
              </button>
            </div>
            <hr className="border-slate-800 my-1" />
            <div className="flex justify-between items-center py-1">
              <div>
                <h4 className="text-sm font-semibold text-white">Two-Factor Authentication</h4>
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
                className={`w-10 h-6 rounded-full relative transition-colors border border-slate-700 ${
                  twoFactorEnabled ? 'bg-indigo-600' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${
                    twoFactorEnabled ? 'left-5' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Danger Zone Section */}
        <section className="bg-[#0F172A] border border-red-900/30 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-red-900/20 bg-red-950/20 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <h3 className="text-sm font-bold text-red-400">Danger Zone</h3>
          </div>
          <div className="p-6 flex justify-between items-center">
            <div>
              <h4 className="text-sm font-semibold text-white">Delete Account</h4>
              <p className="text-xs text-slate-400">Permanently delete your account and all data.</p>
            </div>
            <button
              onClick={() => showToast('Account deletion protection active for demo', 'info')}
              className="bg-red-950/40 text-red-300 border border-red-800/40 font-semibold text-xs py-2 px-4 rounded-lg hover:bg-red-900/40 active:scale-[0.98] transition-all"
            >
              Delete Account
            </button>
          </div>
        </section>
      </div>

      {/* Avatar Selector & System File Upload Modal */}
      <AnimatePresence>
        {isAvatarModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-5"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white">Choose or Upload Avatar</h3>
                <button
                  onClick={() => setIsAvatarModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Current Preview */}
              <div className="flex flex-col items-center gap-2 py-2 bg-[#020617] rounded-xl border border-slate-800/60">
                <img
                  src={tempAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=Preview`}
                  alt="Selected Preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500/50 shadow-md"
                />
                <span className="text-[11px] text-slate-400 font-medium">Selected Preview</span>
              </div>

              {/* Upload from Local Computer / System */}
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Upload Image from Your System</span>
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={fileUploadLoading}
                  className="w-full bg-[#1E293B] hover:bg-[#28374f] border border-indigo-500/40 text-indigo-300 font-semibold text-xs py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2 shadow-sm"
                >
                  {fileUploadLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-indigo-400" />
                  )}
                  <span>Choose Photo from System (PNG, JPG)</span>
                </button>
              </div>

              {/* Preset Avatars */}
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Or Pick a Preset Avatar
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
                          ? 'border-indigo-400 scale-110 shadow-lg shadow-indigo-600/30'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset} alt="preset" className="w-12 h-12 object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Image URL */}
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Or Custom Image URL
                </span>
                <input
                  type="url"
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full bg-[#020617] border border-slate-700 text-slate-100 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setIsAvatarModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyAvatar}
                  className="bg-[#c3c0ff] text-[#1d00a5] font-bold text-xs px-5 py-2 rounded-lg shadow-md hover:brightness-110"
                >
                  Apply & Save Avatar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Password Update Modal */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-5"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
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
                <div className="p-3 rounded-lg bg-red-950/60 border border-red-800/50 text-red-300 text-xs">
                  {passwordError}
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full bg-[#020617] border border-slate-700 text-slate-100 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full bg-[#020617] border border-slate-700 text-slate-100 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                    className="w-full bg-[#020617] border border-slate-700 text-slate-100 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingPassword}
                    className="bg-[#c3c0ff] text-[#1d00a5] font-bold text-xs px-5 py-2 rounded-lg shadow-md hover:brightness-110 flex items-center gap-2"
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
