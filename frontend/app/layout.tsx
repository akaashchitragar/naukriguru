import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/auth';
import { ToastProvider } from '@/components/Toast';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PreloaderProvider } from '@/lib/preloader';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'JobCraft.in - AI Resume Analysis',
  description: 'AI-powered resume analysis for job seekers',
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-icon',
    shortcut: '/favicon.svg',
  },
  manifest: '/manifest',
  themeColor: '#0F172A',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary fallback={<div className="p-8 text-center">Something went wrong. Please refresh the page.</div>}>
          <AuthProvider>
            <ToastProvider>
              <PreloaderProvider>
                <main className="min-h-screen bg-off-white">
                  {children}
                </main>
              </PreloaderProvider>
            </ToastProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
} 