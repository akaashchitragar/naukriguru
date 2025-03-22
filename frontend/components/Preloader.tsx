'use client';

import { useEffect, useState } from 'react';

interface PreloaderProps {
  finishLoading: () => void;
}

const Preloader = ({ finishLoading }: PreloaderProps) => {
  const [counter, setCounter] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

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

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-gray-900 transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
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
            stroke="#3b82f6"
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
      
      <div className="mt-6 text-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">JobCraft.in</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          {counter < 25 ? 'Initializing dashboard...' : 
           counter < 50 ? 'Loading your resume data...' : 
           counter < 75 ? 'Preparing workspace...' : 
           counter < 95 ? 'Almost ready...' :
           'Ready to launch!'}
        </p>
      </div>
    </div>
  );
};

export default Preloader; 