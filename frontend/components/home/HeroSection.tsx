'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  onLoginClick?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onLoginClick }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-deep-blue via-[#1a3a5f] to-[#0d1b2a] py-20 md:py-28">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-accent-orange blur-3xl"></div>
        <div className="absolute top-1/2 right-0 h-80 w-80 rounded-full bg-soft-purple blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#4cc9f0] blur-3xl"></div>
      </div>

      <div className="container relative mx-auto px-4 md:px-6">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Left column - Text content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center md:text-left"
          >
            <div className="mb-6 inline-flex items-center rounded-full border border-accent-orange/30 bg-accent-orange/10 px-3 py-1 text-sm text-accent-orange">
              <span className="mr-2 h-2 w-2 rounded-full bg-accent-orange"></span>
              AI-Powered Resume Analysis
            </div>
            <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              Your <span className="text-accent-orange">AI Career Companion</span> for the Indian Job Market
            </h1>
            <p className="mb-8 text-lg text-gray-300 md:pr-8">
              Naukri Guru revolutionizes your job search with smart, localized resume optimization and job matching services built specifically for the Indian market.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 md:justify-start">
              <Link 
                href="/auth/signup" 
                className="rounded-lg bg-accent-orange px-6 py-3 text-center font-medium text-white shadow-lg shadow-accent-orange/30 transition-all hover:bg-accent-orange/90 hover:shadow-xl hover:shadow-accent-orange/20"
              >
                Get Started Free
              </Link>
              <motion.button
                onClick={onLoginClick}
                className="rounded-lg border border-gray-600 bg-white/10 px-6 py-3 text-center font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                Sign In
              </motion.button>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-12">
              <p className="mb-4 text-sm text-gray-400">Trusted by thousands of job seekers across India</p>
              <div className="flex flex-wrap items-center justify-center gap-6 md:justify-start">
                {['TCS', 'Infosys', 'Wipro', 'HCL', 'Tech Mahindra'].map((company) => (
                  <div key={company} className="text-sm font-medium text-gray-400">
                    {company}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right column - Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mx-auto h-[400px] w-full max-w-md md:mx-0 md:h-[500px]"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative h-full w-full">
                <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-soft-purple/30 blur-3xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative h-[350px] w-[350px] md:h-[450px] md:w-[450px]">
                    <Image
                      src="/hero-illustration.svg"
                      alt="Resume Analysis Illustration"
                      fill
                      priority
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Floating login button (visible on mobile) */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        onClick={onLoginClick}
        className="fixed bottom-6 right-6 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-accent-orange text-white shadow-lg shadow-accent-orange/30 md:hidden"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
          <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
        </svg>
      </motion.button>
    </div>
  );
};

export default HeroSection; 