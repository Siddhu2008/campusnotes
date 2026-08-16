'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { MOCK_NOTIFICATIONS } from '@/lib/data/mock';

const navLinks = [
  { label: 'Resources', href: '/resources' },
  { label: 'Subjects', href: '/subjects' },
  { label: 'Leaderboard', href: '/leaderboard' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, isLoggedIn, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const handleSignOut = () => {
    setUserMenuOpen(false);
    logout();
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass-strong shadow-[0_1px_0_rgba(255,255,255,0.06)]'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              <span className="text-white font-bold text-sm">CN</span>
            </div>
            <span className="font-bold text-lg text-white hidden sm:block">
              Campus<span className="gradient-text">Notes</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname.startsWith(link.href)
                    ? 'text-white bg-white/10'
                    : 'text-[var(--text-secondary)] hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <Link
              href="/resources"
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[var(--text-muted)] text-sm hover:border-indigo-500/40 hover:text-white transition-all duration-200 min-w-[200px]"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden lg:block">Search resources...</span>
              <span className="lg:hidden">Search</span>
            </Link>

            {isLoggedIn && user ? (
              <>
                {/* Upload Button */}
                <Link
                  href="/upload"
                  className="btn-secondary hidden sm:inline-flex text-xs py-2 px-3"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload
                </Link>

                {/* Notifications */}
                <Link
                  href="/notifications"
                  className="relative p-2 rounded-lg text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* User Avatar / Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/5 transition-all duration-200"
                    aria-label="User menu"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-8 h-8 rounded-lg border border-indigo-500/30 object-cover"
                    />
                    <svg className="w-4 h-4 text-[var(--text-muted)] hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 glass-strong rounded-xl border border-white/10 shadow-[var(--shadow-elevated)] overflow-hidden animate-scale-in z-50">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-white/08">
                        <p className="text-sm font-semibold text-white">{user.name}</p>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">{user.email}</p>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span className="badge bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-[10px]">
                            ⭐ {user.level}
                          </span>
                          <span className="text-xs text-[var(--text-muted)]">{user.points} XP</span>
                        </div>
                      </div>

                      {/* Menu Items */}
                      {[
                        { icon: '👤', label: 'My Profile', href: `/profile/${user._id}` },
                        { icon: '📊', label: 'Dashboard', href: '/dashboard' },
                        { icon: '🔖', label: 'Bookmarks', href: '/bookmarks' },
                        { icon: '📤', label: 'My Uploads', href: `/profile/${user._id}?tab=uploads` },
                      ].map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-all duration-150"
                        >
                          <span>{item.icon}</span>
                          {item.label}
                        </Link>
                      ))}

                      <div className="border-t border-white/08">
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-purple-400 hover:bg-purple-500/10 transition-all duration-150"
                        >
                          <span>⚙️</span>
                          Admin Panel
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-all duration-150 cursor-pointer text-left"
                        >
                          <span>🚪</span>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Logged Out Buttons */
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="btn-ghost text-xs py-2 px-3.5"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="btn-primary text-xs py-2 px-3.5 shadow-none"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-all duration-200"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-strong border-t border-white/06 animate-fade-in-up">
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname.startsWith(link.href)
                      ? 'text-white bg-indigo-500/20'
                      : 'text-[var(--text-secondary)] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {isLoggedIn ? (
                <>
                  <Link
                    href="/upload"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-indigo-400 hover:bg-indigo-500/10 transition-all duration-200"
                  >
                    📤 Upload Resource
                  </Link>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-all duration-200"
                  >
                    📊 Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full text-left cursor-pointer"
                  >
                    🚪 Sign Out
                  </button>
                </>
              ) : (
                <div className="pt-2 border-t border-white/06 flex flex-col gap-2">
                  <Link
                    href="/login"
                    className="btn-ghost justify-center py-2.5 text-sm"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="btn-primary justify-center py-2.5 text-sm"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Backdrop for dropdown */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </>
  );
}
