'use client';

import { useState, useEffect, use } from 'react';
import { BRANCHES, LEVEL_CONFIG } from '@/lib/data/mock';
import { formatCount, formatDate, getLevelProgress } from '@/lib/utils';
import ResourceCard from '@/components/resources/ResourceCard';
import { dataStore } from '@/lib/store/dataStore';
import { User, Resource } from '@/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProfilePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const userId = resolvedParams.id;

  const [user, setUser] = useState<User | null>(null);
  const [userResources, setUserResources] = useState<Resource[]>([]);

  const loadData = () => {
    const u = dataStore.getUserById(userId) || dataStore.getUsers()[0];
    if (u) {
      setUser(u);
      const resList = dataStore
        .getResources()
        .filter((r) => r.uploadedBy._id === u._id);
      setUserResources(resList);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = dataStore.subscribe(loadData);
    return () => unsub();
  }, [userId]);

  if (!user) return null;

  const branch = BRANCHES.find((b) => b._id === user.branchId);
  const lvlConfig = LEVEL_CONFIG[user.level];
  const progress = getLevelProgress(user.points, user.level);

  const totalDownloads = userResources.reduce(
    (acc, r) => acc + (r.stats.downloads || 0),
    0
  );

  return (
    <div className="pt-20 pb-safe">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
          <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-24 h-24 rounded-3xl border-2 border-indigo-500/40 object-cover"
              />
              <div
                className={`absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-lg text-[10px] font-bold text-white bg-gradient-to-r ${lvlConfig.gradient} shadow-lg`}
              >
                {user.level}
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{user.name}</h1>
              <p className="text-[var(--text-secondary)] text-xs sm:text-sm mb-3">{user.email}</p>

              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
                {branch && (
                  <span className="badge bg-indigo-500/10 text-indigo-300 border-indigo-500/20 text-xs">
                    🏫 {branch.name} ({branch.code})
                  </span>
                )}
                {user.year && (
                  <span className="badge bg-purple-500/10 text-purple-300 border-purple-500/20 text-xs">
                    📅 Year {user.year}
                  </span>
                )}
                {user.semester && (
                  <span className="badge bg-blue-500/10 text-blue-300 border-blue-500/20 text-xs">
                    🎓 Sem {user.semester}
                  </span>
                )}
              </div>

              {user.bio && (
                <p className="text-[var(--text-secondary)] text-xs sm:text-sm leading-relaxed mb-4 max-w-lg">
                  {user.bio}
                </p>
              )}

              <p className="text-[10px] text-[var(--text-muted)]">
                Student Contributor since {formatDate(user.createdAt)}
              </p>
            </div>

            {/* XP Box */}
            <div className="shrink-0 w-full sm:w-48">
              <div className="glass rounded-2xl p-4 text-center">
                <div className="text-3xl font-black text-white mb-0.5">
                  {user.points.toLocaleString()}
                </div>
                <div className="text-xs text-[var(--text-muted)] mb-3">Total XP</div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-1">
                  <div
                    className={`h-full bg-gradient-to-r ${lvlConfig.gradient} rounded-full transition-all duration-500`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-[10px] text-[var(--text-muted)]">{progress}% to next tier</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Stats Metric Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Uploads', value: userResources.length, icon: '📤' },
            { label: 'Downloads Earned', value: formatCount(totalDownloads), icon: '⬇️' },
            { label: 'Reputation Tier', value: user.level, icon: '⭐' },
            { label: 'XP Points', value: user.points.toLocaleString(), icon: '🏆' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-2xl p-4 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl font-bold text-white truncate">{stat.value}</div>
              <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Uploaded Documents Archive */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            {userResources.length} Document{userResources.length !== 1 ? 's' : ''} Published
          </h2>
          {userResources.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {userResources.map((resource) => (
                <ResourceCard key={resource._id} resource={resource} />
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-xs text-[var(--text-secondary)]">No public notes uploaded yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
