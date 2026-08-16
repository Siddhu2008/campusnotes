'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { BRANCHES, LEVEL_CONFIG } from '@/lib/data/mock';
import { formatDate } from '@/lib/utils';
import { dataStore } from '@/lib/store/dataStore';
import { useToast } from '@/lib/context/ToastContext';
import { User, UserRole } from '@/types';

export default function AdminUsersPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');

  const loadUsers = () => {
    setUsers(dataStore.getUsers());
  };

  useEffect(() => {
    loadUsers();
    const unsub = dataStore.subscribe(loadUsers);
    return () => unsub();
  }, []);

  const handleRoleChange = (userId: string, newRole: UserRole, name: string) => {
    dataStore.updateUserRole(userId, newRole);
    showToast(`Updated ${name}'s role to ${newRole}`, 'info');
  };

  const handleToggleStatus = (userId: string, isActive: boolean, name: string) => {
    dataStore.toggleUserStatus(userId);
    showToast(
      isActive ? `Suspended ${name}'s account` : `Activated ${name}'s account`,
      isActive ? 'warning' : 'success'
    );
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const students = filtered.filter((u) => u.role === 'student').length;
  const moderators = filtered.filter((u) => u.role === 'moderator').length;
  const admins = filtered.filter((u) => u.role === 'admin').length;
  const suspended = filtered.filter((u) => !u.isActive).length;

  return (
    <div className="pt-20 pb-safe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <AdminSidebar />

          <div className="flex-1 min-w-0 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Student & Faculty Directory</h1>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
                  Manage user permissions, moderator delegations, and contributor levels
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Search name or student email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field py-2 text-xs"
                />
              </div>
            </div>

            {/* User Summary Pills */}
            <div className="flex items-center gap-3 flex-wrap text-xs">
              <span className="badge bg-blue-500/20 text-blue-300 border-blue-500/30">
                👨‍🎓 {students} Students
              </span>
              <span className="badge bg-purple-500/20 text-purple-300 border-purple-500/30">
                🛡️ {moderators} Moderators
              </span>
              <span className="badge bg-orange-500/20 text-orange-300 border-orange-500/30">
                👑 {admins} Admins
              </span>
              {suspended > 0 && (
                <span className="badge bg-red-500/20 text-red-300 border-red-500/30">
                  🚫 {suspended} Suspended
                </span>
              )}
            </div>

            {/* Users Table */}
            <div className="glass-card rounded-2xl p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/06 text-[var(--text-muted)]">
                      <th className="pb-3 font-semibold">User</th>
                      <th className="pb-3 font-semibold">Branch & Year</th>
                      <th className="pb-3 font-semibold">Reputation & XP</th>
                      <th className="pb-3 font-semibold">Joined</th>
                      <th className="pb-3 font-semibold">Role</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/06">
                    {filtered.map((u) => {
                      const branch = BRANCHES.find((b) => b._id === u.branchId);
                      const lvlConfig = LEVEL_CONFIG[u.level];

                      return (
                        <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 pr-3">
                            <div className="flex items-center gap-3">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={u.avatarUrl}
                                alt={u.name}
                                className="w-9 h-9 rounded-xl border border-white/10 shrink-0 object-cover"
                              />
                              <div>
                                <Link
                                  href={`/profile/${u._id}`}
                                  className="font-bold text-white hover:text-indigo-300 transition-colors block"
                                >
                                  {u.name}
                                </Link>
                                <span className="text-[10px] text-[var(--text-muted)]">{u.email}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 pr-3 text-[var(--text-secondary)]">
                            {branch ? `${branch.code} · Yr ${u.year || 1}` : 'Faculty / Staff'}
                          </td>

                          <td className="py-4 pr-3">
                            <div className="flex items-center gap-2">
                              <span
                                className={`badge text-[10px] bg-gradient-to-r ${lvlConfig.gradient} text-white border-0`}
                              >
                                {u.level}
                              </span>
                              <span className="text-white font-semibold font-mono">
                                {u.points} XP
                              </span>
                            </div>
                          </td>

                          <td className="py-4 pr-3 text-[var(--text-muted)] font-mono text-[10px]">
                            {formatDate(u.createdAt)}
                          </td>

                          <td className="py-4 pr-3">
                            <select
                              value={u.role}
                              onChange={(e) =>
                                handleRoleChange(u._id, e.target.value as UserRole, u.name)
                              }
                              className="bg-white/5 border border-white/10 text-white rounded-lg px-2 py-1.5 text-[11px] cursor-pointer hover:border-indigo-500/40 transition-colors"
                            >
                              <option value="student">Student</option>
                              <option value="moderator">Moderator</option>
                              <option value="admin">Administrator</option>
                            </select>
                          </td>

                          <td className="py-4 pr-3">
                            <span
                              className={`badge text-[10px] ${
                                u.isActive
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                  : 'bg-red-500/20 text-red-300 border-red-500/30'
                              }`}
                            >
                              {u.isActive ? '🟢 Active' : '🔴 Suspended'}
                            </span>
                          </td>

                          <td className="py-4 text-right">
                            <button
                              onClick={() => handleToggleStatus(u._id, u.isActive, u.name)}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all cursor-pointer ${
                                u.isActive
                                  ? 'bg-red-500/10 text-red-300 border-red-500/30 hover:bg-red-500/20'
                                  : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                              }`}
                            >
                              {u.isActive ? 'Suspend' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {filtered.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-xs text-[var(--text-muted)]">
                      No users found matching &quot;{search}&quot;
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
