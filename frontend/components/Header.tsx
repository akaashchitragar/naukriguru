'use client';

import React, { useState, useEffect, useRef } from 'react';
import { User } from 'firebase/auth';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { usePathname } from 'next/navigation';
import Avatar from './Avatar';

interface HeaderProps {
  user: User | null;
  activeTab: 'analyze' | 'profile';
  onTabChange: (tab: 'analyze' | 'profile') => void;
  onLoginClick?: () => void;
}

// Define an interface for the navigation items
interface NavItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
}

export default function Header({ user, activeTab, onTabChange, onLoginClick }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { logout } = useAuth();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Add click-away listener to close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      // The redirect will be handled by the auth context
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Navigation items for the dashboard
  const navItems: NavItem[] = user
    ? [
        {
          name: 'Dashboard',
          href: '/dashboard',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          ),
        },
        {
          name: 'Resume Analysis',
          href: '/dashboard/analyze',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          ),
        },
        {
          name: 'History',
          href: '/dashboard/history',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          ),
        },
        {
          name: 'Manage Resumes',
          href: '/dashboard/resumes',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
              <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            </svg>
          ),
        },
      ]
    : [
        {
          name: 'Home',
          href: '/',
        },
        {
          name: 'Pricing',
          href: '/pricing',
        },
        {
          name: 'Docs',
          href: '/docs',
        },
      ];

  return (
    <motion.header 
      className={`sticky top-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-primary-blue/90 backdrop-blur-xl shadow-lg border-b border-white/10' 
          : 'bg-primary-blue'
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Enhanced Logo section */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <motion.div 
                  className="absolute -inset-1 bg-gradient-to-r from-primary-yellow via-light-blue to-primary-yellow opacity-30 rounded-lg blur-sm group-hover:opacity-50 transition duration-300"
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    duration: 10, 
                    repeat: Infinity,
                    ease: "linear" 
                  }}
                />
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  className="w-8 h-8 text-primary-yellow relative"
                >
                  <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
                  <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
                  <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-pure-white group-hover:text-white transition-colors">
                Job<span className="text-primary-yellow group-hover:text-light-yellow transition-colors">Craft.in</span>
              </h1>
            </Link>
          </motion.div>
          
          {user ? (
            <div className="hidden md:flex items-center space-x-6">
              {/* Enhanced Navigation links with animations */}
              <nav className="flex items-center space-x-1">
                {navItems.slice(0, 4).map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      className={`group px-4 py-2 rounded-md transition-all flex items-center space-x-2 ${
                        pathname === item.href
                          ? 'bg-gradient-to-r from-primary-yellow to-dark-yellow text-primary-blue font-medium shadow-lg'
                          : 'text-pure-white hover:bg-white/10 hover:shadow-md'
                      }`}
                    >
                      <span className={`hidden lg:block transition-transform group-hover:scale-110 ${
                        pathname === item.href ? 'text-primary-blue' : 'text-pure-white'
                      }`}>
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>
              
              {/* Enhanced User profile dropdown */}
              <div className="relative" ref={userMenuRef}>
                <motion.button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all duration-300 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative">
                    <motion.div 
                      className="absolute -inset-1 bg-gradient-to-r from-primary-yellow via-light-blue to-primary-yellow opacity-30 rounded-full blur-sm group-hover:opacity-50 transition duration-300"
                    />
                    <Avatar user={user} size="sm" className="shadow-lg relative" />
                  </div>
                  <span className="text-sm font-medium text-pure-white group-hover:text-primary-yellow transition-colors">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-pure-white group-hover:text-primary-yellow transition-colors"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    animate={{ rotate: showUserMenu ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </motion.svg>
                </motion.button>
                
                {/* Enhanced Dropdown menu with animation */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div 
                      className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl ring-1 ring-black/5 focus:outline-none z-50 overflow-hidden backdrop-blur-xl bg-white/95 border border-white/20"
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      transition={{ duration: 0.2, type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <div className="pt-2">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">{user.displayName || 'User'}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <div className="py-1">
                          <Link
                            href="/dashboard/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-blue transition-colors flex items-center space-x-2 group"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <motion.svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-4 w-4 group-hover:text-primary-blue transition-colors" 
                              viewBox="0 0 20 20" 
                              fill="currentColor"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </motion.svg>
                            <span>Profile</span>
                          </Link>
                        </div>
                        <div className="py-1 border-t border-gray-100">
                          <button
                            onClick={() => {
                              setShowUserMenu(false);
                              setShowLogoutConfirm(true);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2 group"
                          >
                            <motion.svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-4 w-4 group-hover:text-red-700 transition-colors" 
                              viewBox="0 0 20 20" 
                              fill="currentColor"
                              whileHover={{ scale: 1.1, rotate: -5 }}
                            >
                              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 5a1 1 0 10-2 0v6a1 1 0 102 0V8zm5 4a1 1 0 10-2 0v2a1 1 0 102 0v-2z" clipRule="evenodd" />
                            </motion.svg>
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <motion.button
                onClick={onLoginClick}
                className="group relative overflow-hidden bg-gradient-to-r from-primary-yellow to-dark-yellow hover:to-primary-yellow text-primary-blue px-6 py-2 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.span className="relative z-10 flex items-center justify-center gap-2">
                  Login
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </motion.span>
                <motion.div
                  className="absolute inset-0 -z-10 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.8 }}
                />
              </motion.button>
              <motion.a
                href="/auth/signup"
                className="group relative overflow-hidden text-pure-white hover:text-primary-yellow transition-colors px-4 py-2 rounded-xl border-2 border-white/20 hover:border-primary-yellow/30 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <motion.span className="relative z-10 flex items-center justify-center gap-2">
                  Sign Up
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                </motion.span>
              </motion.a>
            </div>
          )}

          {/* Enhanced Mobile menu button */}
          <motion.div 
            className="md:hidden flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-white hover:bg-white/10 focus:outline-none transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                animate={{ rotate: showMobileMenu ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={showMobileMenu ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </motion.svg>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Mobile menu with animation */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div 
            className="md:hidden bg-white/95 backdrop-blur-xl shadow-xl rounded-b-2xl overflow-hidden border-t border-white/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 400, damping: 40 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {user ? (
                <>
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <motion.div 
                          className="absolute -inset-1 bg-gradient-to-r from-primary-yellow via-light-blue to-primary-yellow opacity-30 rounded-full blur-sm"
                          animate={{ 
                            rotate: [0, 360],
                            scale: [1, 1.1, 1],
                          }}
                          transition={{ 
                            duration: 10, 
                            repeat: Infinity,
                            ease: "linear" 
                          }}
                        />
                        <Avatar user={user} size="md" className="relative" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{user.displayName || user.email?.split('@')[0]}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  {navItems.map((item, index) => {
                    const isActive = pathname === item.href;
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          className={`${
                            isActive 
                              ? 'bg-gradient-to-r from-primary-blue to-secondary-blue text-white shadow-md' 
                              : 'text-gray-700 hover:bg-gray-50'
                          } block px-3 py-2 rounded-xl text-base font-medium flex items-center space-x-3 transition-all`}
                          onClick={() => setShowMobileMenu(false)}
                        >
                          <span className={isActive ? 'text-white' : 'text-gray-400'}>
                            {item.icon}
                          </span>
                          <span>{item.name}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navItems.length * 0.1 }}
                  >
                    <Link
                      href="/dashboard/profile"
                      className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-xl flex items-center space-x-3 transition-all"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <span>Profile</span>
                    </Link>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navItems.length + 1) * 0.1 }}
                  >
                    <button
                      onClick={() => {
                        setShowMobileMenu(false);
                        setShowLogoutConfirm(true);
                      }}
                      className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl flex items-center space-x-3 transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 5a1 1 0 10-2 0v6a1 1 0 102 0V8zm5 4a1 1 0 10-2 0v2a1 1 0 102 0v-2z" clipRule="evenodd" />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </motion.div>
                </>
              ) : (
                <div className="space-y-2 p-2">
                  <motion.button
                    onClick={() => {
                      setShowMobileMenu(false);
                      onLoginClick && onLoginClick();
                    }}
                    className="w-full text-center px-3 py-2 text-base font-medium bg-gradient-to-r from-primary-yellow to-dark-yellow text-primary-blue rounded-xl shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Login
                  </motion.button>
                  <motion.a
                    href="/auth/signup"
                    className="block w-full text-center px-3 py-2 text-base font-medium text-primary-blue border border-primary-blue rounded-xl hover:bg-primary-blue/5 transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign Up
                  </motion.a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Enhanced Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div 
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full m-4 p-6 border border-white/20"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-4">
                <motion.div 
                  className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </motion.div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Sign Out Confirmation</h3>
                <p className="text-sm text-gray-500">Are you sure you want to sign out of your account? You will need to sign in again to access your dashboard.</p>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <motion.button
                  className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  onClick={() => setShowLogoutConfirm(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    handleLogout();
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign Out
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
} 