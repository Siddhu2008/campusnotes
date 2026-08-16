'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ResourceCard from '@/components/resources/ResourceCard';
import { useAuth } from '@/lib/context/AuthContext';
import { dataStore } from '@/lib/store/dataStore';
import { useToast } from '@/lib/context/ToastContext';
import { Resource } from '@/types';

export default function BookmarksPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [bookmarkedList, setBookmarkedList] = useState<Resource[]>([]);

  const loadBookmarks = () => {
    if (!user) {
      setBookmarkedList([]);
      return;
    }
    const list = dataStore.getBookmarks(user._id);
    setBookmarkedList(list);
  };

  useEffect(() => {
    loadBookmarks();
    const unsub = dataStore.subscribe(loadBookmarks);
    return () => unsub();
  }, [user]);

  const removeBookmark = (id: string) => {
    if (!user) return;
    dataStore.toggleBookmark(user._id, id);
    showToast('Removed from Bookmarks', 'info');
  };

  if (!user) {
    return (
      <div className="pt-24 min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-5xl mb-4">🔖</div>
        <h2 className="text-2xl font-bold text-white mb-2">Sign in to View Bookmarks</h2>
        <p className="text-xs text-[var(--text-muted)] mb-6 max-w-sm">
          Bookmark useful notes and exam questions for easy offline revision.
        </p>
        <Link href="/login" className="btn-primary px-6">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-safe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
              <span>🔖</span> Saved Revision Library
            </div>
            <h1 className="text-3xl font-bold text-white">My Bookmarks</h1>
            <p className="text-[var(--text-secondary)] text-sm mt-1">
              Quick access to your saved study materials, cheat sheets, and question papers
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[var(--text-muted)]">
              {bookmarkedList.length} saved resource{bookmarkedList.length !== 1 ? 's' : ''}
            </span>
            <Link href="/resources" className="btn-secondary text-xs py-2 px-3.5">
              Browse More
            </Link>
          </div>
        </div>

        {/* Content Grid */}
        {bookmarkedList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {bookmarkedList.map((resource) => (
              <div key={resource._id} className="relative group">
                <ResourceCard resource={resource} />
                <button
                  onClick={() => removeBookmark(resource._id)}
                  title="Remove from bookmarks"
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/30 z-10 text-xs cursor-pointer"
                >
                  ✕ Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-3xl p-16 text-center max-w-xl mx-auto my-12">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-3xl mx-auto mb-4">
              🔖
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No Bookmarks Saved Yet</h2>
            <p className="text-xs text-[var(--text-muted)] mb-6">
              When you find high-value notes, click the bookmark icon on any card to save it for quick access.
            </p>
            <Link href="/resources" className="btn-primary">
              Explore Resources Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
