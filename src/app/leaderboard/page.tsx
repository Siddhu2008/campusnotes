'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BRANCHES, LEVEL_CONFIG } from '@/lib/data/mock';
import { formatCount, getLevelProgress } from '@/lib/utils';
import { dataStore } from '@/lib/store/dataStore';
import { User } from '@/types';

const rankEmoji = (i: number) => {
  if (i === 0) return '🥇';
  if (i === 1) return '🥈';
  if (i === 2) return '🥉';
  return `#${i + 1}`;
};

export default function LeaderboardPage() {
  const [rankedUsers, setRankedUsers] = useState<User[]>([]);

  const loadLeaderboard = () => {
    const list = [...dataStore.getUsers()]
      .filter((u) => u.role === 'student')
      .sort((a, b) => b.points - a.points);
    setRankedUsers(list);
  };

  useEffect(() => {
    loadLeaderboard();
    const unsub = dataStore.subscribe(loadLeaderboard);
    return () => unsub();
  }, []);

  return (
    <div className="pt-20 pb-safe">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-5xl mb-3">🏆</div>
          <h1 className="text-3xl font-bold text-white mb-2">College Leaderboard</h1>
          <p className="text-[var(--text-secondary)] text-xs sm:text-sm">
            Top academic contributors across all TCET engineering departments. Share notes to climb!
          </p>
        </div>

        {/* Top 3 Podium Display */}
        {rankedUsers.length >= 3 && (
          <div className="flex items-end justify-center gap-3 sm:gap-6 mb-12">
            {/* 2nd Place */}
            <div className="flex flex-col items-center w-24 sm:w-32">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={rankedUsers[1].avatarUrl}
                alt={rankedUsers[1].name}
                className="w-12 sm:w-16 h-12 sm:h-16 rounded-2xl border-2 border-gray-400/50 mb-2 object-cover"
              />
              <p className="text-xs font-semibold text-white text-center truncate max-w-full mb-1">
                {rankedUsers[1].name.split(' ')[0]}
              </p>
              <div className="bg-gradient-to-br from-gray-400 to-gray-600 text-white text-xl sm:text-2xl font-black px-2 py-1 rounded-t-2xl w-full text-center h-20 sm:h-24 flex items-end justify-center pb-2 shadow-lg">
                🥈
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center w-28 sm:w-36">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={rankedUsers[0].avatarUrl}
                  alt={rankedUsers[0].name}
                  className="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl border-2 border-yellow-400/70 mb-2 object-cover"
                />
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl animate-bounce">
                  👑
                </div>
              </div>
              <p className="text-xs font-semibold text-white text-center truncate max-w-full mb-1">
                {rankedUsers[0].name.split(' ')[0]}
              </p>
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-2xl sm:text-3xl font-black px-2 py-1 rounded-t-2xl w-full text-center h-28 sm:h-32 flex items-end justify-center pb-2 shadow-[0_0_25px_rgba(251,191,36,0.3)]">
                🥇
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center w-24 sm:w-32">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={rankedUsers[2].avatarUrl}
                alt={rankedUsers[2].name}
                className="w-12 sm:w-16 h-12 sm:h-16 rounded-2xl border-2 border-orange-400/50 mb-2 object-cover"
              />
              <p className="text-xs font-semibold text-white text-center truncate max-w-full mb-1">
                {rankedUsers[2].name.split(' ')[0]}
              </p>
              <div className="bg-gradient-to-br from-orange-400 to-red-500 text-white text-xl sm:text-2xl font-black px-2 py-1 rounded-t-2xl w-full text-center h-16 sm:h-20 flex items-end justify-center pb-2 shadow-lg">
                🥉
              </div>
            </div>
          </div>
        )}

        {/* Full Ranking Table */}
        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/06 flex items-center justify-between">
            <h2 className="font-semibold text-white text-sm">All Student Contributors</h2>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              {rankedUsers.length} ranked
            </span>
          </div>

          <div className="divide-y divide-white/06">
            {rankedUsers.map((u, i) => {
              const branch = BRANCHES.find((b) => b._id === u.branchId);
              const lvlConfig = LEVEL_CONFIG[u.level];
              const progress = getLevelProgress(u.points, u.level);

              return (
                <div
                  key={u._id}
                  className={`flex items-center gap-4 px-6 py-4 transition-all hover:bg-white/5 ${
                    i < 3 ? 'bg-white/[0.02]' : ''
                  }`}
                >
                  <div
                    className={`w-8 text-center font-black text-base ${
                      i === 0
                        ? 'text-yellow-400'
                        : i === 1
                        ? 'text-gray-300'
                        : i === 2
                        ? 'text-orange-400'
                        : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {rankEmoji(i)}
                  </div>

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={u.avatarUrl}
                    alt={u.name}
                    className={`w-10 h-10 rounded-xl border shrink-0 object-cover ${
                      i < 3 ? 'border-indigo-500/50' : 'border-white/10'
                    }`}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/profile/${u._id}`}
                        className="font-semibold text-white hover:text-indigo-300 transition-colors text-sm truncate"
                      >
                        {u.name}
                      </Link>
                      <span
                        className={`badge text-[10px] bg-gradient-to-r ${lvlConfig.gradient} text-white border-0`}
                      >
                        {u.level}
                      </span>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                      {branch ? `${branch.name} (${branch.code}) · Year ${u.year}` : 'Student'}
                    </p>
                    <div className="h-1 bg-white/10 rounded-full w-28 mt-1.5 overflow-hidden hidden sm:block">
                      <div
                        className={`h-full bg-gradient-to-r ${lvlConfig.gradient} rounded-full`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-base sm:text-lg font-bold text-white">
                      {u.points.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)] font-mono">XP Points</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* XP Earning Rules Guide */}
        <div className="glass-card rounded-3xl p-6 mt-8">
          <h3 className="font-semibold text-white mb-4 text-sm">How to Earn Contributor XP</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { action: 'Upload approved notes/papers', xp: '+10 XP' },
              { action: 'Resource hits 10+ downloads', xp: '+5 XP' },
              { action: 'Receive a 5-star rating', xp: '+2 XP' },
              { action: 'Helpful answer in comments', xp: '+5 XP' },
              { action: 'Confirmed report resolved', xp: '+3 XP' },
              { action: 'Rate a peer study resource', xp: '+2 XP' },
            ].map((item) => (
              <div
                key={item.action}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/06 flex items-center justify-between gap-2"
              >
                <span className="text-[11px] text-[var(--text-secondary)] leading-tight">
                  {item.action}
                </span>
                <span className="text-xs font-bold text-emerald-400 shrink-0 font-mono">
                  {item.xp}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
