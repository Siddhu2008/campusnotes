'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { dataStore } from '@/lib/store/dataStore';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [openReports, setOpenReports] = useState(0);
  const [pendingResources, setPendingResources] = useState(0);

  useEffect(() => {
    const update = () => {
      const reports = dataStore.getReports().filter((r) => r.status === 'OPEN').length;
      const pending = dataStore
        .getState()
        .resources.filter((r) => r.status === 'PENDING_REVIEW').length;
      setOpenReports(reports);
      setPendingResources(pending);
    };
    update();
    const unsub = dataStore.subscribe(update);
    return () => { unsub(); };
  }, []);

  const adminNav = [
    { label: 'Overview', href: '/admin', icon: '📊', badge: null },
    {
      label: 'Resource Moderation',
      href: '/admin/resources',
      icon: '📁',
      badge: pendingResources > 0 ? String(pendingResources) : null,
    },
    {
      label: 'Report Queue',
      href: '/admin/reports',
      icon: '⚠️',
      badge: openReports > 0 ? String(openReports) : null,
    },
    { label: 'User Directory', href: '/admin/users', icon: '👥', badge: null },
    { label: 'Academic Curriculum', href: '/subjects', icon: '🎓', badge: null },
  ];

  return (
    <aside className="w-full lg:w-64 glass-card rounded-3xl p-5 lg:min-h-[calc(100vh-8rem)] flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        {/* Admin Header */}
        <div className="flex items-center gap-3 px-2 pb-4 border-b border-white/06">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-lg shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            🛡️
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">Admin Console</h2>
            <p className="text-[10px] text-purple-300 font-medium">TCET CampusNotes</p>
          </div>
        </div>

        {/* Links */}
        <nav className="space-y-1.5">
          {adminNav.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-white border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                    : 'text-[var(--text-secondary)] hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Return to Student Portal */}
      <div className="pt-6 border-t border-white/06 mt-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[var(--text-muted)] hover:text-white hover:bg-white/5 transition-all"
        >
          <span>←</span>
          <span>Back to Student Portal</span>
        </Link>
      </div>
    </aside>
  );
}
