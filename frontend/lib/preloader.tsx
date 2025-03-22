'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Preloader from '@/components/Preloader';

interface PreloaderContextType {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  showPreloaderOnRoute: (routes: string[]) => boolean;
}

const PreloaderContext = createContext<PreloaderContextType | undefined>(undefined);

export const PreloaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  
  // Simple function to finish loading
  const finishLoading = () => {
    setIsLoading(false);
  };

  // Define routes that should show the preloader
  const routesWithPreloader = ['/', '/auth/login', '/auth/signup', '/dashboard'];
  
  // Check if current route should show preloader
  const shouldShowPreloader = routesWithPreloader.some(route => 
    pathname === route || 
    (route === '/dashboard' && pathname?.startsWith('/dashboard/'))
  );

  // Function to check if preloader should be shown on specific routes
  const showPreloaderOnRoute = (routes: string[]) => {
    return routes.some(route => 
      pathname === route || 
      (route.endsWith('/*') && pathname?.startsWith(route.slice(0, -2)))
    );
  };

  // Determine the loading time based on the route
  const getLoadingTime = () => {
    // Dashboard pages need a bit more time to feel smooth
    if (pathname && pathname.startsWith('/dashboard')) {
      return 3000; // 3 seconds for dashboard pages
    }
    
    // Auth pages
    if (pathname === '/auth/login' || pathname === '/auth/signup') {
      return 2500; // 2.5 seconds for authentication pages
    }
    
    // Default loading time for other pages
    return 2000; // 2 seconds
  };

  // Just use a simple timer to show the preloader for a fixed time
  useEffect(() => {
    // Safety check for server-side rendering
    if (typeof window === 'undefined') return;

    // If the current route doesn't need preloader, skip loading state
    if (!shouldShowPreloader) {
      setIsLoading(false);
      return;
    }

    // Set a minimum time for the preloader to be displayed
    const timer = setTimeout(() => {
      finishLoading();
    }, getLoadingTime());

    return () => clearTimeout(timer);
  }, [pathname, shouldShowPreloader]);

  return (
    <PreloaderContext.Provider value={{ isLoading, setIsLoading, showPreloaderOnRoute }}>
      {isLoading && shouldShowPreloader ? <Preloader finishLoading={finishLoading} /> : children}
    </PreloaderContext.Provider>
  );
};

export const usePreloader = () => {
  const context = useContext(PreloaderContext);
  if (context === undefined) {
    throw new Error('usePreloader must be used within a PreloaderProvider');
  }
  return context;
};

// Hook to use preloader selectively on specific pages
export const usePreloaderOnRoute = (routes: string[]) => {
  const { isLoading, showPreloaderOnRoute } = usePreloader();
  const shouldShowPreloader = showPreloaderOnRoute(routes);
  
  return {
    isLoading: isLoading && shouldShowPreloader
  };
}; 