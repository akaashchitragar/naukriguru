'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Header from '@/components/Header';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isInitialized } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Determine active tab based on the current path
  const getActiveTab = () => {
    if (pathname?.includes('/profile')) {
      return 'profile';
    }
    return 'analyze';
  };

  // Redirect to home if not authenticated
  useEffect(() => {
    if (isInitialized && !user) {
      router.push('/');
    }
  }, [user, isInitialized, router]);

  // Show loading state while auth is initializing
  if (!isInitialized || loading) {
    return (
      <LoadingSpinner 
        size="large" 
        message="Loading dashboard..." 
        fullScreen={true} 
      />
    );
  }

  // If auth is initialized but no user, return null (will redirect in useEffect)
  if (!user) {
    return null;
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
      
      <div className="container mx-auto px-4 py-6">
        <main>
          {children}
        </main>
      </div>
    </div>
  );
} 