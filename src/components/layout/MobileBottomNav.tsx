'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user, isLoggedIn } = useAuth();

  // Hide on admin pages
  if (pathname.startsWith('/admin')) return null;

  const mobileNavItems = isLoggedIn && user
    ? [
        { icon: '🏠', label: 'Home', href: '/' },
        { icon: '🔍', label: 'Search', href: '/resources' },
        { icon: '📤', label: 'Upload', href: '/upload', primary: true },
        { icon: '🔖', label: 'Saved', href: '/bookmarks' },
        { icon: '👤', label: 'Profile', href: `/profile/${user._id}` },
      ]
    : [
        { icon: '🏠', label: 'Home', href: '/' },
        { icon: '🔍', label: 'Search', href: '/resources' },
        { icon: '🔑', label: 'Sign In', href: '/login' },
        { icon: '✨', label: 'Sign Up', href: '/register' },
      ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-white/08 shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {mobileNavItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          if ('primary' in item && item.primary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -top-4 w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center shadow-[0_4px_20px_rgba(99,102,241,0.5)] transition-all duration-200 hover:scale-110"
              >
                <span className="text-xl">{item.icon}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px] ${
                isActive
                  ? 'text-indigo-400 font-semibold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-1 h-1 rounded-full bg-indigo-400" />
              )}
            </Link>
          );
        })}
      </div>
      {/* Safe area spacer */}
      <div className="h-safe-bottom bg-transparent" style={{ height: 'env(safe-area-inset-bottom)' }} />
    </nav>
  );
}
