'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { timeAgo } from '@/lib/utils';
import { dataStore } from '@/lib/store/dataStore';
import { useToast } from '@/lib/context/ToastContext';
import { Report, ReportStatus } from '@/types';

export default function AdminReportsPage() {
  const { showToast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'RESOLVED' | 'DISMISSED'>('ALL');

  const loadReports = () => {
    setReports(dataStore.getReports());
  };

  useEffect(() => {
    loadReports();
    const unsub = dataStore.subscribe(loadReports);
    return () => unsub();
  }, []);

  const resolveReport = (id: string, status: ReportStatus) => {
    dataStore.resolveReport(id, status);
    if (status === 'RESOLVED') {
      showToast('Report resolved — +3 XP awarded to reporter ✅', 'success');
    } else {
      showToast('Report dismissed', 'info');
    }
  };

  const filtered = reports.filter((r) => {
    if (filter === 'ALL') return true;
    return r.status === filter;
  });

  const openCount = reports.filter((r) => r.status === 'OPEN').length;

  return (
    <div className="pt-20 pb-safe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <AdminSidebar />

          <div className="flex-1 min-w-0 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Report Management Queue</h1>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
                  Resolve user flags on incorrect metadata, duplicates, spam, or copyright violations
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {openCount > 0 && (
                  <span className="badge bg-red-500/20 text-red-300 border-red-500/30 text-xs">
                    {openCount} unresolved
                  </span>
                )}
                {(['ALL', 'OPEN', 'RESOLVED', 'DISMISSED'] as const).map((tab) => (
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

            <div className="glass-card rounded-2xl p-6">
              <div className="space-y-4">
                {filtered.map((rep) => {
                  const resource = rep.resourceId
                    ? dataStore.getResourceById(rep.resourceId)
                    : null;

                  return (
                    <div
                      key={rep._id}
                      className={`p-5 rounded-2xl border transition-all ${
                        rep.status === 'OPEN'
                          ? 'border-red-500/30 bg-red-500/[0.02]'
                          : 'border-white/06 bg-white/[0.01] opacity-75'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="badge bg-red-500/20 text-red-300 border-red-500/30 text-xs">
                              {rep.reason.replace(/_/g, ' ')}
                            </span>
                            <span
                              className={`badge text-xs ${
                                rep.status === 'OPEN'
                                  ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                                  : rep.status === 'RESOLVED'
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                  : 'bg-white/10 text-[var(--text-secondary)] border-white/10'
                              }`}
                            >
                              {rep.status}
                            </span>
                          </div>
                          <h3 className="font-bold text-white text-sm">
                            Reporter:{' '}
                            <Link
                              href={`/profile/${rep.reporterId._id}`}
                              className="text-indigo-300 hover:text-indigo-200 transition-colors"
                            >
                              {rep.reporterId.name}
                            </Link>
                          </h3>
                          {resource && (
                            <p className="text-xs text-[var(--text-muted)] mt-0.5">
                              Resource:{' '}
                              <Link
                                href={`/resources/${resource._id}`}
                                className="text-purple-300 hover:text-purple-200 underline"
                              >
                                {resource.title}
                              </Link>
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-[var(--text-muted)] shrink-0 font-mono">
                          {timeAgo(rep.createdAt)}
                        </span>
                      </div>

                      <div className="bg-black/30 rounded-xl p-3.5 border border-white/06 mb-4 text-xs text-[var(--text-secondary)]">
                        <p className="text-[var(--text-muted)] text-[10px] uppercase font-semibold mb-1">
                          Report Description:
                        </p>
                        &quot;{rep.description}&quot;
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/06">
                        {resource && (
                          <Link
                            href={`/resources/${resource._id}`}
                            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                          >
                            Inspect Resource →
                          </Link>
                        )}
                        {rep.status === 'OPEN' && (
                          <div className="flex items-center gap-2 ml-auto">
                            <button
                              onClick={() => resolveReport(rep._id, 'DISMISSED')}
                              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-[var(--text-secondary)] hover:text-white cursor-pointer"
                            >
                              Dismiss Flag
                            </button>
                            <button
                              onClick={() => resolveReport(rep._id, 'RESOLVED')}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-xs text-emerald-300 hover:bg-emerald-500/30 font-semibold cursor-pointer"
                            >
                              Resolve & Award +3 XP
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {filtered.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-3">✅</div>
                    <p className="text-xs text-[var(--text-muted)]">
                      No reports matching filter &quot;{filter}&quot;
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
