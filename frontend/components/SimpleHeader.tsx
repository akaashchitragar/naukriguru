'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';

const SimpleHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if current page is a legal page
  const isLegalPage = pathname?.includes('/privacy') || pathname?.includes('/terms') || pathname?.includes('/cookies');

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled || isLegalPage
          ? 'bg-white shadow-md' 
          : 'bg-primary-blue bg-opacity-90 backdrop-blur-md'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and site name */}
          <Link href="/" className="flex items-center space-x-2">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
              isScrolled || isLegalPage ? 'bg-primary-blue/10' : 'bg-primary-yellow/20 backdrop-blur-sm'
            }`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={`h-6 w-6 ${
                  isScrolled || isLegalPage ? 'text-primary-blue' : 'text-primary-yellow'
                }`}
              >
                <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
                <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
                <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
              </svg>
            </div>
            <span className={`text-xl font-bold ${
              isScrolled || isLegalPage ? 'text-primary-blue' : 'text-white'
            }`}>
              JobCraft<span className="text-primary-yellow">
                .in
              </span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-10">
            <Link href="/" className={`text-sm font-medium ${
              isScrolled || isLegalPage ? 'text-gray-600 hover:text-primary-blue' : 'text-white hover:text-primary-yellow'
            }`}>
              Home
            </Link>
            <Link href="#features" className={`text-sm font-medium ${
              isScrolled || isLegalPage ? 'text-gray-600 hover:text-primary-blue' : 'text-white hover:text-primary-yellow'
            }`}>
              Features
            </Link>
            <Link href="#pricing" className={`text-sm font-medium ${
              isScrolled || isLegalPage ? 'text-gray-600 hover:text-primary-blue' : 'text-white hover:text-primary-yellow'
            }`}>
              Pricing
            </Link>
            <Link href="/about" className={`text-sm font-medium ${
              isScrolled || isLegalPage ? 'text-gray-600 hover:text-primary-blue' : 'text-white hover:text-primary-yellow'
            }`}>
              About
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            {user ? (
              <Link href="/dashboard" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-blue hover:bg-primary-blue/90 transition">
                Dashboard
              </Link>
            ) : (
              <Link href="/auth/login" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-blue hover:bg-primary-blue/90 transition">
                Get Started
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                isScrolled || isLegalPage
                  ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100' 
                  : 'text-white hover:text-primary-yellow hover:bg-white/10'
              }`}
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg 
                className="h-6 w-6" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SimpleHeader; 