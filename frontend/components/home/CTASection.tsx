'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface CTASectionProps {
  onLoginClick?: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onLoginClick }) => {
  return (
    <section className="bg-gradient-to-b from-white via-blue-50/30 to-white py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-primary p-8 md:p-12 shadow-primary">
          {/* SVG Background Illustrations */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            {/* Career Growth SVG - Top Right */}
            <svg 
              className="absolute -top-10 -right-10 h-64 w-64 text-primary-yellow"
              viewBox="0 0 200 200" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M140,40 L160,40 L160,140 L140,140 Z" fill="currentColor" opacity="0.6" />
              <path d="M110,60 L130,60 L130,140 L110,140 Z" fill="currentColor" opacity="0.8" />
              <path d="M80,80 L100,80 L100,140 L80,140 Z" fill="currentColor" />
              <path d="M50,100 L70,100 L70,140 L50,140 Z" fill="currentColor" opacity="0.7" />
              <path d="M20,120 L40,120 L40,140 L20,140 Z" fill="currentColor" opacity="0.5" />
              <path d="M10,150 L170,150 L170,160 L10,160 Z" fill="currentColor" opacity="0.9" />
              <path d="M155,30 L165,40 L140,65 L130,55 Z" fill="currentColor" />
              <circle cx="160" cy="25" r="10" fill="currentColor" />
            </svg>
            
            {/* Resume Document SVG - Bottom Left */}
            <svg 
              className="absolute bottom-0 left-10 h-56 w-56 text-light-blue"
              viewBox="0 0 200 200" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="40" y="30" width="120" height="150" rx="4" fill="currentColor" opacity="0.7" />
              <rect x="60" y="50" width="80" height="6" rx="2" fill="white" opacity="0.6" />
              <rect x="60" y="70" width="60" height="6" rx="2" fill="white" opacity="0.6" />
              <rect x="60" y="90" width="80" height="6" rx="2" fill="white" opacity="0.6" />
              <rect x="60" y="110" width="70" height="6" rx="2" fill="white" opacity="0.6" />
              <rect x="60" y="130" width="40" height="6" rx="2" fill="white" opacity="0.6" />
              <rect x="60" y="150" width="60" height="6" rx="2" fill="white" opacity="0.6" />
            </svg>
            
            {/* Search/Magnifying Glass SVG - Center Right */}
            <svg 
              className="absolute top-1/3 -right-10 h-48 w-48 text-pure-white"
              viewBox="0 0 200 200" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="80" cy="80" r="40" stroke="currentColor" strokeWidth="8" opacity="0.5" />
              <path d="M110,110 L150,150" stroke="currentColor" strokeWidth="10" strokeLinecap="round" opacity="0.7" />
            </svg>
            
            {/* Network/Connection SVG - Bottom Right */}
            <svg 
              className="absolute bottom-5 right-10 h-40 w-40 text-primary-yellow"
              viewBox="0 0 200 200" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="50" r="15" fill="currentColor" opacity="0.8" />
              <circle cx="150" cy="50" r="15" fill="currentColor" opacity="0.8" />
              <circle cx="50" cy="150" r="15" fill="currentColor" opacity="0.8" />
              <circle cx="150" cy="150" r="15" fill="currentColor" opacity="0.8" />
              <circle cx="100" cy="100" r="20" fill="currentColor" />
              <line x1="65" y1="50" x2="85" y2="85" stroke="currentColor" strokeWidth="3" opacity="0.6" />
              <line x1="115" y1="115" x2="135" y2="150" stroke="currentColor" strokeWidth="3" opacity="0.6" />
              <line x1="65" y1="150" x2="85" y2="115" stroke="currentColor" strokeWidth="3" opacity="0.6" />
              <line x1="115" y1="85" x2="135" y2="50" stroke="currentColor" strokeWidth="3" opacity="0.6" />
            </svg>
          </div>

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5,
                type: "spring",
                stiffness: 400,
                damping: 25
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="mb-4 inline-flex items-center rounded-full border border-white/30 bg-white/5 px-3 py-1 text-sm text-pure-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="mr-1.5 h-4 w-4">
                <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-4.131A15.838 15.838 0 016.382 15H2.25a.75.75 0 01-.75-.75 6.75 6.75 0 017.815-6.666zM15 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clipRule="evenodd" />
                <path d="M5.26 17.242a.75.75 0 10-.897-1.203 5.243 5.243 0 00-2.05 5.022.75.75 0 00.625.627 5.243 5.243 0 005.022-2.051.75.75 0 10-1.202-.897 3.744 3.744 0 01-3.008 1.51c0-1.23.592-2.323 1.51-3.008z" />
              </svg>
              Get Started
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-4 text-3xl font-bold text-pure-white md:text-4xl lg:text-5xl"
            >
              Ready to <span className="text-primary-yellow">Boost</span> Your Career?
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 text-lg text-gray-300"
            >
              Join thousands of job seekers who have already improved their chances of landing their dream job with Job Craft.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 md:justify-center"
            >
              <Link
                href="/auth/signup"
                className="rounded-lg bg-primary-yellow px-8 py-3 text-center font-medium text-primary-blue shadow-accent transition-all hover:bg-dark-yellow"
              >
                Get Started Free
              </Link>
              <motion.button
                onClick={onLoginClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-lg border border-light-blue/30 bg-white/10 px-8 py-3 text-center font-medium text-pure-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                Sign In
              </motion.button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-8 flex items-center justify-center"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-pure-white">
                    <Image
                      src={`/avatars/avatar-${i}.jpg`}
                      alt={`User ${i}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="ml-4 text-sm text-gray-300">
                <span className="font-semibold text-primary-yellow">1,000+</span> users joined this month
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;