'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { formatFileSize, timeAgo } from '@/lib/utils';
import { dataStore } from '@/lib/store/dataStore';
import { useToast } from '@/lib/context/ToastContext';
import { Resource, ResourceStatus } from '@/types';

export default function AdminResourcesPage() {
  const { showToast } = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'PUBLISHED' | 'REJECTED' | 'PENDING'>('ALL');

  const loadResources = () => {
    setResources(dataStore.getState().resources);
  };

  useEffect(() => {
    loadResources();
    const unsub = dataStore.subscribe(loadResources);
    return () => unsub();
  }, []);

  const updateStatus = (id: string, newStatus: ResourceStatus, title: string) => {
    dataStore.updateResourceStatus(id, newStatus);
    showToast(`Updated "${title}" status to ${newStatus}`, 'info');
  };

  const deleteResource = (id: string, title: string) => {
    dataStore.deleteResource(id);
    showToast(`Removed "${title}" from platform 🗑️`, 'warning');
  };

  const filtered = resources.filter((r) => {
    if (filter === 'ALL') return true;
    if (filter === 'PUBLISHED') return r.status === 'PUBLISHED';
    if (filter === 'REJECTED') return r.status === 'REJECTED';
    if (filter === 'PENDING') return r.status === 'PENDING_REVIEW';
    return true;
  });

  return (
    <div className="pt-20 pb-safe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <AdminSidebar />

          <div className="flex-1 min-w-0 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Resource Moderation</h1>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
                  Manage approvals, verify syllabus relevance, and archive materials ({resources.length} total)
                </p>
              </div>

              <div className="flex items-center gap-2">
                {(['ALL', 'PUBLISHED', 'REJECTED', 'PENDING'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      filter === tab
                        ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                        : 'glass text-[var(--text-secondary)] hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Resources List */}
            <div className="glass-card rounded-2xl p-6">
              <div className="space-y-4">
                {filtered.map((r) => (
                  <div
                    key={r._id}
                    className="p-4 rounded-2xl border border-white/06 bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-purple-500/30 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-2xl shrink-0">
                        📄
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <Link
                            href={`/resources/${r._id}`}
                            className="font-bold text-white text-sm hover:text-indigo-300 transition-colors"
                          >
                            {r.title}
                          </Link>
                          <span className="badge bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-[10px]">
                            {r.category}
                          </span>
                          <span
                            className={`badge text-[10px] ${
                              r.status === 'PUBLISHED'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : r.status === 'REJECTED'
                                ? 'bg-red-500/20 text-red-300 border-red-500/30'
                                : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                            }`}
                          >
                            {r.status}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-muted)]">
                          Uploaded by <span className="text-white">{r.uploadedBy.name}</span> ·{' '}
                          {timeAgo(r.createdAt)} · {formatFileSize(r.file.size)}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">
                          {r.branch?.name} ({r.branch?.code}) · Sem {r.semester?.number} · {r.subject?.name}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <Link
                        href={`/resources/${r._id}`}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-[var(--text-secondary)] hover:text-white"
                      >
                        Inspect Preview
                      </Link>
                      {r.status !== 'PUBLISHED' ? (
                        <button
                          onClick={() => updateStatus(r._id, 'PUBLISHED', r.title)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-xs text-emerald-300 hover:bg-emerald-500/30 cursor-pointer"
                        >
                          Approve
                        </button>
                      ) : (
                        <button
                          onClick={() => updateStatus(r._id, 'REJECTED', r.title)}
                          className="px-3 py-1.5 rounded-lg bg-yellow-500/20 border border-yellow-500/30 text-xs text-yellow-300 hover:bg-yellow-500/30 cursor-pointer"
                        >
                          Revoke
                        </button>
                      )}
                      <button
                        onClick={() => deleteResource(r._id, r.title)}
                        className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-xs text-red-300 hover:bg-red-500/30 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                {filtered.length === 0 && (
                  <p className="text-xs text-[var(--text-muted)] text-center py-8">
                    No resources matching filter &quot;{filter}&quot;
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
