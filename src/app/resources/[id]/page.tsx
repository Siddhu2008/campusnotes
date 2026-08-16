'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CATEGORY_CONFIG, LEVEL_CONFIG } from '@/lib/data/mock';
import { formatCount, formatDate, timeAgo, formatFileSize } from '@/lib/utils';
import { dataStore } from '@/lib/store/dataStore';
import { useAuth } from '@/lib/context/AuthContext';
import { useToast } from '@/lib/context/ToastContext';
import PDFViewer from '@/components/resources/PDFViewer';
import { Resource, Comment, ReportReason } from '@/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ResourceDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const resourceId = resolvedParams.id;

  const { user } = useAuth();
  const { showToast } = useToast();

  const [resource, setResource] = useState<Resource | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [bookmarked, setBookmarked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [ratingHover, setRatingHover] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState<ReportReason>('INCORRECT_CONTENT');
  const [reportDetails, setReportDetails] = useState('');

  const loadData = () => {
    const res = dataStore.getResourceById(resourceId);
    if (res) {
      setResource(res);
      setComments(dataStore.getComments(resourceId));
      if (user) {
        setBookmarked(dataStore.isBookmarked(user._id, resourceId));
        setUserRating(dataStore.getUserRating(resourceId, user._id));
      }
    }
  };

  useEffect(() => {
    loadData();
    dataStore.incrementViews(resourceId);
    const unsub = dataStore.subscribe(loadData);
    return () => unsub();
  }, [resourceId, user]);

  if (!resource && typeof window !== 'undefined') {
    const found = dataStore.getResourceById(resourceId);
    if (!found) notFound();
  }

  if (!resource) return null;

  const catConfig = CATEGORY_CONFIG[resource.category] || CATEGORY_CONFIG.OTHER;
  const relatedResources = dataStore
    .getResources()
    .filter((r) => r._id !== resource._id && r.subjectId === resource.subjectId)
    .slice(0, 3);

  const handleRatingSubmit = (score: number) => {
    if (!user) {
      showToast('Please sign in to rate this resource', 'warning');
      return;
    }
    dataStore.addRating(resource._id, user._id, score);
    setUserRating(score);
    showToast(`You rated this resource ${score} ★ (+2 XP)`, 'success');
  };

  const handleBookmarkToggle = () => {
    if (!user) {
      showToast('Please sign in to bookmark notes', 'warning');
      return;
    }
    const isSaved = dataStore.toggleBookmark(user._id, resource._id);
    setBookmarked(isSaved);
    showToast(isSaved ? 'Saved to Bookmarks 🔖' : 'Removed from Bookmarks', 'info');
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!user) {
      showToast('Please sign in to post comments', 'warning');
      return;
    }
    dataStore.addComment(resource._id, user, commentText.trim());
    setCommentText('');
    showToast('Comment posted successfully! 💬', 'success');
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard! 🔗', 'success');
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Please sign in to submit a report', 'warning');
      return;
    }
    dataStore.addReport({
      reporter: user,
      resourceId: resource._id,
      reason: reportReason,
      description: reportDetails,
    });
    setReportModalOpen(false);
    setReportDetails('');
    showToast('Report submitted for moderator review 🛡️', 'info');
  };

  return (
    <div className="pt-20 pb-safe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-6 flex-wrap">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span>›</span>
          <Link href="/resources" className="hover:text-white transition-colors">
            Resources
          </Link>
          <span>›</span>
          {resource.branch && (
            <Link
              href={`/resources?branchId=${resource.branchId}`}
              className="hover:text-white transition-colors"
            >
              {resource.branch.code}
            </Link>
          )}
          <span>›</span>
          {resource.subject && (
            <span className="text-[var(--text-secondary)]">{resource.subject.name}</span>
          )}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resource Header Card */}
            <div className="glass-card rounded-3xl p-6 sm:p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center text-3xl shrink-0">
                  {catConfig.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`badge ${catConfig.color} text-xs`}>
                      {catConfig.label}
                    </span>
                    {resource.unitNumber && (
                      <span className="badge bg-white/5 text-[var(--text-secondary)] border-white/10 text-xs">
                        Unit {resource.unitNumber}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                    {resource.title}
                  </h1>
                </div>
              </div>

              {/* Uploader Info */}
              <div className="flex items-center gap-3 py-4 border-t border-b border-white/06 mb-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resource.uploadedBy.avatarUrl}
                  alt={resource.uploadedBy.name}
                  className="w-10 h-10 rounded-xl border border-indigo-500/30 object-cover"
                />
                <div>
                  <Link
                    href={`/profile/${resource.uploadedBy._id}`}
                    className="font-semibold text-white hover:text-indigo-300 transition-colors text-sm"
                  >
                    {resource.uploadedBy.name}
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mt-0.5">
                    <span
                      className={`badge text-[10px] bg-gradient-to-r ${
                        LEVEL_CONFIG[resource.uploadedBy.level]?.gradient
                      } text-white border-0`}
                    >
                      {resource.uploadedBy.level}
                    </span>
                    <span>Uploaded {timeAgo(resource.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-4 mb-5 p-4 rounded-2xl bg-white/[0.02] border border-white/06 text-center">
                <div>
                  <p className="text-xl font-bold text-yellow-400">
                    {resource.stats.averageRating.toFixed(1)} ★
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    ({resource.stats.ratingCount} ratings)
                  </p>
                </div>
                <div>
                  <p className="text-xl font-bold text-white">
                    {formatCount(resource.stats.downloads)}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">Downloads</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-white">
                    {formatCount(resource.stats.views)}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">Views</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-5">
                {resource.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {resource.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/resources?search=${encodeURIComponent(tag)}`}
                    className="badge bg-white/5 text-[var(--text-secondary)] border-white/10 text-xs hover:border-indigo-500/30 hover:text-indigo-300 transition-all"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>

              {/* Department Pills */}
              <div className="flex flex-wrap gap-2">
                {resource.branch && (
                  <span className="badge bg-indigo-500/10 text-indigo-300 border-indigo-500/20 text-xs">
                    🏫 {resource.branch.name} ({resource.branch.code})
                  </span>
                )}
                {resource.semester && (
                  <span className="badge bg-purple-500/10 text-purple-300 border-purple-500/20 text-xs">
                    📅 Semester {resource.semester.number}
                  </span>
                )}
                {resource.subject && (
                  <span className="badge bg-emerald-500/10 text-emerald-300 border-emerald-500/20 text-xs">
                    📚 {resource.subject.name}
                  </span>
                )}
              </div>
            </div>

            {/* Document Viewer Frame */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-white">Document Preview</h3>
                <span className="text-xs text-[var(--text-muted)]">Verified TCET Study Material</span>
              </div>
              <PDFViewer resource={resource} />
            </div>

            {/* Rate This Resource Interactive Card */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-2">Rate This Resource</h3>
              <p className="text-xs text-[var(--text-secondary)] mb-4">
                Your rating helps peer students find high-quality exam revision notes.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setRatingHover(star)}
                      onMouseLeave={() => setRatingHover(0)}
                      onClick={() => handleRatingSubmit(star)}
                      className={`text-2xl transition-all cursor-pointer hover:scale-125 ${
                        star <= (ratingHover || userRating)
                          ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                          : 'text-white/20'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                {userRating > 0 && (
                  <span className="badge bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs">
                    You rated {userRating} ★
                  </span>
                )}
              </div>
            </div>

            {/* Comments Thread */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-5">
                Comments ({comments.length})
              </h3>

              {/* Add Comment Form */}
              <form onSubmit={handleCommentSubmit} className="flex gap-3 mb-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user?.avatarUrl || 'https://api.dicebear.com/9.x/avataaars/svg?seed=Guest'}
                  alt="You"
                  className="w-10 h-10 rounded-xl border border-indigo-500/30 shrink-0 object-cover"
                />
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={
                      user ? 'Write an academic question or feedback...' : 'Sign in to comment'
                    }
                    disabled={!user}
                    className="input-field resize-none h-20 text-sm"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      disabled={!commentText.trim() || !user}
                      className="btn-primary text-xs py-2 px-5 disabled:opacity-40 cursor-pointer"
                    >
                      Post Comment
                    </button>
                  </div>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4 divide-y divide-white/06">
                {comments.map((comment) => (
                  <div key={comment._id} className="pt-4 first:pt-0 flex gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={comment.userId.avatarUrl}
                      alt={comment.userId.name}
                      className="w-8 h-8 rounded-lg border border-white/10 shrink-0 mt-0.5 object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Link
                          href={`/profile/${comment.userId._id}`}
                          className="text-sm font-semibold text-white hover:text-indigo-300 transition-colors"
                        >
                          {comment.userId.name}
                        </Link>
                        <span className="text-[10px] text-[var(--text-muted)]">
                          {timeAgo(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
                {comments.length === 0 && (
                  <div className="text-center py-6 text-[var(--text-muted)] text-xs">
                    No comments yet. Be the first to start the discussion!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Quick Action Box */}
            <div id="download" className="glass-card rounded-2xl p-5 sticky top-20">
              <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2.5">
                <button
                  onClick={handleBookmarkToggle}
                  className={`w-full btn-secondary justify-center py-2.5 rounded-xl text-xs cursor-pointer ${
                    bookmarked ? 'text-indigo-400 border-indigo-500/40 bg-indigo-500/20' : ''
                  }`}
                >
                  {bookmarked ? '🔖 Saved in Bookmarks' : '+ Add to Bookmarks'}
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleShare}
                    className="btn-ghost justify-center py-2 text-xs rounded-xl cursor-pointer"
                  >
                    🔗 Share Link
                  </button>
                  <button
                    onClick={() => setReportModalOpen(true)}
                    className="btn-ghost justify-center py-2 text-xs rounded-xl text-red-400/80 hover:text-red-400 cursor-pointer"
                  >
                    ⚠️ Report Flag
                  </button>
                </div>
              </div>

              {/* File Technical Metadata */}
              <div className="mt-5 pt-4 border-t border-white/06 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">File Type</span>
                  <span className="text-white uppercase font-semibold">
                    {resource.file.extension}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">File Size</span>
                  <span className="text-white">{formatFileSize(resource.file.size)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Upload Date</span>
                  <span className="text-white">{formatDate(resource.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Uploader Card */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-semibold text-white mb-3">Contributor</h3>
              <div className="flex items-center gap-3 mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resource.uploadedBy.avatarUrl}
                  alt={resource.uploadedBy.name}
                  className="w-12 h-12 rounded-xl border border-indigo-500/30 object-cover"
                />
                <div>
                  <Link
                    href={`/profile/${resource.uploadedBy._id}`}
                    className="font-semibold text-white hover:text-indigo-300 transition-colors text-sm block"
                  >
                    {resource.uploadedBy.name}
                  </Link>
                  <span className="badge text-[10px] bg-indigo-500/20 text-indigo-300 border-indigo-500/30 mt-1">
                    {resource.uploadedBy.level} · {resource.uploadedBy.points} XP
                  </span>
                </div>
              </div>
              <Link
                href={`/profile/${resource.uploadedBy._id}`}
                className="btn-ghost w-full justify-center text-xs py-2"
              >
                View Full Profile
              </Link>
            </div>

            {/* Related Recommendations */}
            {relatedResources.length > 0 && (
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-semibold text-white mb-3">Related Subject Notes</h3>
                <div className="space-y-2">
                  {relatedResources.map((r) => (
                    <Link
                      key={r._id}
                      href={`/resources/${r._id}`}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all group"
                    >
                      <span className="text-xl">{CATEGORY_CONFIG[r.category]?.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-white truncate group-hover:text-indigo-300 transition-colors">
                          {r.title}
                        </p>
                        <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                          ⬇ {formatCount(r.stats.downloads)} · ⭐ {r.stats.averageRating.toFixed(1)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="glass-strong rounded-3xl p-6 max-w-md w-full border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/06 pb-3">
              <h3 className="font-bold text-white text-base">Flag Resource Content</h3>
              <button
                onClick={() => setReportModalOpen(false)}
                className="text-white/50 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">
                  Reason for Flagging
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value as ReportReason)}
                  className="input-field cursor-pointer text-xs"
                >
                  <option value="INCORRECT_CONTENT">Incorrect Academic Content / Solved Error</option>
                  <option value="WRONG_SUBJECT">Wrong Subject or Unit Classification</option>
                  <option value="DUPLICATE">Duplicate of Existing Resource</option>
                  <option value="SPAM">Spam or Irrelevant File</option>
                  <option value="INAPPROPRIATE">Inappropriate Content</option>
                  <option value="COPYRIGHT">Copyright Violation</option>
                  <option value="OTHER">Other Issues</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">
                  Description of Issue
                </label>
                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Specify page number or describe the issue..."
                  className="input-field resize-none h-20 text-xs"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="btn-ghost text-xs py-2 px-4 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-4 bg-red-600 hover:bg-red-500 cursor-pointer"
                >
                  Submit Flag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
