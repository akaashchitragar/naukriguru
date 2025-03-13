'use client';

import React from 'react';
import { User } from 'firebase/auth';

interface HeaderProps {
  user: User | null;
  activeTab: 'analyze' | 'profile';
  onTabChange: (tab: 'analyze' | 'profile') => void;
}

export default function Header({ user, activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-indigo-700">Naukri Guru</h1>
          </div>
          
          {user && (
            <nav className="flex space-x-4">
              <button
                onClick={() => onTabChange('analyze')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'analyze'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Analyze Resume
              </button>
              <button
                onClick={() => onTabChange('profile')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                My Profile
              </button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
} 