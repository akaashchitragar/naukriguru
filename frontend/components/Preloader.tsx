'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface PreloaderProps {
  finishLoading: () => void;
}

const Preloader = ({ finishLoading }: PreloaderProps) => {
  const [counter, setCounter] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  
  // Messages specific to homepage
  const loadingMessages = [
    'Welcome to NaukriGuru...',
    'Preparing your job search experience...',
    'Getting our AI ready...',
    'Setting up resume tools...',
    'Almost ready to help you land your dream job!'
  ];

  useEffect(() => {
    // Make sure this effect runs only in the browser
    if (typeof window === 'undefined') return;
    
    const timer = setInterval(() => {
      setCounter(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          // Start fade out animation before finishing loading
          setFadeOut(true);
          // Add a longer delay to ensure smooth transition
          setTimeout(() => finishLoading(), 1000);
          return 100;
        }
        return prev + 1;
      });
    }, 20);

    return () => clearInterval(timer);
  }, [finishLoading]);

  // Get the appropriate message based on loading progress
  const getCurrentMessage = () => {
    const index = Math.min(Math.floor(counter / 20), loadingMessages.length - 1);
    return loadingMessages[index];
  };

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      {/* Logo or brand element */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-deep-blue">
          Naukri<span className="text-accent-orange">Guru</span>
        </h1>
      </div>
      
      <div className="relative h-32 w-32">
        <svg 
          className="preloader-spin"
          viewBox="0 0 100 100" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle 
            cx="50" 
            cy="50" 
            r="45"
            fill="none"
            stroke="#e0e0e0"
            strokeWidth="8"
          />
          
          <circle 
            cx="50" 
            cy="50" 
            r="45"
            fill="none"
            stroke="#ff9f43" // Using accent-orange color
            strokeWidth="8"
            strokeDasharray="283"
            strokeDashoffset={283 - (283 * counter) / 100}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-800 dark:text-white">
            {counter}%
          </span>
        </div>
      </div>
      
      <div className="mt-6 text-center max-w-md px-4">
        <p className="mt-2 text-gray-600 dark:text-gray-300 min-h-[1.5rem] transition-all duration-300">
          {getCurrentMessage()}
        </p>
        
        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          AI-powered resume analysis for your job search
        </div>
      </div>
    </div>
  );
};

export default Preloader; 