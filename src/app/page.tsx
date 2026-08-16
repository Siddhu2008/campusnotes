'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ResourceCard from '@/components/resources/ResourceCard';
import { CATEGORY_CONFIG, LEVEL_CONFIG, BRANCHES } from '@/lib/data/mock';
import { formatCount } from '@/lib/utils';
import { dataStore } from '@/lib/store/dataStore';
import { Resource, User } from '@/types';

export default function HomePage() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');
  const [resources, setResources] = useState<Resource[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const loadData = () => {
    setResources(dataStore.getResources());
    setUsers(dataStore.getUsers());
  };

  useEffect(() => {
    loadData();
    const unsubscribe = dataStore.subscribe(loadData);
    return () => {
      unsubscribe();
    };
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/resources?search=${encodeURIComponent(searchInput.trim())}`);
    } else {
      router.push('/resources');
    }
  };

  const totalDownloads = resources.reduce((acc, r) => acc + (r.stats.downloads || 0), 0);
  const trendingResources = [...resources]
    .sort((a, b) => b.stats.downloads - a.stats.downloads)
    .slice(0, 6);

  const recentResources = [...resources]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const topContributors = [...users]
    .filter((u) => u.role === 'student')
    .sort((a, b) => b.points - a.points)
    .slice(0, 4);

  const stats = [
    { value: resources.length.toString(), label: 'Resources', emoji: '📚' },
    { value: users.length.toString(), label: 'Students', emoji: '🎓' },
    { value: `${formatCount(totalDownloads)}+`, label: 'Downloads', emoji: '⬇️' },
    { value: '4.8★', label: 'Avg Rating', emoji: '⭐' },
  ];

  return (
    <div className="pb-safe">
      {/* ================================================================
          HERO SECTION
          ================================================================ */}
      <section className="hero-bg grid-pattern min-h-screen flex items-center pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 w-full">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              TCET&apos;s Academic Resource Hub
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-fade-in-up">
              Share Knowledge,{' '}
              <span className="gradient-text">Ace Your Exams</span>
            </h1>

            <p className="text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed mb-10 animate-fade-in-up delay-100">
              Upload your notes, discover resources from top students, and build your academic reputation.
              Everything organized by branch, semester, and subject — just for TCET.
            </p>

            {/* Search Bar */}
            <form
              onSubmit={handleHeroSearch}
              className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8 animate-fade-in-up delay-200"
            >
              <div className="relative flex-1">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search notes, question papers, subjects..."
                  className="input-field pl-12 pr-4 h-12 rounded-xl text-base"
                />
              </div>
              <button
                type="submit"
                className="btn-primary h-12 px-6 rounded-xl text-sm shrink-0 cursor-pointer"
              >
                Search
              </button>
            </form>

            {/* Quick Links */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-[var(--text-muted)] animate-fade-in-up delay-300">
              <span>Popular:</span>
              {['Data Structures', 'DBMS', 'OS', 'Computer Networks', 'Machine Learning'].map((tag) => (
                <Link
                  key={tag}
                  href={`/resources?search=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:border-indigo-500/40 hover:text-indigo-300 transition-all duration-200 text-xs"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mt-16 animate-fade-in-up delay-400">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-card rounded-2xl p-4 text-center">
                <div className="text-2xl mb-1">{stat.emoji}</div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:flex flex-col items-center gap-1">
          <span className="text-xs text-[var(--text-muted)]">Scroll to explore</span>
          <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ================================================================
          POPULAR CATEGORIES
          ================================================================ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Browse by Category</h2>
            <p className="text-[var(--text-secondary)]">Find exactly what you need for your exams</p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-9 gap-3">
            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
              <Link
                key={key}
                href={`/resources?category=${key}`}
                className="glass-card rounded-2xl p-3 sm:p-4 flex flex-col items-center gap-2 text-center group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-200">
                  {config.emoji}
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-[var(--text-secondary)] group-hover:text-white transition-colors leading-tight">
                  {config.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          BRANCHES QUICK ACCESS
          ================================================================ */}
      <section className="py-12 bg-[var(--bg-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Browse by Branch</h2>
              <p className="text-[var(--text-secondary)] text-sm mt-1">All TCET engineering branches</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {BRANCHES.map((branch) => (
              <Link
                key={branch._id}
                href={`/resources?branchId=${branch._id}`}
                className="glass-card rounded-xl p-4 text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border border-indigo-500/20 flex items-center justify-center mx-auto mb-2 group-hover:from-indigo-500/30 transition-all">
                  <span className="text-sm font-bold text-indigo-300">{branch.code}</span>
                </div>
                <p className="text-xs font-medium text-[var(--text-secondary)] group-hover:text-white transition-colors leading-tight">
                  {branch.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          TRENDING RESOURCES
          ================================================================ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">🔥 Trending This Week</h2>
              <p className="text-[var(--text-secondary)]">Most downloaded resources by TCET students</p>
            </div>
            <Link href="/resources" className="btn-ghost hidden sm:inline-flex text-sm">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {trendingResources.map((resource) => (
              <ResourceCard key={resource._id} resource={resource} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/resources" className="btn-secondary">
              Browse All Resources
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================
          RECENTLY ADDED
          ================================================================ */}
      <section className="py-12 bg-[var(--bg-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">🆕 Recently Added</h2>
              <p className="text-[var(--text-secondary)] text-sm">Fresh uploads from your peers</p>
            </div>
          </div>
          <div className="space-y-3">
            {recentResources.map((resource) => (
              <ResourceCard key={resource._id} resource={resource} variant="horizontal" />
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          TOP CONTRIBUTORS
          ================================================================ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">🏆 Top Contributors</h2>
            <p className="text-[var(--text-secondary)]">Students leading the way in knowledge sharing</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {topContributors.map((user, i) => {
              const lvlConfig = LEVEL_CONFIG[user.level];
              return (
                <Link
                  key={user._id}
                  href={`/profile/${user._id}`}
                  className="glass-card rounded-2xl p-5 flex flex-col items-center text-center group"
                >
                  <div
                    className={`text-2xl font-black mb-3 ${
                      i === 0
                        ? 'text-yellow-400'
                        : i === 1
                        ? 'text-gray-300'
                        : i === 2
                        ? 'text-orange-400'
                        : 'text-[var(--text-muted)]'
                    }`}
                  >
                    #{i + 1}
                  </div>
                  <div className="relative mb-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-16 h-16 rounded-2xl border-2 border-indigo-500/40 group-hover:border-indigo-400 transition-colors"
                    />
                    {i === 0 && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-sm">
                        👑
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-white text-sm group-hover:text-indigo-300 transition-colors">
                    {user.name}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 mb-2">
                    {BRANCHES.find((b) => b._id === user.branchId)?.code} · Year {user.year}
                  </p>
                  <span
                    className={`badge text-[10px] ${
                      lvlConfig.gradient ? `bg-gradient-to-r ${lvlConfig.gradient}` : 'bg-white/10'
                    } text-white border-0 mb-3`}
                  >
                    {user.level}
                  </span>
                  <div className="grid grid-cols-3 gap-2 w-full pt-3 border-t border-white/06">
                    <div className="text-center">
                      <div className="text-sm font-bold text-white">{user.stats?.uploads || 0}</div>
                      <div className="text-[9px] text-[var(--text-muted)]">Uploads</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-white">{formatCount(user.points)}</div>
                      <div className="text-[9px] text-[var(--text-muted)]">XP</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-white">{formatCount(user.stats?.downloads || 0)}</div>
                      <div className="text-[9px] text-[var(--text-muted)]">DLs</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link href="/leaderboard" className="btn-secondary">
              View Full Leaderboard
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================
          CTA SECTION
          ================================================================ */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
            <div className="relative">
              <div className="text-4xl mb-4">📤</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Have great notes? <span className="gradient-text">Share them!</span>
              </h2>
              <p className="text-[var(--text-secondary)] text-lg mb-8 max-w-2xl mx-auto">
                Upload your notes and help fellow TCET students. Earn XP, build your reputation, and become a Campus Mentor.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/upload" className="btn-primary px-8 py-3 text-base rounded-xl">
                  📤 Upload Resources
                </Link>
                <Link href="/register" className="btn-ghost px-8 py-3 text-base rounded-xl">
                  Create Account →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
