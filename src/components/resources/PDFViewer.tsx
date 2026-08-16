'use client';

import React, { useState } from 'react';
import { Resource } from '@/types';
import { useToast } from '@/lib/context/ToastContext';
import { dataStore } from '@/lib/store/dataStore';
import { useAuth } from '@/lib/context/AuthContext';
import { formatFileSize } from '@/lib/utils';

interface PDFViewerProps {
  resource: Resource;
}

export default function PDFViewer({ resource }: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const totalPages = 8;
  const { showToast } = useToast();
  const { user } = useAuth();

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 75));
  const handleResetZoom = () => setZoom(100);

  const handlePrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  const handleDownload = () => {
    dataStore.recordDownload(resource._id, user);

    // Create a mock document download blob
    const content = `TCET CampusNotes - ${resource.title}\nSubject: ${resource.subject?.name} (${resource.subject?.code})\nBranch: ${resource.branch?.name}\nSemester: ${resource.semester?.number}\nUploaded by: ${resource.uploadedBy.name}\n\nDescription:\n${resource.description}\n\nTags: ${resource.tags.join(', ')}\n\n---\nThank you for studying with CampusNotes TCET!`;
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = resource.file.originalName || `${resource.slug}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`Downloaded "${resource.title}" successfully! 📥`, 'success');
  };

  // Sample page content generator for realistic document preview
  const renderPageContent = () => {
    switch (currentPage) {
      case 1:
        return (
          <div className="space-y-6 text-left">
            <div className="border-b border-indigo-500/20 pb-4">
              <div className="flex items-center justify-between text-xs text-indigo-400 font-mono mb-2">
                <span>THAKUR COLLEGE OF ENGINEERING & TECHNOLOGY</span>
                <span>{resource.branch?.code || 'TCET'} · SEM {resource.semester?.number || '3'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">{resource.title}</h2>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Course: {resource.subject?.name} ({resource.subject?.code}) · Unit {resource.unitNumber || 1}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">1.1 Core Overview</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {resource.description}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/08 space-y-2">
              <h4 className="text-xs font-bold text-emerald-400">💡 Key Academic Objectives:</h4>
              <ul className="text-xs text-gray-300 space-y-1.5 list-disc list-inside">
                <li>Understand fundamental theorems and real-world implementations.</li>
                <li>Analyze time and space complexity with Big-O notations.</li>
                <li>Solve Mumbai University & TCET Autonomous past exam questions.</li>
              </ul>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 text-left">
            <h3 className="text-base font-bold text-indigo-300">2.1 Detailed Concepts & Formulations</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              In this module, structural definitions and operations are dissected. Let $T(n)$ represent the recurrence relation for divide-and-conquer partitions:
            </p>
            <div className="p-4 rounded-xl bg-black/40 border border-indigo-500/30 text-center font-mono text-sm text-indigo-300">
              T(n) = 2T(n/2) + O(n) =&gt; O(n log n)
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-white/5 border border-white/06">
                <span className="font-bold text-white block mb-1">Time Complexity</span>
                <span className="text-emerald-400">Best: O(1) · Worst: O(n log n)</span>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/06">
                <span className="font-bold text-white block mb-1">Auxiliary Space</span>
                <span className="text-purple-400">Space: O(h) where h is height</span>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-5 text-left">
            <h3 className="text-base font-bold text-indigo-300">3.1 Visual Architecture Diagram</h3>
            <div className="border border-white/10 rounded-2xl p-6 bg-black/30 flex flex-col items-center justify-center gap-3">
              <div className="flex items-center gap-4">
                <div className="w-16 h-12 rounded-xl bg-indigo-600/30 border border-indigo-400 flex items-center justify-center text-xs text-white font-bold">
                  Node (Root)
                </div>
              </div>
              <div className="w-0.5 h-6 bg-indigo-400" />
              <div className="flex items-center gap-8">
                <div className="w-14 h-10 rounded-lg bg-purple-600/30 border border-purple-400 flex items-center justify-center text-[10px] text-white">
                  Left Child
                </div>
                <div className="w-14 h-10 rounded-lg bg-emerald-600/30 border border-emerald-400 flex items-center justify-center text-[10px] text-white">
                  Right Child
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 text-center italic">
              Figure 1.1: Balanced Tree Partitioning Scheme
            </p>
          </div>
        );
      default:
        return (
          <div className="space-y-4 text-left">
            <h3 className="text-base font-bold text-indigo-300">Section {currentPage}.0 — Advanced Analysis & Questions</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Refer to previous year examinations (2020-2024) for repeated numericals and derivation proofs regarding this topic.
            </p>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/06 space-y-2">
              <p className="text-xs font-semibold text-white">Q{currentPage}: Explain the core differences and trade-offs.</p>
              <p className="text-xs text-gray-400">Answer: Detailed step-by-step breakdown as taught in TCET lectures.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={`glass-card rounded-3xl overflow-hidden flex flex-col transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-[var(--bg-base)]' : ''
      }`}
    >
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-white/08 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <span className="text-lg">📄</span>
          <span className="font-semibold text-white text-xs sm:text-sm truncate max-w-[200px] sm:max-w-xs">
            {resource.file.originalName}
          </span>
          <span className="badge bg-white/5 text-[var(--text-muted)] border-white/10 text-[10px] hidden sm:inline-block">
            {formatFileSize(resource.file.size)}
          </span>
        </div>

        {/* Page & Zoom Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Zoom */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5 text-xs">
            <button
              onClick={handleZoomOut}
              className="px-2 py-1 hover:text-white text-[var(--text-muted)] cursor-pointer"
              title="Zoom Out"
            >
              -
            </button>
            <button
              onClick={handleResetZoom}
              className="px-2 py-1 text-white font-mono text-[11px] hover:text-indigo-300 cursor-pointer"
              title="Reset Zoom"
            >
              {zoom}%
            </button>
            <button
              onClick={handleZoomIn}
              className="px-2 py-1 hover:text-white text-[var(--text-muted)] cursor-pointer"
              title="Zoom In"
            >
              +
            </button>
          </div>

          {/* Pagination */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5 text-xs">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-2.5 py-1 text-[var(--text-muted)] hover:text-white disabled:opacity-30 cursor-pointer"
              title="Previous Page"
            >
              ‹
            </button>
            <span className="px-2 py-1 text-white text-[11px]">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 text-[var(--text-muted)] hover:text-white disabled:opacity-30 cursor-pointer"
              title="Next Page"
            >
              ›
            </button>
          </div>

          {/* Fullscreen */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-[var(--text-muted)] hover:text-white text-xs cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? '↙' : '⛶'}
          </button>

          {/* Download Action */}
          <button
            onClick={handleDownload}
            className="btn-primary text-xs py-1.5 px-3 rounded-lg flex items-center gap-1.5 shadow-none cursor-pointer"
          >
            <span>⬇</span>
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      {/* Document Canvas Area */}
      <div className="flex-1 overflow-auto bg-[#07070a] p-4 sm:p-8 flex items-center justify-center min-h-[460px]">
        <div
          className="w-full max-w-2xl bg-[#12121c] border border-white/10 rounded-2xl p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-transform duration-200"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
        >
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 rotate-[-25deg] select-none text-4xl sm:text-5xl font-black text-white">
            TCET CAMPUSNOTES
          </div>

          {/* Content */}
          <div className="relative z-10">{renderPageContent()}</div>

          {/* Document Footer */}
          <div className="mt-12 pt-4 border-t border-white/06 flex items-center justify-between text-[10px] text-[var(--text-muted)]">
            <span>TCET Academic Resource Portal</span>
            <span>Page {currentPage} of {totalPages}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
