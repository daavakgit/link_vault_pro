'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { IUser, ILink, CategoryType } from '@/types';
import { useRouter } from 'next/navigation';
import { ToastMessage, Toast } from '@/components/Toast';
import { AddEditLinkModal } from '@/components/AddEditLinkModal';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';

export type ThemeType = 'dark' | 'light' | 'system';

interface LinkVaultContextType {
  user: IUser | null;
  links: ILink[];
  loading: boolean;
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  fetchLinks: (category?: string, search?: string) => Promise<void>;
  refreshUserData: () => Promise<void>;
  openAddModal: () => void;
  openEditModal: (link: ILink) => void;
  openDeleteModal: (link: ILink) => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

const LinkVaultContext = createContext<LinkVaultContextType | undefined>(undefined);

export const LinkVaultProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [links, setLinks] = useState<ILink[]>([]);
  const [loading, setLoading] = useState(true);
  const [theme, setThemeState] = useState<ThemeType>('dark');

  // Theme apply logic
  const applyTheme = useCallback((targetTheme: ThemeType) => {
    const root = document.documentElement;
    let effectiveTheme: 'dark' | 'light' = 'dark';

    if (targetTheme === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      effectiveTheme = targetTheme;
    }

    if (effectiveTheme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
  }, []);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem('linkvault_theme', newTheme);
    applyTheme(newTheme);
  };

  useEffect(() => {
    const savedTheme = (localStorage.getItem('linkvault_theme') as ThemeType) || 'dark';
    setThemeState(savedTheme);
    applyTheme(savedTheme);
  }, [applyTheme]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<ILink | null>(null);

  const [deletingLink, setDeletingLink] = useState<ILink | null>(null);

  // Toasts state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const refreshUserData = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        setUser(null);
        router.push('/login');
        return;
      }
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
    }
  }, [router]);

  const fetchLinks = useCallback(async (category?: string, search?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (category && category !== 'All') params.set('category', category);
      if (search) params.set('search', search);

      const res = await fetch(`/api/links?${params.toString()}`);
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      if (data.links) {
        setLinks(data.links);
      }
    } catch (err) {
      console.error('Failed to fetch links:', err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const init = async () => {
      await refreshUserData();
      await fetchLinks();
    };
    init();
  }, [refreshUserData, fetchLinks]);

  const openAddModal = () => {
    setEditingLink(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (link: ILink) => {
    setEditingLink(link);
    setIsAddModalOpen(true);
  };

  const openDeleteModal = (link: ILink) => {
    setDeletingLink(link);
  };

  const handleSaveLink = async (linkData: {
    name: string;
    url: string;
    description: string;
    category: CategoryType;
  }) => {
    if (editingLink) {
      // Update link
      const res = await fetch(`/api/links/${editingLink._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(linkData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update link');

      showToast('Link updated successfully', 'success');
    } else {
      // Create new link
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(linkData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create link');

      showToast('Link added successfully', 'success');
    }
    await fetchLinks();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingLink) return;
    const res = await fetch(`/api/links/${deletingLink._id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || 'Failed to delete link', 'error');
      return;
    }
    showToast('Link deleted successfully', 'success');
    await fetchLinks();
  };

  return (
    <LinkVaultContext.Provider
      value={{
        user,
        links,
        loading,
        theme,
        setTheme,
        fetchLinks,
        refreshUserData,
        openAddModal,
        openEditModal,
        openDeleteModal,
        showToast,
      }}
    >
      {children}

      {/* Global Modals */}
      <AddEditLinkModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveLink}
        initialData={editingLink}
      />

      <DeleteConfirmModal
        isOpen={!!deletingLink}
        linkName={deletingLink?.name || ''}
        onClose={() => setDeletingLink(null)}
        onConfirm={handleDeleteConfirm}
      />

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </LinkVaultContext.Provider>
  );
};

export const useLinkVault = () => {
  const context = useContext(LinkVaultContext);
  if (!context) {
    throw new Error('useLinkVault must be used within a LinkVaultProvider');
  }
  return context;
};
