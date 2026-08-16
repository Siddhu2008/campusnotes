import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    default: 'CampusNotes — Student Academic Resource Sharing Platform',
    template: '%s | CampusNotes',
  },
  description: 'Upload, discover, and download academic notes, question papers, assignments, and study materials for TCET students. Organized by branch, semester, and subject.',
  keywords: ['TCET', 'student notes', 'academic resources', 'notes sharing', 'question papers', 'study material', 'Mumbai engineering college'],
  authors: [{ name: 'CampusNotes' }],
  openGraph: {
    type: 'website',
    siteName: 'CampusNotes',
    title: 'CampusNotes — Student Academic Resource Sharing Platform',
    description: 'Your go-to platform for TCET academic resources.',
  },
};

import { AuthProvider } from '@/lib/context/AuthContext';
import { ToastProvider } from '@/lib/context/ToastContext';
import { DeploymentWatcher } from '@/components/DeploymentWatcher';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <DeploymentWatcher />
        <ToastProvider>
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <MobileBottomNav />
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
