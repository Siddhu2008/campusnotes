'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { timeAgo } from '@/lib/utils';
import { useAuth } from '@/lib/context/AuthContext';
import { dataStore } from '@/lib/store/dataStore';
import { useToast } from '@/lib/context/ToastContext';
import { Notification } from '@/types';

export default function NotificationsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const loadNotifs = () => {
    if (!user) {
      setNotifications([]);
      return;
    }
    setNotifications(dataStore.getNotifications(user._id));
  };

  useEffect(() => {
    loadNotifs();
    const unsub = dataStore.subscribe(loadNotifs);
    return () => unsub();
  }, [user]);

  const markAllRead = () => {
    if (!user) return;
    dataStore.markAllNotificationsRead(user._id);
    showToast('All notifications marked as read', 'info');
  };

  const toggleRead = (id: string) => {
    dataStore.markNotificationRead(id);
  };

  const deleteNotification = (id: string) => {
    dataStore.deleteNotification(id);
    showToast('Notification removed', 'info');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'NEW_COMMENT':
        return '💬';
      case 'DOWNLOAD_MILESTONE':
        return '🎉';
      case 'RESOURCE_APPROVED':
        return '✅';
      case 'RESOURCE_REJECTED':
        return '❌';
      case 'REPORT_RESOLVED':
        return '🛡️';
      default:
        return '🔔';
    }
  };

  if (!user) {
    return (
      <div className="pt-24 min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-5xl mb-4">🔔</div>
        <h2 className="text-2xl font-bold text-white mb-2">Sign in to View Notifications</h2>
        <p className="text-xs text-[var(--text-muted)] mb-6 max-w-sm">
          Get real-time updates when peers download or comment on your uploaded study notes.
        </p>
        <Link href="/login" className="btn-primary px-6">
          Sign In
        </Link>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="pt-20 pb-safe">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
              <span>🔔</span> Activity Center
            </div>
            <h1 className="text-3xl font-bold text-white">Notifications</h1>
            <p className="text-[var(--text-secondary)] text-sm mt-1">
              Updates on your uploaded notes, downloads milestones, comments, and reports
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="btn-secondary text-xs py-2 px-4 shrink-0 cursor-pointer"
            >
              Mark all as read ({unreadCount})
            </button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif._id}
                className={`glass-card rounded-2xl p-5 flex items-start gap-4 transition-all ${
                  !notif.isRead
                    ? 'border-indigo-500/40 bg-indigo-500/[0.05] shadow-[0_0_20px_rgba(99,102,241,0.08)]'
                    : 'opacity-85'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shrink-0">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-white text-sm truncate">{notif.title}</h3>
                    <span className="text-[10px] text-[var(--text-muted)] shrink-0 font-mono">
                      {timeAgo(notif.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
                    {notif.message}
                  </p>

                  <div className="flex items-center gap-3">
                    {notif.resourceId && (
                      <Link
                        href={`/resources/${notif.resourceId}`}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1"
                      >
                        View Resource →
                      </Link>
                    )}
                    <button
                      onClick={() => toggleRead(notif._id)}
                      className="text-xs text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer"
                    >
                      {notif.isRead ? 'Mark unread' : 'Mark as read'}
                    </button>
                    <button
                      onClick={() => deleteNotification(notif._id)}
                      className="text-xs text-red-400/80 hover:text-red-400 transition-colors ml-auto cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-3xl p-16 text-center max-w-lg mx-auto">
            <div className="text-4xl mb-3">🔕</div>
            <h3 className="text-lg font-semibold text-white mb-1">No notifications right now</h3>
            <p className="text-xs text-[var(--text-muted)]">
              You will be alerted when someone downloads or rates your study notes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
