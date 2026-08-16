import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/06 mt-24">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">CN</span>
              </div>
              <span className="font-bold text-lg text-white">
                Campus<span className="gradient-text">Notes</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">
              The academic resource hub for TCET students. Share, discover, and excel together.
            </p>
            <div className="flex items-center gap-2">
              <span className="badge bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[11px]">
                🟢 Beta
              </span>
              <span className="text-xs text-[var(--text-muted)]">TCET — Mumbai</span>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Browse Resources', href: '/resources' },
                { label: 'Upload Notes', href: '/upload' },
                { label: 'Leaderboard', href: '/leaderboard' },
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Bookmarks', href: '/bookmarks' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Subjects */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Popular Subjects</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Data Structures', href: '/resources?subject=sub_ds' },
                { label: 'DBMS', href: '/resources?subject=sub_dbms' },
                { label: 'Operating Systems', href: '/resources?subject=sub_os' },
                { label: 'Computer Networks', href: '/resources?subject=sub_cn' },
                { label: 'Machine Learning', href: '/resources?subject=sub_ml' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Community</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Guidelines', href: '#' },
                { label: 'Privacy Policy', href: '#' },
                { label: 'Terms of Use', href: '#' },
                { label: 'Report Issue', href: '#' },
                { label: 'Contact', href: '#' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/06 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-muted)]">
            © {currentYear} CampusNotes · Built for TCET students 🎓
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Upload only material you have the right to share.
          </p>
        </div>
      </div>
    </footer>
  );
}
