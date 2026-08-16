'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BRANCHES, SEMESTERS, SUBJECTS, CATEGORY_CONFIG } from '@/lib/data/mock';
import { ResourceCategory, Resource } from '@/types';
import { dataStore } from '@/lib/store/dataStore';
import { useAuth } from '@/lib/context/AuthContext';
import { useToast } from '@/lib/context/ToastContext';

const STEPS = [
  { number: 1, label: 'Select File', icon: '📎' },
  { number: 2, label: 'Resource Info', icon: '📝' },
  { number: 3, label: 'Classification', icon: '🗂️' },
  { number: 4, label: 'Review', icon: '👁️' },
  { number: 5, label: 'Submit', icon: '🚀' },
];

interface FormData {
  file: File | null;
  title: string;
  description: string;
  category: ResourceCategory | '';
  tags: string;
  branchId: string;
  semesterId: string;
  subjectId: string;
  unitNumber: string;
}

export default function UploadPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [dragOver, setDragOver] = useState(false);
  const [form, setForm] = useState<FormData>({
    file: null,
    title: '',
    description: '',
    category: 'NOTES',
    tags: '',
    branchId: BRANCHES[0]._id,
    semesterId: SEMESTERS[2]._id,
    subjectId: SUBJECTS[0]._id,
    unitNumber: '1',
  });
  const [createdResource, setCreatedResource] = useState<Resource | null>(null);

  const filteredSubjects = SUBJECTS.filter(
    (s) =>
      (!form.branchId || s.branchId === form.branchId) &&
      (!form.semesterId || s.semesterId === form.semesterId)
  );

  const selectedSubject = SUBJECTS.find((s) => s._id === form.subjectId);

  const update = (field: keyof FormData, value: string | File | null) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      update('file', file);
      if (!form.title) {
        update('title', file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
      }
      showToast(`Selected file: ${file.name}`, 'info');
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      update('file', file);
      if (!form.title) {
        update('title', file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
      }
      showToast(`Selected file: ${file.name}`, 'info');
    }
  };

  const canNext = () => {
    if (step === 1) return !!form.file;
    if (step === 2) return !!form.title && !!form.description && !!form.category;
    if (step === 3) return !!form.branchId && !!form.semesterId && !!form.subjectId;
    return true;
  };

  const handleSubmit = () => {
    if (!user) {
      showToast('Please sign in before publishing notes', 'error');
      return;
    }

    const tagList = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newRes = dataStore.addResource({
      title: form.title,
      description: form.description,
      category: (form.category as ResourceCategory) || 'NOTES',
      branchId: form.branchId,
      semesterId: form.semesterId,
      subjectId: form.subjectId,
      unitNumber: form.unitNumber ? Number(form.unitNumber) : 1,
      tags: tagList.length > 0 ? tagList : ['tcet', 'notes'],
      fileName: form.file?.name || `${form.title}.pdf`,
      fileSize: form.file?.size || 1024 * 1024 * 2,
      user,
    });

    setCreatedResource(newRes);
    showToast('Resource uploaded and published! (+10 XP) 🎉', 'success');
    setStep(5);
  };

  if (step === 5 && createdResource) {
    return (
      <div className="pt-20 pb-safe min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center p-8 glass-card rounded-3xl animate-scale-in">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30 flex items-center justify-center text-4xl mx-auto mb-6">
            ✅
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Resource Published!</h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-6">
            Your notes &quot;<strong className="text-white">{createdResource.title}</strong>&quot; are now available to all TCET students.
          </p>

          <div className="glass rounded-2xl p-4 text-left mb-6 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Category</span>
              <span className="text-white">{createdResource.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Subject</span>
              <span className="text-indigo-300">{createdResource.subject?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Contributor Reward</span>
              <span className="text-emerald-400 font-bold">+10 XP Earned</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href={`/resources/${createdResource._id}`}
              className="btn-secondary flex-1 justify-center text-xs py-2.5"
            >
              View Document
            </Link>
            <Link
              href="/dashboard"
              className="btn-primary flex-1 justify-center text-xs py-2.5"
            >
              My Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-safe">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Upload Resource</h1>
          <p className="text-[var(--text-secondary)] text-sm">
            Share your knowledge with fellow TCET students and earn contributor reputation
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="flex items-center justify-between mb-10">
          {STEPS.slice(0, 4).map((s, i) => (
            <div key={s.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => s.number < step && setStep(s.number)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-semibold text-sm transition-all ${
                    s.number === step
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]'
                      : s.number < step
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 cursor-pointer hover:bg-emerald-500/30'
                      : 'bg-white/5 border border-white/10 text-[var(--text-muted)]'
                  }`}
                >
                  {s.number < step ? '✓' : s.icon}
                </button>
                <span
                  className={`text-[10px] mt-1.5 font-medium hidden sm:block text-center ${
                    s.number === step
                      ? 'text-indigo-300'
                      : s.number < step
                      ? 'text-emerald-400'
                      : 'text-[var(--text-muted)]'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < 3 && (
                <div
                  className={`flex-1 h-0.5 mx-2 rounded-full transition-all ${
                    s.number < step
                      ? 'bg-gradient-to-r from-emerald-500 to-indigo-500'
                      : 'bg-white/10'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Form Box */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 animate-fade-in">
          {/* STEP 1: File Upload */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Select Your File</h2>
              <p className="text-xs text-[var(--text-muted)] mb-6">
                Supported formats: PDF, DOCX, PPTX, Images, ZIP up to 50MB
              </p>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                  dragOver
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : form.file
                    ? 'border-emerald-500/50 bg-emerald-500/5'
                    : 'border-white/15 hover:border-indigo-500/50 hover:bg-indigo-500/5'
                }`}
              >
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.zip"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileInput}
                />
                {form.file ? (
                  <>
                    <div className="text-5xl mb-3">📄</div>
                    <p className="font-semibold text-white text-lg">{form.file.name}</p>
                    <p className="text-[var(--text-muted)] text-xs mt-1">
                      {(form.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <p className="text-emerald-400 text-xs mt-3 font-semibold">
                      ✓ File selected and verified
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-5xl mb-4">☁️</div>
                    <p className="text-base sm:text-lg font-semibold text-white mb-1">
                      Drag & Drop your document here
                    </p>
                    <p className="text-[var(--text-muted)] text-xs mb-4">or click to browse from device</p>
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {['PDF', 'DOCX', 'PPTX', 'IMG', 'ZIP'].map((ext) => (
                        <span
                          key={ext}
                          className="badge bg-white/5 text-[var(--text-secondary)] border-white/10 text-[10px]"
                        >
                          {ext}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Resource Metadata */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-white mb-4">Resource Details</h2>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
                  Resource Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                  placeholder="e.g. Data Structures Unit 3 Sorting & Searching Notes"
                  className="input-field"
                  maxLength={150}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  placeholder="Provide an overview of topics, formulas, or derivations included..."
                  className="input-field resize-none h-24 text-xs"
                  maxLength={500}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                  Resource Category <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => update('category', key)}
                      className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        form.category === key
                          ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                          : 'border-white/10 hover:border-indigo-500/40 text-[var(--text-secondary)] hover:bg-white/5'
                      }`}
                    >
                      <span className="text-lg">{cfg.emoji}</span>
                      <span className="text-[10px] font-medium">{cfg.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => update('tags', e.target.value)}
                  placeholder="e.g. sorting, quicksort, mergesort, dsa"
                  className="input-field"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Academic Classification */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-white mb-4">Academic Classification</h2>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
                  TCET Branch <span className="text-red-400">*</span>
                </label>
                <select
                  value={form.branchId}
                  onChange={(e) => {
                    update('branchId', e.target.value);
                  }}
                  className="input-field cursor-pointer text-xs"
                >
                  {BRANCHES.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name} ({b.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
                  Semester <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {SEMESTERS.map((sem) => (
                    <button
                      key={sem._id}
                      type="button"
                      onClick={() => update('semesterId', sem._id)}
                      className={`py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                        form.semesterId === sem._id
                          ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                          : 'bg-white/5 text-[var(--text-secondary)] hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      Sem {sem.number}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
                  Subject <span className="text-red-400">*</span>
                </label>
                {filteredSubjects.length > 0 ? (
                  <select
                    value={form.subjectId}
                    onChange={(e) => update('subjectId', e.target.value)}
                    className="input-field cursor-pointer text-xs"
                  >
                    {filteredSubjects.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    value={form.subjectId}
                    onChange={(e) => update('subjectId', e.target.value)}
                    className="input-field cursor-pointer text-xs"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {selectedSubject && selectedSubject.units.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
                    Syllabus Unit
                  </label>
                  <select
                    value={form.unitNumber}
                    onChange={(e) => update('unitNumber', e.target.value)}
                    className="input-field cursor-pointer text-xs"
                  >
                    {selectedSubject.units.map((u) => (
                      <option key={u.number} value={String(u.number)}>
                        Unit {u.number}: {u.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Review */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-white mb-4">Review Details</h2>

              <div className="glass rounded-2xl p-5 space-y-2.5 text-xs">
                {[
                  { label: 'File Name', value: form.file?.name },
                  { label: 'Title', value: form.title },
                  { label: 'Category', value: CATEGORY_CONFIG[form.category || 'NOTES']?.label },
                  { label: 'Branch', value: BRANCHES.find((b) => b._id === form.branchId)?.name },
                  { label: 'Semester', value: `Semester ${SEMESTERS.find((s) => s._id === form.semesterId)?.number}` },
                  { label: 'Subject', value: SUBJECTS.find((s) => s._id === form.subjectId)?.name },
                  { label: 'Unit', value: form.unitNumber ? `Unit ${form.unitNumber}` : 'General' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-1.5 border-b border-white/06 last:border-0">
                    <span className="text-[var(--text-muted)]">{label}</span>
                    <span className="text-white font-medium">{value}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-center justify-between">
                <span>Earned Contributor Reward:</span>
                <span className="font-bold text-emerald-400">+10 XP</span>
              </div>
            </div>
          )}
        </div>

        {/* Step Navigation Bar */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setStep((v) => v - 1)}
            disabled={step === 1}
            className="btn-ghost disabled:opacity-30 cursor-pointer"
          >
            ← Previous
          </button>
          <span className="text-xs text-[var(--text-muted)]">Step {step} of 4</span>
          {step < 4 ? (
            <button
              onClick={() => setStep((v) => v + 1)}
              disabled={!canNext()}
              className="btn-primary disabled:opacity-40 cursor-pointer"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="btn-primary px-6 cursor-pointer bg-emerald-600 hover:bg-emerald-500"
            >
              🚀 Publish Resource
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
