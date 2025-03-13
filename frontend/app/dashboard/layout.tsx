'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Header from '@/components/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import { ToastProvider } from '@/components/Toast';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Determine active tab based on the current path
  const getActiveTab = () => {
    if (pathname?.includes('/profile')) {
      return 'profile';
    }
    return 'analyze';
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-orange"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  const handleTabChange = (tab: 'analyze' | 'profile') => {
    if (tab === 'analyze') {
      router.push('/dashboard');
    } else if (tab === 'profile') {
      router.push('/dashboard/profile');
    }
  };

  return (
    <div className="min-h-screen bg-light-gray">
      <Header 
        user={user} 
        activeTab={getActiveTab()} 
        onTabChange={handleTabChange}
      />
      
      <div className="w-full px-4 py-6 flex">
        <Sidebar />
        <main className="flex-1 ml-4">
          {children}
        </main>
      </div>
    </div>
  );
} 