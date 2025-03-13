'use client';

import React, { useState } from 'react';
import { User } from 'firebase/auth';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';

interface HeaderProps {
  user: User | null;
  activeTab: 'analyze' | 'profile';
  onTabChange: (tab: 'analyze' | 'profile') => void;
  onLoginClick?: () => void;
}

export default function Header({ user, activeTab, onTabChange, onLoginClick }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // The redirect will be handled by the auth context
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-deep-blue text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-8 h-8 text-accent-orange"
              >
                <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
                <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
                <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
              </svg>
              <h1 className="text-2xl font-bold">JobCraft.in</h1>
            </Link>
          </div>
          
          {user ? (
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button 
                className="md:hidden text-white focus:outline-none"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
              
              {/* Desktop navigation */}
              <nav className="hidden md:flex space-x-2">
                <Link 
                  href="/dashboard" 
                  className={`px-4 py-2 rounded-md transition-all duration-300 ${
                    activeTab === 'analyze'
                      ? 'bg-accent-orange text-white font-medium shadow-md'
                      : 'text-white hover:bg-soft-purple/30'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/dashboard/analyze" 
                  className="px-4 py-2 rounded-md transition-all duration-300 text-white hover:bg-soft-purple/30"
                >
                  Analyze
                </Link>
                <Link 
                  href="/dashboard/history" 
                  className="px-4 py-2 rounded-md transition-all duration-300 text-white hover:bg-soft-purple/30"
                >
                  History
                </Link>
                <Link 
                  href="/dashboard/profile" 
                  className={`px-4 py-2 rounded-md transition-all duration-300 ${
                    activeTab === 'profile'
                      ? 'bg-accent-orange text-white font-medium shadow-md'
                      : 'text-white hover:bg-soft-purple/30'
                  }`}
                >
                  Profile
                </Link>
              </nav>
              
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 rounded-full px-3 py-1.5 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-accent-orange flex items-center justify-center text-white font-medium">
                    {user?.displayName ? user.displayName[0].toUpperCase() : user?.email?.[0].toUpperCase() || 'U'}
                  </div>
                  <span className="hidden md:inline text-sm font-medium truncate max-w-[100px]">
                    {user?.displayName || user?.email?.split('@')[0] || 'User'}
                  </span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 text-gray-800">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium">{user?.displayName || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <Link href="/dashboard/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">
                      Profile Settings
                    </Link>
                    <Link href="/dashboard/settings" className="block px-4 py-2 text-sm hover:bg-gray-100">
                      Account Settings
                    </Link>
                    <Link href="/dashboard/subscription" className="block px-4 py-2 text-sm hover:bg-gray-100">
                      Subscription
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 border-t border-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-6 mr-8">
                <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
                  Features
                </Link>
                <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors">
                  Pricing
                </Link>
                <Link href="#testimonials" className="text-gray-300 hover:text-white transition-colors">
                  Testimonials
                </Link>
              </nav>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLoginClick}
                className="px-5 py-2 rounded-md bg-accent-orange text-white font-medium shadow-md transition-all hover:bg-accent-orange/90"
              >
                Sign In
              </motion.button>
              <Link href="/auth/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2 rounded-md border border-white/30 bg-white/10 text-white font-medium backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  Sign Up
                </motion.button>
              </Link>
            </div>
          )}
        </div>
        
        {/* Mobile menu */}
        {user && showMobileMenu && (
          <div className="md:hidden mt-4 pb-3 border-t border-white/20 pt-3">
            <nav className="flex flex-col space-y-2">
              <Link 
                href="/dashboard" 
                className={`px-4 py-2 rounded-md transition-all duration-300 ${
                  activeTab === 'analyze'
                    ? 'bg-accent-orange text-white font-medium shadow-md'
                    : 'text-white hover:bg-soft-purple/30'
                }`}
                onClick={() => setShowMobileMenu(false)}
              >
                Dashboard
              </Link>
              <Link 
                href="/dashboard/analyze" 
                className="px-4 py-2 rounded-md transition-all duration-300 text-white hover:bg-soft-purple/30"
                onClick={() => setShowMobileMenu(false)}
              >
                Analyze
              </Link>
              <Link 
                href="/dashboard/history" 
                className="px-4 py-2 rounded-md transition-all duration-300 text-white hover:bg-soft-purple/30"
                onClick={() => setShowMobileMenu(false)}
              >
                History
              </Link>
              <Link 
                href="/dashboard/profile" 
                className={`px-4 py-2 rounded-md transition-all duration-300 ${
                  activeTab === 'profile'
                    ? 'bg-accent-orange text-white font-medium shadow-md'
                    : 'text-white hover:bg-soft-purple/30'
                }`}
                onClick={() => setShowMobileMenu(false)}
              >
                Profile
              </Link>
              <Link 
                href="/dashboard/settings" 
                className="px-4 py-2 rounded-md transition-all duration-300 text-white hover:bg-soft-purple/30"
                onClick={() => setShowMobileMenu(false)}
              >
                Settings
              </Link>
              <button 
                onClick={() => {
                  handleLogout();
                  setShowMobileMenu(false);
                }}
                className="px-4 py-2 rounded-md transition-all duration-300 text-white bg-red-500/20 hover:bg-red-500/30 text-left"
              >
                Sign Out
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 