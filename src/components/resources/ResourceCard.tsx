'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Resource } from '@/types';
import { CATEGORY_CONFIG } from '@/lib/data/mock';
import { formatCount, timeAgo } from '@/lib/utils';
import { dataStore } from '@/lib/store/dataStore';
import { useAuth } from '@/lib/context/AuthContext';
import { useToast } from '@/lib/context/ToastContext';

interface ResourceCardProps {
  resource: Resource;
  variant?: 'default' | 'compact' | 'horizontal';
  onBookmarkChange?: () => void;
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= Math.round(rating) ? 'text-yellow-400' : 'text-white/20'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-xs font-medium text-yellow-400">{rating.toFixed(1)}</span>
      <span className="text-xs text-[var(--text-muted)]">({count})</span>
    </div>
  );
}

export default function ResourceCard({
  resource,
  variant = 'default',
  onBookmarkChange,
}: ResourceCardProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (user) {
      setBookmarked(dataStore.isBookmarked(user._id, resource._id));
    }
  }, [user, resource._id]);

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showToast('Please sign in to bookmark resources', 'warning');
      return;
    }
    const isNowSaved = dataStore.toggleBookmark(user._id, resource._id);
    setBookmarked(isNowSaved);
    showToast(
      isNowSaved ? 'Saved to your Bookmarks 🔖' : 'Removed from Bookmarks',
      'info'
    );
    if (onBookmarkChange) onBookmarkChange();
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    dataStore.recordDownload(resource._id, user);

    const content = `TCET CampusNotes - ${resource.title}\nSubject: ${resource.subject?.name}\nDescription:\n${resource.description}`;
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = resource.file.originalName || `${resource.slug}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`Downloading "${resource.title}" 📥`, 'success');
  };

  const catConfig = CATEGORY_CONFIG[resource.category] || CATEGORY_CONFIG.OTHER;

  if (variant === 'compact') {
    return (
      <Link
        href={`/resources/${resource._id}`}
        className="glass-card rounded-xl p-3 flex items-center gap-3 group"
      >
        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
          <span className="text-lg">{catConfig.emoji}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white truncate group-hover:text-indigo-300 transition-colors">
            {resource.title}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {resource.subject?.name} · Sem {resource.semester?.number}
          </p>
        </div>
        <div className="text-xs text-[var(--text-muted)] shrink-0">
          ⬇ {formatCount(resource.stats.downloads)}
        </div>
      </Link>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div className="glass-card rounded-xl p-4 flex gap-4 group">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center shrink-0">
          <span className="text-2xl">{catConfig.emoji}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link href={`/resources/${resource._id}`}>
                <h3 className="font-semibold text-white group-hover:text-indigo-300 transition-colors truncate text-sm">
                  {resource.title}
                </h3>
              </Link>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {resource.subject?.name} · Sem {resource.semester?.number} · {resource.branch?.code}
              </p>
            </div>
            <span className={`badge shrink-0 ${catConfig.color} text-[10px]`}>
              {catConfig.label}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <StarRating rating={resource.stats.averageRating} count={resource.stats.ratingCount} />
            <span className="text-xs text-[var(--text-muted)]">
              ⬇ {formatCount(resource.stats.downloads)}
            </span>
            <span className="text-xs text-[var(--text-muted)]">
              👁 {formatCount(resource.stats.views)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Default card
  return (
    <article className="glass-card rounded-2xl overflow-hidden flex flex-col group h-full">
      {/* Card Top - Category Banner */}
      <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center">
              <span className="text-xl">{catConfig.emoji}</span>
            </div>
            <span className={`badge ${catConfig.color} text-[10px]`}>
              {catConfig.label}
            </span>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={handleBookmarkToggle}
            className={`p-2 rounded-xl transition-all duration-200 cursor-pointer ${
              bookmarked
                ? 'text-indigo-400 bg-indigo-500/20 border border-indigo-500/30'
                : 'text-[var(--text-muted)] hover:text-indigo-400 hover:bg-indigo-500/10'
            }`}
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark resource'}
            title={bookmarked ? 'Remove bookmark' : 'Save bookmark'}
          >
            <svg
              className="w-4 h-4"
              fill={bookmarked ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </button>
        </div>

        {/* Title */}
        <Link href={`/resources/${resource._id}`}>
          <h3 className="font-semibold text-white text-sm leading-snug group-hover:text-indigo-300 transition-colors line-clamp-2">
            {resource.title}
          </h3>
        </Link>

        {/* Meta Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {resource.subject && (
            <span className="badge bg-white/5 text-[var(--text-secondary)] border-white/10 text-[10px]">
              📚 {resource.subject.name}
            </span>
          )}
          {resource.semester && (
            <span className="badge bg-white/5 text-[var(--text-secondary)] border-white/10 text-[10px]">
              🎓 Sem {resource.semester.number}
            </span>
          )}
          {resource.branch && (
            <span className="badge bg-white/5 text-[var(--text-secondary)] border-white/10 text-[10px]">
              {resource.branch.code}
            </span>
          )}
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <StarRating rating={resource.stats.averageRating} count={resource.stats.ratingCount} />
          <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {formatCount(resource.stats.downloads)}
            </span>
          </div>
        </div>

        {/* Uploader + Time */}
        <div className="flex items-center justify-between pt-3 border-t border-white/06">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resource.uploadedBy.avatarUrl}
              alt={resource.uploadedBy.name}
              className="w-5 h-5 rounded-full border border-indigo-500/30"
            />
            <span className="text-xs text-[var(--text-muted)] truncate max-w-[100px]">
              {resource.uploadedBy.name.split(' ')[0]}
            </span>
          </div>
          <span className="text-xs text-[var(--text-muted)]">{timeAgo(resource.createdAt)}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/resources/${resource._id}`}
            className="btn-secondary flex-1 text-xs py-2 justify-center"
          >
            Preview
          </Link>
          <button
            onClick={handleDownload}
            className="btn-primary flex-1 text-xs py-2 justify-center cursor-pointer"
          >
            Download
          </button>
        </div>
      </div>
    </article>
  );
}
