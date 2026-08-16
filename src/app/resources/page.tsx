'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ResourceCard from '@/components/resources/ResourceCard';
import { BRANCHES, SEMESTERS, SUBJECTS, CATEGORY_CONFIG } from '@/lib/data/mock';
import { dataStore } from '@/lib/store/dataStore';
import { Resource, ResourceCategory } from '@/types';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'most_downloaded', label: 'Most Downloaded' },
  { value: 'highest_rated', label: 'Highest Rated' },
  { value: 'most_viewed', label: 'Most Viewed' },
];

const RATING_OPTIONS = [
  { value: 0, label: 'All Ratings' },
  { value: 4, label: '4★ & above' },
  { value: 3, label: '3★ & above' },
];

function ResourcesContent() {
  const searchParams = useSearchParams();
  const [allResources, setAllResources] = useState<Resource[]>([]);

  const initialSearch = searchParams.get('search') || searchParams.get('q') || '';
  const initialBranch = searchParams.get('branchId') || searchParams.get('branch') || '';
  const initialCategory = (searchParams.get('category') as ResourceCategory) || '';
  const initialSubject = searchParams.get('subject') || searchParams.get('subjectId') || '';
  const initialSemester = searchParams.get('semester') || searchParams.get('semesterId') || '';

  const [search, setSearch] = useState(initialSearch);
  const [selectedBranch, setSelectedBranch] = useState(initialBranch);
  const [selectedSemester, setSelectedSemester] = useState(initialSemester);
  const [selectedSubject, setSelectedSubject] = useState(initialSubject);
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | ''>(initialCategory);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState('newest');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    if (initialSearch) setSearch(initialSearch);
    if (initialBranch) setSelectedBranch(initialBranch);
    if (initialCategory) setSelectedCategory(initialCategory);
    if (initialSubject) setSelectedSubject(initialSubject);
    if (initialSemester) setSelectedSemester(initialSemester);
  }, [initialSearch, initialBranch, initialCategory, initialSubject, initialSemester]);

  const loadData = () => {
    setAllResources(dataStore.getResources());
  };

  useEffect(() => {
    loadData();
    const unsub = dataStore.subscribe(loadData);
    return () => unsub();
  }, []);

  const filteredResources = useMemo(() => {
    let list = [...allResources];

    // Text search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q)) ||
          r.subject?.name.toLowerCase().includes(q) ||
          r.branch?.name.toLowerCase().includes(q) ||
          r.branch?.code.toLowerCase().includes(q)
      );
    }

    // Filters
    if (selectedBranch) list = list.filter((r) => r.branchId === selectedBranch);
    if (selectedSemester) list = list.filter((r) => r.semesterId === selectedSemester);
    if (selectedSubject) list = list.filter((r) => r.subjectId === selectedSubject);
    if (selectedCategory) list = list.filter((r) => r.category === selectedCategory);
    if (minRating > 0) list = list.filter((r) => r.stats.averageRating >= minRating);

    // Sort
    switch (sort) {
      case 'newest':
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'most_downloaded':
        list.sort((a, b) => b.stats.downloads - a.stats.downloads);
        break;
      case 'highest_rated':
        list.sort((a, b) => b.stats.averageRating - a.stats.averageRating);
        break;
      case 'most_viewed':
        list.sort((a, b) => b.stats.views - a.stats.views);
        break;
    }

    return list;
  }, [allResources, search, selectedBranch, selectedSemester, selectedSubject, selectedCategory, minRating, sort]);

  const hasActiveFilters =
    selectedBranch || selectedSemester || selectedSubject || selectedCategory || minRating > 0;

  const clearFilters = () => {
    setSelectedBranch('');
    setSelectedSemester('');
    setSelectedSubject('');
    setSelectedCategory('');
    setMinRating(0);
    setSearch('');
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Branch */}
      <div>
        <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider block mb-2">
          Branch
        </label>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedBranch('')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all cursor-pointer ${
              !selectedBranch ? 'bg-indigo-500/20 text-indigo-300' : 'text-[var(--text-secondary)] hover:bg-white/5'
            }`}
          >
            All Branches
          </button>
          {BRANCHES.map((branch) => (
            <button
              key={branch._id}
              onClick={() => setSelectedBranch(branch._id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between cursor-pointer ${
                selectedBranch === branch._id
                  ? 'bg-indigo-500/20 text-indigo-300'
                  : 'text-[var(--text-secondary)] hover:bg-white/5'
              }`}
            >
              <span>{branch.name}</span>
              <span className="text-xs opacity-60 font-mono">{branch.code}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Semester */}
      <div>
        <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider block mb-2">
          Semester
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {SEMESTERS.map((sem) => (
            <button
              key={sem._id}
              onClick={() => setSelectedSemester(selectedSemester === sem._id ? '' : sem._id)}
              className={`px-2 py-2 rounded-lg text-sm font-medium transition-all text-center cursor-pointer ${
                selectedSemester === sem._id
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white/5 text-[var(--text-secondary)] hover:bg-white/10'
              }`}
            >
              {sem.number}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider block mb-2">
          Category
        </label>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedCategory('')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all cursor-pointer ${
              !selectedCategory ? 'bg-indigo-500/20 text-indigo-300' : 'text-[var(--text-secondary)] hover:bg-white/5'
            }`}
          >
            All Categories
          </button>
          {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(selectedCategory === key ? '' : (key as ResourceCategory))}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 cursor-pointer ${
                selectedCategory === key
                  ? 'bg-indigo-500/20 text-indigo-300'
                  : 'text-[var(--text-secondary)] hover:bg-white/5'
              }`}
            >
              <span>{cfg.emoji}</span>
              <span>{cfg.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider block mb-2">
          Min Rating
        </label>
        <div className="space-y-1">
          {RATING_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setMinRating(opt.value)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all cursor-pointer ${
                minRating === opt.value
                  ? 'bg-indigo-500/20 text-indigo-300'
                  : 'text-[var(--text-secondary)] hover:bg-white/5'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-all cursor-pointer"
        >
          ✕ Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="pt-20 pb-safe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Browse Resources</h1>
          <p className="text-[var(--text-secondary)]">
            Find notes, question papers, and study material from TCET students
          </p>
        </div>

        {/* Search + Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resources, subjects, tags..."
              className="input-field pl-10 h-10"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input-field h-10 w-auto cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className={`lg:hidden btn-ghost h-10 px-4 flex items-center gap-2 text-sm ${
              hasActiveFilters ? 'text-indigo-400 border-indigo-500/30' : ''
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filters {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-indigo-400" />}
          </button>
        </div>

        {/* Active Filter Badges */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedBranch && (
              <span
                className="badge bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-xs gap-1.5 cursor-pointer"
                onClick={() => setSelectedBranch('')}
              >
                {BRANCHES.find((b) => b._id === selectedBranch)?.code} ✕
              </span>
            )}
            {selectedSemester && (
              <span
                className="badge bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-xs gap-1.5 cursor-pointer"
                onClick={() => setSelectedSemester('')}
              >
                Sem {SEMESTERS.find((s) => s._id === selectedSemester)?.number} ✕
              </span>
            )}
            {selectedCategory && (
              <span
                className="badge bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-xs gap-1.5 cursor-pointer"
                onClick={() => setSelectedCategory('')}
              >
                {CATEGORY_CONFIG[selectedCategory]?.label} ✕
              </span>
            )}
            {minRating > 0 && (
              <span
                className="badge bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-xs gap-1.5 cursor-pointer"
                onClick={() => setMinRating(0)}
              >
                {minRating}★+ ✕
              </span>
            )}
          </div>
        )}

        {/* Mobile Filter Drawer */}
        {filtersOpen && (
          <div className="lg:hidden glass-card rounded-2xl p-5 mb-6 animate-fade-in">
            <FilterPanel />
          </div>
        )}

        {/* Main Grid Layout */}
        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="glass-card rounded-2xl p-5 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white text-sm">Filters</h3>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-xs text-red-400 hover:text-red-300 cursor-pointer">
                    Clear all
                  </button>
                )}
              </div>
              <FilterPanel />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-[var(--text-muted)]">
                <span className="text-white font-semibold">{filteredResources.length}</span> resources found
                {search && (
                  <span>
                    {' '}
                    for &quot;<span className="text-indigo-300">{search}</span>&quot;
                  </span>
                )}
              </p>
            </div>

            {filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredResources.map((resource) => (
                  <ResourceCard key={resource._id} resource={resource} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 glass-card rounded-2xl">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-white mb-2">No resources found</h3>
                <p className="text-[var(--text-muted)] mb-6">Try adjusting your search or filters</p>
                <button onClick={clearFilters} className="btn-secondary cursor-pointer">
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-white">Loading resources...</div>}>
      <ResourcesContent />
    </Suspense>
  );
}
