'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Footer = () => {
  // Get the current year for the copyright notice
  const currentYear = new Date().getFullYear();
  // Set the starting year to 2025
  const startYear = 2025;
  // Create the copyright year display (will show as "2025" or "2025-2026" etc. as years progress)
  const copyrightYears = currentYear > startYear 
    ? `${startYear}-${currentYear}` 
    : startYear.toString();

  const footerLinks = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '#features' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'Testimonials', href: '#testimonials' },
        { name: 'FAQ', href: '#faq' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'Blog', href: '/blog' },
        { name: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
      ],
    },
  ];

  return (
    <footer className="bg-gradient-to-br from-primary-blue via-[#0a2d5e] to-[#051631] text-white py-20 relative overflow-hidden">
      {/* Enhanced decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top gradient line */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-yellow via-light-blue to-primary-yellow opacity-60"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Animated orbs */}
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-radial from-primary-yellow to-transparent opacity-5 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: 360,
            opacity: [0.03, 0.05, 0.03],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-gradient-radial from-light-blue to-transparent opacity-5 blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: -360,
            opacity: [0.02, 0.04, 0.02],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]" 
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Enhanced brand section */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/" className="flex items-center space-x-2 mb-6 group">
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-6 w-6 text-primary-yellow"
                    >
                      <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
                      <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
                      <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
                    </svg>
                  </div>
                </div>
                <span className="text-2xl font-bold group-hover:text-white transition-colors">
                  Job<span className="text-primary-yellow group-hover:text-light-yellow transition-colors">Craft.in</span>
                </span>
              </Link>
            </motion.div>
            <motion.p 
              className="text-gray-300 text-sm leading-relaxed max-w-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Your AI-Powered Career Companion for the Indian Job
              Market. Revolutionizing the Indian job search experience
              with smart, localized resume optimization.
            </motion.p>
          </div>

          {/* Enhanced links sections */}
          {footerLinks.map((group, groupIndex) => (
            <motion.div 
              key={group.title} 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * (groupIndex + 1) }}
            >
              <h3 className="text-primary-yellow font-semibold text-lg border-b border-white/10 pb-2 relative">
                {group.title}
                <motion.span
                  className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary-yellow to-transparent"
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 * (groupIndex + 1) }}
                />
              </h3>
              <ul className="space-y-3">
                {group.links.map((link, linkIndex) => (
                  <motion.li 
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * (linkIndex + 1) }}
                  >
                    <Link
                      href={link.href}
                      className="group text-gray-300 hover:text-primary-yellow transition-colors duration-200 text-sm flex items-center"
                    >
                      <motion.span 
                        className="h-1 w-1 bg-primary-yellow/50 rounded-full mr-2 group-hover:bg-primary-yellow"
                        whileHover={{ scale: 1.5 }}
                      />
                      <span className="relative">
                        {link.name}
                        <motion.span
                          className="absolute -bottom-0.5 left-0 h-[1px] bg-primary-yellow origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                        />
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Enhanced copyright bar */}
        <motion.div 
          className="mt-16 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-gray-400 text-xs">
            &copy; {copyrightYears} JobCraft.in. All rights reserved.
          </p>
          <motion.p 
            className="text-gray-400 text-xs mt-2 md:mt-0 flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            Designed with{' '}
            <motion.span
              className="text-red-500 mx-1"
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              ❤️
            </motion.span>
            {' '}for job seekers
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 