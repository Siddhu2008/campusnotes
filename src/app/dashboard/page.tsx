'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LEVEL_CONFIG, CATEGORY_CONFIG } from '@/lib/data/mock';
import { formatCount, getLevelProgress, timeAgo, getXPForLevel } from '@/lib/utils';
import ResourceCard from '@/components/resources/ResourceCard';
import { useAuth } from '@/lib/context/AuthContext';
import { dataStore } from '@/lib/store/dataStore';
import { Resource, Notification } from '@/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const [myResources, setMyResources] = useState<Resource[]>([]);
  const [recommendations, setRecommendations] = useState<Resource[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [bookmarksCount, setBookmarksCount] = useState(0);

  const loadData = () => {
    if (!user) return;
    const all = dataStore.getResources();
    const mine = all.filter((r) => r.uploadedBy._id === user._id);
    const recs = all.filter((r) => r.uploadedBy._id !== user._id).slice(0, 4);
    const notifs = dataStore.getNotifications(user._id);
    const bmList = dataStore.getBookmarks(user._id);

    setMyResources(mine);
    setRecommendations(recs);
    setNotifications(notifs.slice(0, 5));
    setBookmarksCount(bmList.length);
  };

  useEffect(() => {
    loadData();
    const unsub = dataStore.subscribe(loadData);
    return () => unsub();
  }, [user]);

  if (!user) {
    return (
      <div className="pt-24 min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-5xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold text-white mb-2">Please Sign In</h2>
        <p className="text-xs text-[var(--text-muted)] mb-6 max-w-sm">
          Sign in with your student account to access your personal dashboard, uploaded notes, and XP rank.
        </p>
        <Link href="/login" className="btn-primary px-6">
          Sign In Now
        </Link>
      </div>
    );
  }

  const lvlConfig = LEVEL_CONFIG[user.level];
  const progress = getLevelProgress(user.points, user.level);
  const { max: nextLevelMax } = getXPForLevel(user.level);
  const totalDownloadsOnMyResources = myResources.reduce(
    (acc, r) => acc + (r.stats.downloads || 0),
    0
  );

  return (
    <div className="pt-20 pb-safe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="glass-card rounded-3xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
          <div className="relative flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-16 h-16 rounded-2xl border-2 border-indigo-500/40 object-cover"
            />
            <div>
              <p className="text-sm text-[var(--text-muted)]">Good day,</p>
              <h1 className="text-2xl font-bold text-white">{user.name} 👋</h1>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`badge text-xs bg-gradient-to-r ${lvlConfig.gradient} text-white border-0`}
                >
                  {user.level}
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  {user.points.toLocaleString()} XP Points
                </span>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="relative w-full sm:w-56">
            <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1.5">
              <span>Next Level Progress</span>
              <span className="text-white font-medium">{progress}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${lvlConfig.gradient} rounded-full transition-all duration-1000`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] text-[var(--text-muted)] mt-1">
              {user.points} / {nextLevelMax} XP to advance rank
            </p>
          </div>

          {/* Actions */}
          <div className="relative flex gap-2 shrink-0">
            <Link href="/upload" className="btn-primary text-xs py-2.5 px-5">
              📤 Upload Notes
            </Link>
            <Link href="/resources" className="btn-ghost text-xs py-2.5 px-4">
              Browse
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: 'Resources Uploaded',
              value: myResources.length,
              emoji: '📤',
              color: 'from-indigo-500 to-purple-600',
            },
            {
              label: 'Downloads on My Notes',
              value: formatCount(totalDownloadsOnMyResources),
              emoji: '⬇️',
              color: 'from-blue-500 to-cyan-600',
            },
            {
              label: 'Bookmarks Saved',
              value: bookmarksCount,
              emoji: '🔖',
              color: 'from-purple-500 to-pink-600',
            },
            {
              label: 'Total XP Earned',
              value: user.points.toLocaleString(),
              emoji: '⭐',
              color: 'from-yellow-500 to-orange-600',
            },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-2xl p-5">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-xl mb-3 shadow-[0_4px_12px_rgba(0,0,0,0.3)]`}
              >
                {stat.emoji}
              </div>
              <div className="text-2xl font-bold text-white mb-0.5">{stat.value}</div>
              <div className="text-xs text-[var(--text-muted)]">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Uploads List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">My Uploaded Notes</h2>
                <Link
                  href="/upload"
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  + Add New
                </Link>
              </div>

              {myResources.length > 0 ? (
                <div className="space-y-3">
                  {myResources.map((resource) => (
                    <div
                      key={resource._id}
                      className="glass-card rounded-xl p-4 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xl shrink-0">
                          {CATEGORY_CONFIG[resource.category]?.emoji}
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/resources/${resource._id}`}
                            className="text-sm font-semibold text-white hover:text-indigo-300 transition-colors truncate block"
                          >
                            {resource.title}
                          </Link>
                          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                            ⬇ {formatCount(resource.stats.downloads)} downloads · ⭐{' '}
                            {resource.stats.averageRating.toFixed(1)} · {timeAgo(resource.createdAt)}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/resources/${resource._id}`}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-indigo-300 shrink-0"
                      >
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-card rounded-2xl p-8 text-center">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="text-xs text-[var(--text-secondary)] mb-4">
                    You haven&apos;t uploaded any resources yet. Share study materials to earn contributor points!
                  </p>
                  <Link href="/upload" className="btn-primary text-xs py-2 px-4">
                    Upload Your First Notes
                  </Link>
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Recommended for Your Semester</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recommendations.map((resource) => (
                  <ResourceCard key={resource._id} resource={resource} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-5">
            {/* Notifications Box */}
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white text-sm">Recent Activity</h3>
                <Link href="/notifications" className="text-xs text-indigo-400 hover:text-indigo-300">
                  View all
                </Link>
              </div>
              <div className="space-y-2.5">
                {notifications.map((n) => (
                  <div
                    key={n._id}
                    className={`flex gap-3 p-2 rounded-xl ${
                      !n.isRead ? 'bg-indigo-500/10' : 'bg-white/[0.02]'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-xs shrink-0">
                      {n.type === 'NEW_COMMENT' ? '💬' : n.type === 'DOWNLOAD_MILESTONE' ? '🎯' : '✅'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white leading-snug">{n.title}</p>
                      <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                        {timeAgo(n.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <p className="text-xs text-[var(--text-muted)] text-center py-4">
                    No recent notifications
                  </p>
                )}
              </div>
            </div>

            {/* Quick Links Menu */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-semibold text-white mb-3 text-sm">Student Tools</h3>
              <div className="space-y-1">
                {[
                  { icon: '🔖', label: 'My Bookmarks', href: '/bookmarks' },
                  { icon: '🏆', label: 'College Leaderboard', href: '/leaderboard' },
                  { icon: '🎓', label: 'Curriculum & Syllabus', href: '/subjects' },
                  { icon: '👤', label: 'Public Profile', href: `/profile/${user._id}` },
                  { icon: '⚙️', label: 'Admin Console', href: '/admin' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-all"
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
