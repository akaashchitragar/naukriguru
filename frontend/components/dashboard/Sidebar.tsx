'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Avatar from '../Avatar';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const dashboardNavItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: 'GridIcon',
    },
    {
      name: 'Resume Analysis',
      href: '/dashboard/analyze',
      icon: 'FileAnalysisIcon',
    },
    {
      name: 'My Resumes',
      href: '/dashboard/resumes',
      icon: 'DocumentIcon',
    },
  ];

  return (
    <div className="w-56 bg-white rounded-lg shadow-md p-3">
      <div className="mb-4 pb-3 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Avatar user={user} size="sm" />
          <div>
            <p className="font-medium text-gray-800 text-sm truncate max-w-[160px]">{user?.displayName || user?.email?.split('@')[0]}</p>
            <p className="text-xs text-gray-500 truncate max-w-[160px]">{user?.email}</p>
          </div>
        </div>
      </div>
      
      <nav className="space-y-1">
        {dashboardNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors text-sm ${
                isActive
                  ? 'bg-deep-blue text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-gray-500'}>
                {item.icon}
              </span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-4 pt-3 border-t border-gray-200">
        <button
          onClick={() => logout()}
          className="flex items-center space-x-2 px-3 py-2 w-full text-left rounded-md text-gray-700 hover:bg-gray-100 transition-colors text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 5a1 1 0 10-2 0v4a1 1 0 102 0V8zm-3 7a1 1 0 100-2H5a1 1 0 100 2h2z" clipRule="evenodd" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
} 