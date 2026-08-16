'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BRANCHES, SEMESTERS, SUBJECTS } from '@/lib/data/mock';

export default function SubjectsPage() {
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0]._id);
  const [selectedSemester, setSelectedSemester] = useState('all');

  const filteredSubjects = SUBJECTS.filter((s) => {
    if (selectedBranch && s.branchId !== selectedBranch) return false;
    if (selectedSemester !== 'all' && s.semesterId !== selectedSemester) return false;
    return true;
  });

  const currentBranch = BRANCHES.find((b) => b._id === selectedBranch);

  return (
    <div className="pt-20 pb-safe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
            <span>📚</span> Academic Curriculum
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            TCET Subjects & Syllabus
          </h1>
          <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed">
            Browse semester-wise subjects, units, notes, and question paper archives across all engineering branches.
          </p>
        </div>

        {/* Branch Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scroll-x">
          {BRANCHES.map((b) => (
            <button
              key={b._id}
              onClick={() => setSelectedBranch(b._id)}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2.5 ${
                selectedBranch === b._id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.35)]'
                  : 'glass text-[var(--text-secondary)] hover:text-white hover:border-indigo-500/30'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-indigo-300" />
              <span>{b.name}</span>
              <span className="text-[10px] opacity-70">({b.code})</span>
            </button>
          ))}
        </div>

        {/* Semester Filter Pill Row */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          <span className="text-xs text-[var(--text-muted)] font-medium mr-2">Semester:</span>
          <button
            onClick={() => setSelectedSemester('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedSemester === 'all'
                ? 'bg-white text-black font-semibold'
                : 'bg-white/5 text-[var(--text-secondary)] hover:bg-white/10'
            }`}
          >
            All Semesters
          </button>
          {SEMESTERS.map((s) => (
            <button
              key={s._id}
              onClick={() => setSelectedSemester(s._id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedSemester === s._id
                  ? 'bg-indigo-500 text-white font-semibold shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                  : 'bg-white/5 text-[var(--text-secondary)] hover:bg-white/10'
              }`}
            >
              Sem {s.number}
            </button>
          ))}
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((sub) => {
            const sem = SEMESTERS.find((s) => s._id === sub.semesterId);
            return (
              <div
                key={sub._id}
                className="glass-card rounded-2xl p-6 flex flex-col justify-between group hover:border-indigo-500/40"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono text-xs font-bold">
                      {sub.code}
                    </span>
                    <span className="badge bg-white/5 text-[var(--text-secondary)] border-white/10 text-xs">
                      Sem {sem?.number}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors mb-2">
                    {sub.name}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-4">
                    {sub.description}
                  </p>

                  {/* Units List */}
                  {sub.units && sub.units.length > 0 && (
                    <div className="space-y-1.5 mb-5 pt-3 border-t border-white/06">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                        Curriculum Units ({sub.units.length})
                      </p>
                      <div className="space-y-1">
                        {sub.units.slice(0, 3).map((u) => (
                          <div
                            key={u.number}
                            className="flex items-center gap-2 text-xs text-[var(--text-secondary)]"
                          >
                            <span className="w-4 h-4 rounded bg-white/5 text-[10px] flex items-center justify-center text-indigo-300 font-semibold shrink-0">
                              {u.number}
                            </span>
                            <span className="truncate">{u.title}</span>
                          </div>
                        ))}
                        {sub.units.length > 3 && (
                          <span className="text-[10px] text-indigo-400 font-medium">
                            +{sub.units.length - 3} more units
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-white/06">
                  <Link
                    href={`/resources?subject=${sub._id}`}
                    className="btn-primary w-full justify-center text-xs py-2.5 rounded-xl"
                  >
                    View Notes & Papers →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSubjects.length === 0 && (
          <div className="glass-card rounded-3xl p-16 text-center max-w-lg mx-auto my-8">
            <div className="text-4xl mb-3">📖</div>
            <h3 className="text-lg font-bold text-white mb-1">No subjects listed yet</h3>
            <p className="text-xs text-[var(--text-muted)]">
              Curriculum data for this semester in {currentBranch?.name} is being uploaded by student coordinators.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
