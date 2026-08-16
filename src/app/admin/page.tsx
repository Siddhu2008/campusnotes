'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';
import {
  UPLOADS_OVER_TIME,
  DOWNLOADS_OVER_TIME,
} from '@/lib/data/mock';
import { formatCount } from '@/lib/utils';
import { dataStore } from '@/lib/store/dataStore';
import { useToast } from '@/lib/context/ToastContext';
import { Resource, User, Report } from '@/types';

export default function AdminDashboardPage() {
  const { showToast } = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);

  const loadData = () => {
    setResources(dataStore.getState().resources);
    setUsers(dataStore.getUsers());
    setReports(dataStore.getReports());
  };

  useEffect(() => {
    loadData();
    const unsub = dataStore.subscribe(loadData);
    return () => unsub();
  }, []);

  const totalDownloads = resources.reduce((acc, r) => acc + (r.stats.downloads || 0), 0);
  const pendingReports = reports.filter((r) => r.status === 'OPEN').length;

  const handleApprove = (id: string, title: string) => {
    dataStore.updateResourceStatus(id, 'PUBLISHED');
    showToast(`Approved "${title}" ✅`, 'success');
  };

  const handleReject = (id: string, title: string) => {
    dataStore.updateResourceStatus(id, 'REJECTED');
    showToast(`Rejected "${title}" ❌`, 'warning');
  };

  return (
    <div className="pt-20 pb-safe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <AdminSidebar />

          <div className="flex-1 min-w-0 space-y-8">
            {/* Top Status Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">System Analytics</h1>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
                  Live platform metrics, user adoption, and moderation queues
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">
                  🟢 Database Synchronized
                </span>
                <span className="text-xs text-[var(--text-muted)]">TCET Live Instance</span>
              </div>
            </div>

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="glass-card rounded-2xl p-5 border-indigo-500/20">
                <p className="text-xs text-[var(--text-muted)] font-medium">Registered Students</p>
                <p className="text-2xl sm:text-3xl font-black text-white mt-1">
                  {users.length.toLocaleString()}
                </p>
                <p className="text-[10px] text-emerald-400 mt-2 font-medium">↑ Active contributors</p>
              </div>

              <div className="glass-card rounded-2xl p-5 border-purple-500/20">
                <p className="text-xs text-[var(--text-muted)] font-medium">Total Resources</p>
                <p className="text-2xl sm:text-3xl font-black text-white mt-1">
                  {resources.length.toLocaleString()}
                </p>
                <p className="text-[10px] text-indigo-400 mt-2 font-medium">Notes & Question Papers</p>
              </div>

              <div className="glass-card rounded-2xl p-5 border-emerald-500/20">
                <p className="text-xs text-[var(--text-muted)] font-medium">Aggregate Downloads</p>
                <p className="text-2xl sm:text-3xl font-black text-white mt-1">
                  {formatCount(totalDownloads)}
                </p>
                <p className="text-[10px] text-emerald-400 mt-2 font-medium">Bandwidth delivered</p>
              </div>

              <div className="glass-card rounded-2xl p-5 border-red-500/20">
                <p className="text-xs text-[var(--text-muted)] font-medium">Open Flags & Reports</p>
                <p className="text-2xl sm:text-3xl font-black text-red-400 mt-1">
                  {pendingReports}
                </p>
                <Link href="/admin/reports" className="text-[10px] text-red-400 underline mt-2 block">
                  Resolve pending issues →
                </Link>
              </div>
            </div>

            {/* Growth Trends Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-white text-sm">Monthly Verified Uploads</h3>
                    <p className="text-[10px] text-[var(--text-muted)]">
                      Faculty and student contributions
                    </p>
                  </div>
                  <span className="text-xs text-indigo-400 font-semibold">+450% YTD</span>
                </div>
                <div className="flex items-end justify-between gap-3 h-44 pt-6 border-b border-white/06">
                  {UPLOADS_OVER_TIME.map((pt) => {
                    const heightPercent = Math.round((pt.value / 200) * 100);
                    return (
                      <div key={pt.date} className="flex-1 flex flex-col items-center gap-2 group">
                        <span className="text-[10px] font-bold text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity">
                          {pt.value}
                        </span>
                        <div
                          className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-purple-500 transition-all duration-500 group-hover:from-indigo-400 group-hover:to-purple-300"
                          style={{ height: `${heightPercent}%` }}
                        />
                        <span className="text-[10px] text-[var(--text-muted)]">{pt.date}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-white text-sm">Download Traffic Distribution</h3>
                    <p className="text-[10px] text-[var(--text-muted)]">Exam session spikes</p>
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold">8.9k peak</span>
                </div>
                <div className="flex items-end justify-between gap-3 h-44 pt-6 border-b border-white/06">
                  {DOWNLOADS_OVER_TIME.map((pt) => {
                    const heightPercent = Math.round((pt.value / 9500) * 100);
                    return (
                      <div key={pt.date} className="flex-1 flex flex-col items-center gap-2 group">
                        <span className="text-[10px] font-bold text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity">
                          {formatCount(pt.value)}
                        </span>
                        <div
                          className="w-full rounded-t-lg bg-gradient-to-t from-emerald-600 to-teal-400 transition-all duration-500 group-hover:from-emerald-400 group-hover:to-teal-300"
                          style={{ height: `${heightPercent}%` }}
                        />
                        <span className="text-[10px] text-[var(--text-muted)]">{pt.date}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Moderation Fast Action Table */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-white text-sm">Recent Uploads Queue</h3>
                  <p className="text-[10px] text-[var(--text-muted)]">
                    Direct controls to approve or revoke materials
                  </p>
                </div>
                <Link
                  href="/admin/resources"
                  className="text-xs text-purple-400 hover:text-purple-300"
                >
                  Manage all resources ({resources.length}) →
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/06 text-[var(--text-muted)]">
                      <th className="pb-3 font-semibold">Document Title</th>
                      <th className="pb-3 font-semibold">Uploader</th>
                      <th className="pb-3 font-semibold">Branch & Sem</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/06">
                    {resources.slice(0, 5).map((res) => (
                      <tr key={res._id} className="hover:bg-white/[0.02]">
                        <td className="py-3.5 pr-3 font-medium text-white max-w-[200px] truncate">
                          <Link
                            href={`/resources/${res._id}`}
                            className="hover:text-indigo-300 transition-colors"
                          >
                            {res.title}
                          </Link>
                        </td>
                        <td className="py-3.5 pr-3 text-[var(--text-secondary)]">
                          {res.uploadedBy.name}
                        </td>
                        <td className="py-3.5 pr-3 text-[var(--text-secondary)]">
                          {res.branch?.code} · Sem {res.semester?.number}
                        </td>
                        <td className="py-3.5 pr-3">
                          <span
                            className={`badge text-[10px] ${
                              res.status === 'PUBLISHED'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                            }`}
                          >
                            {res.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right space-x-2">
                          {res.status !== 'PUBLISHED' ? (
                            <button
                              onClick={() => handleApprove(res._id, res.title)}
                              className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 cursor-pointer"
                            >
                              Approve
                            </button>
                          ) : (
                            <button
                              onClick={() => handleReject(res._id, res.title)}
                              className="px-2.5 py-1 rounded-md bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 cursor-pointer"
                            >
                              Revoke
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
