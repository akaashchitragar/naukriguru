'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Preloader from '@/components/Preloader';

interface PreloaderContextType {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const PreloaderContext = createContext<PreloaderContextType | undefined>(undefined);

export const PreloaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simple function to finish loading
  const finishLoading = () => {
    setIsLoading(false);
  };

  // Just use a simple timer to show the preloader for a fixed time
  useEffect(() => {
    // Safety check for server-side rendering
    if (typeof window === 'undefined') return;

    // Set a minimum time for the preloader to be displayed
    const timer = setTimeout(() => {
      finishLoading();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <PreloaderContext.Provider value={{ isLoading, setIsLoading }}>
      {isLoading ? <Preloader finishLoading={finishLoading} /> : children}
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