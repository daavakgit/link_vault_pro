'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff, Loader2, Rocket, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode');

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(
    initialMode === 'register' ? 'register' : 'login'
  );
  const [showPassword, setShowPassword] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (searchParams.get('mode') === 'register') {
      setMode('register');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (mode === 'register' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (mode === 'forgot') {
      if (password !== confirmPassword) {
        setError('New passwords do not match');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      try {
        setLoading(true);
        const res = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, newPassword: password }),
        });
        const data = await res.json();

        if (!res.ok || data.error) {
          setError(data.error || 'Password reset failed');
          setLoading(false);
          return;
        }

        setSuccessMessage('Password reset successfully! Please log in with your new password.');
        setPassword('');
        setConfirmPassword('');
        setMode('login');
      } catch (err: any) {
        setError(err.message || 'Server error while resetting password');
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);
      const isRegister = mode === 'register';
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const payload = isRegister
        ? { name, email, password, confirmPassword }
        : { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        if (res.status === 401 && !isRegister) {
          setError(
            data.error || 'Invalid email or password. Don\'t have an account? Click "Create one" below to register.'
          );
        } else {
          setError(data.error || 'Authentication failed');
        }
        setLoading(false);
        return;
      }

      // Successful auth -> redirect to dashboard
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Demo User',
          email: 'demo.user@linkvault.app',
          password: 'demopassword123',
          confirmPassword: 'demopassword123',
        }),
      });

      if (!res.ok) {
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'demo.user@linkvault.app',
            password: 'demopassword123',
          }),
        });
        if (!loginRes.ok) {
          throw new Error('Google Demo Auth failed');
        }
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Demo authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex items-center justify-center p-4">
      {/* Outer Container Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-[#101726] border border-[#1b253b] rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2 min-h-[560px]"
      >
        {/* Left Pane - Stitch Branding Hero */}
        <div className="bg-[#141b2d] p-8 md:p-10 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-[#1e2a44]">
          <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Logo */}
          <Link href="/" className="flex items-center gap-2.5 z-10 group">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition">
              <Rocket className="w-4 h-4" />
            </div>
            <span className="font-bold text-white tracking-tight text-lg">LinkVault</span>
          </Link>

          {/* Center Content */}
          <div className="my-10 z-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight mb-4">
              Secure your <br />
              digital workflow.
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Organize, encrypt, and access your critical links at lightning speed. Built for
              professionals who demand precision.
            </p>
          </div>

          {/* Bottom Social Proof */}
          <div className="flex items-center gap-3 z-10">
            <div className="flex -space-x-2">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="user"
                className="w-7 h-7 rounded-full border-2 border-[#141b2d] object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                alt="user"
                className="w-7 h-7 rounded-full border-2 border-[#141b2d] object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                alt="user"
                className="w-7 h-7 rounded-full border-2 border-[#141b2d] object-cover"
              />
            </div>
            <span className="text-xs text-slate-400 font-medium">Join 10,000+ power users</span>
          </div>
        </div>

        {/* Right Pane - Form Controls */}
        <div className="p-8 md:p-10 flex flex-col justify-center bg-[#0d1320]">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight mb-1">
              {mode === 'register'
                ? 'Create an account'
                : mode === 'forgot'
                ? 'Reset Password'
                : 'Welcome back'}
            </h2>
            <p className="text-xs text-slate-400">
              {mode === 'register'
                ? 'Enter your details to set up your vault.'
                : mode === 'forgot'
                ? 'Enter your email address and your new password.'
                : 'Enter your details to access your vault.'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800/50 text-red-300 text-xs font-medium leading-relaxed">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'register' && (
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivers"
                  required
                  className="w-full bg-[#131b2c] border border-[#1e2a42] rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full bg-[#131b2c] border border-[#1e2a42] rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {mode === 'forgot' ? 'New Password' : 'Password'}
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setError('');
                      setSuccessMessage('');
                    }}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#131b2c] border border-[#1e2a42] rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {(mode === 'register' || mode === 'forgot') && (
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Confirm {mode === 'forgot' ? 'New Password' : 'Password'}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#131b2c] border border-[#1e2a42] rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-[#5852f6] hover:bg-[#4842eb] active:scale-[0.98] text-white font-medium py-3 rounded-xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 text-sm transition"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>
                {mode === 'register'
                  ? 'Create Account'
                  : mode === 'forgot'
                  ? 'Set New Password'
                  : 'Sign In'}
              </span>
            </button>
          </form>

          {mode === 'forgot' ? (
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setMode('login');
                  setError('');
                  setSuccessMessage('');
                }}
                className="text-xs text-slate-400 hover:text-white transition flex items-center justify-center gap-1 mx-auto"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
            </div>
          ) : (
            <>
              {/* Divider */}
              <div className="relative my-6 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#1e2a42]" />
                </div>
                <span className="relative bg-[#0d1320] px-3 text-[11px] uppercase tracking-widest font-semibold text-slate-500">
                  OR
                </span>
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full bg-[#131b2c] hover:bg-[#1a253c] border border-[#1e2a42] text-slate-200 font-medium py-2.5 rounded-xl flex items-center justify-center gap-3 text-sm transition"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Demo Google Auth</span>
              </button>

              {/* Toggle Register / Login */}
              <div className="mt-6 text-center text-xs text-slate-400">
                {mode === 'register' ? (
                  <span>
                    Already have an account?{' '}
                    <button
                      onClick={() => {
                        setMode('login');
                        setError('');
                        setSuccessMessage('');
                      }}
                      className="text-indigo-400 hover:text-indigo-300 font-medium underline transition"
                    >
                      Sign in
                    </button>
                  </span>
                ) : (
                  <span>
                    Don&apos;t have an account?{' '}
                    <button
                      onClick={() => {
                        setMode('register');
                        setError('');
                        setSuccessMessage('');
                      }}
                      className="text-indigo-400 hover:text-indigo-300 font-medium underline transition"
                    >
                      Create one
                    </button>
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="text-slate-400 p-8 text-center">Loading auth page...</div>}>
      <AuthPageContent />
    </Suspense>
  );
}
