'use client';

import React from 'react';

interface ErrorFallbackProps {
  message?: string;
  secondaryMessage?: string;
  onRetry?: () => void;
  isLoading?: boolean;
  actions?: React.ReactNode;
}

export function ErrorFallback({ 
  message = 'Something went wrong. Please try again.', 
  secondaryMessage,
  onRetry, 
  isLoading = false,
  actions
}: ErrorFallbackProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 text-center">
      <div className="flex flex-col items-center justify-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-12 w-12 text-red-500 mb-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <p className="text-gray-700 mb-2">{message}</p>
        {secondaryMessage && (
          <p className="text-gray-500 text-sm mb-4">{secondaryMessage}</p>
        )}
        <div className="flex flex-col space-y-2">
          {onRetry && (
            <button 
              onClick={onRetry}
              disabled={isLoading}
              className={`
                px-4 py-2 rounded-md text-white transition-colors
                ${isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-accent-orange hover:bg-accent-orange/90'}
              `}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg 
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Loading...
                </span>
              ) : (
                'Try Again'
              )}
            </button>
          )}
          {actions}
        </div>
      </div>
    </div>
  );
} 