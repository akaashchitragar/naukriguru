'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';

export default function NotFound() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-light-gray px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-24 text-accent-orange mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        
        <h1 className="text-4xl font-bold text-deep-blue mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="space-y-4">
          <Link
            href={user ? '/dashboard' : '/'}
            className="block w-full px-6 py-3 bg-accent-orange text-white rounded-md hover:bg-accent-orange/90 transition-colors"
          >
            {user ? 'Go to Dashboard' : 'Go to Homepage'}
          </Link>
          
          {!user && (
            <Link
              href="/"
              className="block w-full px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
} 