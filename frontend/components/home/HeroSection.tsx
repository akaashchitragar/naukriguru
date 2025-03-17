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
    <div className="relative overflow-hidden bg-gradient-primary py-24 md:py-36">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary-yellow blur-3xl"></div>
        <div className="absolute top-1/2 right-0 h-80 w-80 rounded-full bg-secondary-yellow blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-light-blue blur-3xl"></div>
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
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5,
                type: "spring",
                stiffness: 400,
                damping: 25
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="mb-6 inline-flex items-center rounded-full border border-primary-yellow/30 bg-primary-yellow/10 px-3 py-1 text-sm text-primary-yellow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="mr-1.5 h-4 w-4">
                <path d="M16.5 7.5h-9v9h9v-9z" />
                <path fillRule="evenodd" d="M8.25 2.25A.75.75 0 019 3v.75h2.25V3a.75.75 0 011.5 0v.75H15V3a.75.75 0 011.5 0v.75h.75a3 3 0 013 3v.75H21A.75.75 0 0121 9h-.75v2.25H21a.75.75 0 010 1.5h-.75V15H21a.75.75 0 010 1.5h-.75v.75a3 3 0 01-3 3h-.75V21a.75.75 0 01-1.5 0v-.75h-2.25V21a.75.75 0 01-1.5 0v-.75H9V21a.75.75 0 01-1.5 0v-.75h-.75a3 3 0 01-3-3v-.75H3A.75.75 0 013 15h.75v-2.25H3a.75.75 0 010-1.5h.75V9H3a.75.75 0 010-1.5h.75v-.75a3 3 0 013-3h.75V3a.75.75 0 01.75-.75zM6 6.75A.75.75 0 016.75 6h10.5a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V6.75z" clipRule="evenodd" />
              </svg>
              AI-Powered Resume Analysis
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6 text-4xl font-bold leading-tight text-pure-white md:text-5xl lg:text-6xl"
            >
              Your <span className="text-primary-yellow">AI Career Companion</span> for the Indian Job Market
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 text-lg text-gray-300 md:pr-8"
            >
              Job Craft revolutionizes your job search with smart, localized resume optimization and job matching services built specifically for the Indian market.
            </motion.p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 md:justify-start">
              <Link 
                href="/auth/signup" 
                className="rounded-lg bg-primary-yellow px-6 py-3 text-center font-medium text-primary-blue shadow-accent transition-all hover:bg-dark-yellow"
              >
                Get Started Free
              </Link>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-12">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.8, 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 400,
                  damping: 25
                }}
                className="mb-4 inline-flex items-center rounded-full border border-light-blue/30 bg-white/5 px-3 py-1 text-sm text-gray-300 backdrop-blur-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="mr-1.5 h-4 w-4 text-primary-yellow">
                  <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
                Trusted by thousands of job seekers across India
              </motion.div>
              <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
                {[
                  { name: 'TCS', delay: 0.9 },
                  { name: 'Infosys', delay: 1.0 },
                  { name: 'Wipro', delay: 1.1 },
                  { name: 'HCL', delay: 1.2 },
                  { name: 'Tech Mahindra', delay: 1.3 }
                ].map((company) => (
                  <motion.div
                    key={company.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    transition={{ 
                      delay: company.delay, 
                      duration: 0.3,
                      whileHover: { duration: 0.1 }
                    }}
                    className="rounded-md border border-light-blue/20 bg-white/5 px-3 py-1.5 text-sm font-medium text-gray-300 backdrop-blur-sm transition-all hover:border-primary-yellow/30 hover:text-primary-yellow"
                  >
                    {company.name}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right column - Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mx-auto h-[500px] w-full max-w-xl md:mx-0 md:h-[600px]"
          >
            <div className="absolute inset-0 flex items-center justify-center scale-125">
              <motion.svg
                viewBox="0 0 400 400"
                className="h-full w-full"
                initial="hidden"
                animate="visible"
              >
                {/* Enhanced background with gradient */}
                <defs>
                  <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(96, 165, 250, 0.15)" />
                    <stop offset="100%" stopColor="rgba(252, 211, 77, 0.1)" />
                  </linearGradient>
                  <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor="rgba(252, 211, 77, 0.6)" />
                    <stop offset="100%" stopColor="rgba(252, 211, 77, 0)" />
                  </radialGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                  <filter id="shadow">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.2" />
                  </filter>
                  <pattern id="gridPattern" width="10" height="10" patternUnits="userSpaceOnUse">
                    <rect width="10" height="10" fill="none" />
                    <circle cx="5" cy="5" r="0.5" fill="rgba(255, 255, 255, 0.1)" />
                  </pattern>
                </defs>

                {/* Background elements */}
                <motion.circle
                  cx="200"
                  cy="200"
                  r="180"
                  fill="url(#bgGradient)"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
                
                {/* Grid pattern background */}
                <motion.circle
                  cx="200"
                  cy="200"
                  r="170"
                  fill="url(#gridPattern)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  transition={{ delay: 0.5, duration: 1 }}
                />

                {/* Animated background pulse */}
                <motion.circle
                  cx="200"
                  cy="200"
                  r="160"
                  fill="none"
                  stroke="rgba(252, 211, 77, 0.2)"
                  strokeWidth="2"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: [0.8, 1.1, 0.8],
                    opacity: [0, 0.5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Floating tech icons with enhanced animations */}
                {[
                  { icon: "⚡", x: 80, y: 150, rotate: -15 },
                  { icon: "🔍", x: 350, y: 250, rotate: 20 },
                  { icon: "💼", x: 100, y: 300, rotate: 10 },
                  { icon: "📊", x: 300, y: 300, rotate: -10 },
                  { icon: "🚀", x: 200, y: 100, rotate: 0 },
                  { icon: "💡", x: 200, y: 320, rotate: 0 },
                ].map((item, i) => (
                  <motion.g key={i}>
                    <motion.circle
                      cx={item.x}
                      cy={item.y}
                      r="18"
                      fill="rgba(255, 255, 255, 0.1)"
                      initial={{ scale: 0 }}
                      animate={{ 
                        scale: [0, 1, 0.9, 1],
                        opacity: [0, 0.8, 0.7, 0.8]
                      }}
                      transition={{
                        scale: { delay: 1 + i * 0.2, duration: 0.5 },
                        opacity: { 
                          delay: 1 + i * 0.2, 
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }
                      }}
                    />
                    <motion.text
                      x={item.x}
                      y={item.y}
                      fontSize="26"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      initial={{ opacity: 0, scale: 0, rotate: item.rotate - 10 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: [item.y - 10, item.y + 10, item.y - 10],
                        rotate: [item.rotate - 10, item.rotate + 10, item.rotate - 10]
                      }}
                      transition={{
                        opacity: { delay: 1 + i * 0.2, duration: 0.5 },
                        scale: { delay: 1 + i * 0.2, duration: 0.5 },
                        y: {
                          repeat: Infinity,
                          duration: 3,
                          delay: i * 0.3,
                          ease: "easeInOut"
                        },
                        rotate: {
                          repeat: Infinity,
                          duration: 4,
                          delay: i * 0.2,
                          ease: "easeInOut"
                        }
                      }}
                    >
                      {item.icon}
                    </motion.text>
                  </motion.g>
                ))}

                {/* Resume outline with enhanced shadow */}
                <motion.rect
                  x="100"
                  y="80"
                  width="200"
                  height="240"
                  rx="10"
                  fill="white"
                  filter="url(#shadow)"
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />

                {/* Resume header with gradient */}
                <motion.rect
                  x="120"
                  y="95"
                  width="100"
                  height="15"
                  rx="3"
                  fill="#1E40AF"
                  initial={{ width: 0 }}
                  animate={{ width: 100 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                />

                {/* Golden Rank Badge (replacing profile circle) */}
                <motion.g>
                  {/* Badge background with gradient */}
                  <defs>
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFD700" />
                      <stop offset="50%" stopColor="#FFC107" />
                      <stop offset="100%" stopColor="#FF8C00" />
                    </linearGradient>
                  </defs>
                  
                  {/* Badge shape */}
                  <motion.path
                    d="M260 90 L270 105 L260 120 L250 105 Z"
                    fill="url(#goldGradient)"
                    filter="url(#shadow)"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.4 }}
                  />
                  
                  {/* Badge highlight */}
                  <motion.path
                    d="M260 93 L267 105 L260 117 L253 105 Z"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.6)"
                    strokeWidth="1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0.5] }}
                    transition={{ 
                      delay: 1.4, 
                      duration: 1,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                  
                  {/* Badge star */}
                  <motion.path
                    d="M260 98 L262 103 L267 103 L263 107 L265 112 L260 109 L255 112 L257 107 L253 103 L258 103 Z"
                    fill="#FFFFFF"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: [0, 10, 0] }}
                    transition={{ 
                      scale: { delay: 1.6, duration: 0.3 },
                      rotate: { 
                        delay: 2,
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }
                    }}
                  />
                  
                  {/* Shine effect */}
                  <motion.circle
                    cx="255"
                    cy="100"
                    r="2"
                    fill="#FFFFFF"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.8, 0] }}
                    transition={{ 
                      delay: 1.8,
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  />
                </motion.g>

                {/* Resume lines with varying widths, colors and animations */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.rect
                    key={i}
                    x="120"
                    y={130 + i * 30}
                    width={160 - (i % 3) * 30}
                    height="12"
                    rx="3"
                    fill={i === 0 ? "#E2E8F0" : "#F1F5F9"}
                    initial={{ width: 0 }}
                    animate={{ 
                      width: 160 - (i % 3) * 30,
                      fill: i === 2 ? ["#F1F5F9", "rgba(252, 211, 77, 0.3)", "#F1F5F9"] : undefined
                    }}
                    transition={{ 
                      delay: 1 + i * 0.2, 
                      duration: 0.5,
                      fill: i === 2 ? {
                        delay: 3,
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 5
                      } : undefined
                    }}
                  />
                ))}

                {/* Skills section */}
                <motion.rect
                  x="120"
                  y="290"
                  width="160"
                  height="20"
                  rx="3"
                  fill="#F1F5F9"
                  initial={{ width: 0 }}
                  animate={{ width: 160 }}
                  transition={{ delay: 2, duration: 0.5 }}
                />
                
                {/* Skill bars */}
                {[0, 1, 2].map((i) => (
                  <motion.rect
                    key={`skill-${i}`}
                    x="125"
                    y={293 + i * 5}
                    width={40 + i * 30}
                    height="4"
                    rx="2"
                    fill={i === 1 ? "#FCD34D" : "#1E40AF"}
                    initial={{ width: 0 }}
                    animate={{ width: 40 + i * 30 }}
                    transition={{ delay: 2.2 + i * 0.2, duration: 0.5 }}
                  />
                ))}

                {/* AI Analysis indicators with enhanced effects */}
                {[0, 1, 2].map((i) => (
                  <motion.g key={`analysis-${i}`}>
                    <motion.circle
                      cx={140 + i * 60}
                      cy="280"
                      r="18"
                      fill="url(#glowGradient)"
                      initial={{ scale: 0 }}
                      animate={{ 
                        scale: [0, 1.2, 1],
                        opacity: [0, 0.6, 0.4]
                      }}
                      transition={{
                        delay: 1.8 + i * 0.2,
                        duration: 0.5,
                        times: [0, 0.8, 1],
                        opacity: {
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }
                      }}
                    />
                    <motion.circle
                      cx={140 + i * 60}
                      cy="280"
                      r="15"
                      fill="#FCD34D"
                      filter="url(#glow)"
                      initial={{ scale: 0 }}
                      animate={{ 
                        scale: [0, 1.2, 1],
                        opacity: [1, 0.8, 1]
                      }}
                      transition={{
                        delay: 1.8 + i * 0.2,
                        duration: 0.5,
                        times: [0, 0.8, 1],
                        opacity: {
                          duration: 1,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }
                      }}
                    />
                    <motion.circle
                      cx={140 + i * 60}
                      cy="280"
                      r="8"
                      fill="#1E40AF"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 2 + i * 0.2, duration: 0.3 }}
                    />
                  </motion.g>
                ))}

                {/* Enhanced scanning line with glow and pulse */}
                <motion.line
                  x1="100"
                  y1="100"
                  x2="300"
                  y2="100"
                  stroke="#FCD34D"
                  strokeWidth="2"
                  filter="url(#glow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    y: [100, 300, 100],
                    opacity: [0, 1, 0],
                    strokeWidth: [2, 3, 2]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "linear"
                  }}
                />

                {/* Enhanced connection lines with animation */}
                {[0, 1].map((i) => (
                  <motion.path
                    key={`connection-${i}`}
                    d={`M ${140 + i * 120} 280 Q ${200} ${220 + i * 100} ${260 + i * 40} 200`}
                    stroke="#FCD34D"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    fill="none"
                    filter="url(#glow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ 
                      pathLength: 1, 
                      opacity: 0.5,
                      strokeDashoffset: [0, -20]
                    }}
                    transition={{ 
                      delay: 2.5 + i * 0.2, 
                      duration: 1,
                      strokeDashoffset: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }
                    }}
                  />
                ))}

                {/* Data flow particles */}
                {[0, 1].map((pathIndex) => (
                  [0, 1, 2].map((particleIndex) => (
                    <motion.circle
                      key={`particle-${pathIndex}-${particleIndex}`}
                      cx="0"
                      cy="0"
                      r="3"
                      fill="#FCD34D"
                      filter="url(#glow)"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        offsetDistance: ["0%", "100%"],
                      }}
                      style={{
                        offsetPath: `path("M ${140 + pathIndex * 120} 280 Q ${200} ${220 + pathIndex * 100} ${260 + pathIndex * 40} 200")`,
                        offsetRotate: "auto"
                      }}
                      transition={{
                        duration: 2,
                        delay: 3 + particleIndex * 0.7,
                        repeat: Infinity,
                        repeatDelay: particleIndex * 0.5
                      }}
                    />
                  ))
                ))}

                {/* Job Match Indicator */}
                <motion.g>
                  <motion.rect
                    x="320"
                    y="120"
                    width="60"
                    height="70"
                    rx="8"
                    fill="white"
                    filter="url(#shadow)"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.2, duration: 0.5 }}
                  />
                  
                  {/* Job Match Header */}
                  <motion.rect
                    x="325"
                    y="125"
                    width="50"
                    height="10"
                    rx="2"
                    fill="#1E40AF"
                    initial={{ width: 0 }}
                    animate={{ width: 50 }}
                    transition={{ delay: 2.4, duration: 0.3 }}
                  />
                  
                  {/* Match Percentage Bar Background */}
                  <motion.rect
                    x="325"
                    y="145"
                    width="50"
                    height="15"
                    rx="7.5"
                    fill="#E2E8F0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5, duration: 0.3 }}
                  />
                  
                  {/* Match Percentage Bar Fill */}
                  <motion.rect
                    x="325"
                    y="145"
                    width="0"
                    height="15"
                    rx="7.5"
                    fill="url(#goldGradient)"
                    initial={{ width: 0 }}
                    animate={{ width: 40 }}
                    transition={{ delay: 2.6, duration: 0.8 }}
                  />
                  
                  {/* Match Text */}
                  <motion.text
                    x="350"
                    y="153"
                    fontSize="10"
                    fill="white"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.7, duration: 0.3 }}
                  >
                    Match
                  </motion.text>
                  
                  {/* Job Details Lines */}
                  {[0, 1].map((i) => (
                    <motion.rect
                      key={`job-detail-${i}`}
                      x="325"
                      y={170 + i * 12}
                      width="50"
                      height="6"
                      rx="3"
                      fill="#F1F5F9"
                      initial={{ width: 0 }}
                      animate={{ width: 50 - i * 15 }}
                      transition={{ delay: 2.7 + i * 0.1, duration: 0.3 }}
                    />
                  ))}
                </motion.g>

                {/* Career Growth Chart */}
                <motion.g>
                  {/* Chart Background */}
                  <motion.rect
                    x="320"
                    y="200"
                    width="60"
                    height="70"
                    rx="8"
                    fill="white"
                    filter="url(#shadow)"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.4, duration: 0.5 }}
                  />
                  
                  {/* Chart Grid Lines */}
                  {[0, 1, 2].map((i) => (
                    <motion.line
                      key={`grid-line-${i}`}
                      x1="325"
                      y1={220 + i * 15}
                      x2="375"
                      y2={220 + i * 15}
                      stroke="#E2E8F0"
                      strokeWidth="1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.6 + i * 0.1, duration: 0.2 }}
                    />
                  ))}
                  
                  {/* Chart Growth Line */}
                  <motion.path
                    d="M325 250 L335 245 L345 235 L355 225 L365 210 L375 205"
                    fill="none"
                    stroke="#1E40AF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 2.8, duration: 0.8 }}
                  />
                  
                  {/* Chart Points */}
                  {[0, 1, 2, 3, 4, 5].map((i) => {
                    const x = 325 + i * 10;
                    const y = 250 - i * (i === 4 || i === 5 ? 15 : 5) - (i * 2);
                    return (
                      <motion.circle
                        key={`chart-point-${i}`}
                        cx={x}
                        cy={y}
                        r="3"
                        fill="#FCD34D"
                        filter="url(#glow)"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 2.9 + i * 0.1, duration: 0.2 }}
                      />
                    );
                  })}
                  
                  {/* Chart Title */}
                  <motion.rect
                    x="325"
                    y="205"
                    width="40"
                    height="8"
                    rx="2"
                    fill="#1E40AF"
                    initial={{ width: 0 }}
                    animate={{ width: 40 }}
                    transition={{ delay: 2.5, duration: 0.3 }}
                  />
                </motion.g>

                {/* Application Status Tracker */}
                <motion.g>
                  {/* Background Card */}
                  <motion.rect
                    x="320"
                    y="280"
                    width="60"
                    height="60"
                    rx="8"
                    fill="white"
                    filter="url(#shadow)"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3, duration: 0.5 }}
                  />
                  
                  {/* Status Header */}
                  <motion.rect
                    x="325"
                    y="285"
                    width="50"
                    height="8"
                    rx="2"
                    fill="#1E40AF"
                    initial={{ width: 0 }}
                    animate={{ width: 50 }}
                    transition={{ delay: 3.1, duration: 0.3 }}
                  />
                  
                  {/* Status Steps */}
                  {[0, 1, 2].map((i) => (
                    <motion.g key={`status-step-${i}`}>
                      {/* Step Circle */}
                      <motion.circle
                        cx="335"
                        cy={300 + i * 12}
                        r="5"
                        fill={i < 2 ? "#FCD34D" : "#E2E8F0"}
                        filter={i < 2 ? "url(#glow)" : "none"}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 3.2 + i * 0.15, duration: 0.3 }}
                      />
                      
                      {/* Step Text Background */}
                      <motion.rect
                        x="345"
                        y={296 + i * 12}
                        width="30"
                        height="8"
                        rx="2"
                        fill="#F1F5F9"
                        initial={{ width: 0 }}
                        animate={{ width: 30 }}
                        transition={{ delay: 3.3 + i * 0.15, duration: 0.3 }}
                      />
                      
                      {/* Checkmark for completed steps */}
                      {i < 1 && (
                        <motion.path
                          d="M332 300 L334 303 L338 297"
                          fill="none"
                          stroke="#1E40AF"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: 3.4 + i * 0.15, duration: 0.3 }}
                        />
                      )}
                    </motion.g>
                  ))}
                  
                  {/* Current Step Indicator */}
                  <motion.circle
                    cx="335"
                    cy="312"
                    r="2"
                    fill="#1E40AF"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ 
                      delay: 3.6,
                      duration: 1,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                  
                  {/* Progress Bar Background */}
                  <motion.rect
                    x="325"
                    y="330"
                    width="50"
                    height="4"
                    rx="2"
                    fill="#E2E8F0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3.7, duration: 0.3 }}
                  />
                  
                  {/* Progress Bar Fill */}
                  <motion.rect
                    x="325"
                    y="330"
                    width="0"
                    height="4"
                    rx="2"
                    fill="url(#goldGradient)"
                    initial={{ width: 0 }}
                    animate={{ width: 30 }}
                    transition={{ delay: 3.8, duration: 0.5 }}
                  />
                </motion.g>

                {/* Percentage indicators with enhanced styling */}
                {[
                  { text: "98%", x: 85, y: 180 }
                ].map((item, i) => (
                  <motion.g key={`percent-${i}`}>
                    <motion.rect
                      x={item.x - 15}
                      y={item.y - 15}
                      width="40"
                      height="20"
                      rx="10"
                      fill="rgba(30, 64, 175, 0.2)"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 0.8, scale: 1 }}
                      transition={{ delay: 2.7 + i * 0.2, duration: 0.3 }}
                    />
                    <motion.text
                      x={item.x}
                      y={item.y}
                      fontSize="16"
                      fill="#FCD34D"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      filter="drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.3))"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.8 + i * 0.2 }}
                    >
                      {item.text}
                    </motion.text>
                  </motion.g>
                ))}

                {/* AI Badge */}
                <motion.g>
                  {/* Outer glow ring */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="rgba(252, 211, 77, 0.15)"
                    strokeWidth="8"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0.9, 1.1, 0.9] }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Background circle with gradient */}
                  <defs>
                    <radialGradient id="aiBadgeGradient" cx="40%" cy="40%" r="60%" fx="40%" fy="40%">
                      <stop offset="0%" stopColor="rgba(30, 64, 175, 0.6)" />
                      <stop offset="100%" stopColor="rgba(30, 64, 175, 0.2)" />
                    </radialGradient>
                  </defs>
                  
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="28"
                    fill="url(#aiBadgeGradient)"
                    filter="url(#shadow)"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 3, duration: 0.5 }}
                  />
                  
                  {/* Inner highlight */}
                  <motion.circle
                    cx="40"
                    cy="40"
                    r="10"
                    fill="rgba(255, 255, 255, 0.1)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3.1, duration: 0.3 }}
                  />
                  
                  {/* AI Text with enhanced styling */}
                  <motion.text
                    x="50"
                    y="50"
                    fontSize="18"
                    fill="#FCD34D"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    filter="url(#glow)"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 3.2, duration: 0.3 }}
                  >
                    AI
                  </motion.text>
                  
                  {/* Rotating outer ring with dash pattern */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="32"
                    fill="none"
                    stroke="#FCD34D"
                    strokeWidth="2"
                    strokeDasharray="60,100"
                    filter="url(#glow)"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ 
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  
                  {/* Secondary rotating ring */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="36"
                    fill="none"
                    stroke="rgba(252, 211, 77, 0.3)"
                    strokeWidth="1"
                    strokeDasharray="20,40"
                    initial={{ rotate: 180 }}
                    animate={{ rotate: -180 }}
                    transition={{ 
                      duration: 12,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  
                  {/* Pulsing dots around the circle */}
                  {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                    const x = 50 + Math.cos(angle * Math.PI / 180) * 40;
                    const y = 50 + Math.sin(angle * Math.PI / 180) * 40;
                    return (
                      <motion.circle
                        key={`ai-dot-${i}`}
                        cx={x}
                        cy={y}
                        r="3"
                        fill="#FCD34D"
                        filter="url(#glow)"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ 
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0]
                        }}
                        transition={{
                          duration: 2,
                          delay: 3.5 + i * 0.2,
                          repeat: Infinity,
                          repeatDelay: 3
                        }}
                      />
                    );
                  })}
                </motion.g>
              </motion.svg>
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
        className="fixed bottom-6 right-6 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-primary-yellow text-primary-blue shadow-accent md:hidden"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
          <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
        </svg>
      </motion.button>

      {/* Scroll down indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <span className="text-primary-yellow text-sm font-medium mb-2">Scroll Down</span>
        <div className="flex flex-col items-center">
          {[0, 1, 2].map((index) => (
            <motion.svg 
              key={index}
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="14" 
              viewBox="0 0 24 14" 
              fill="none" 
              className="-mt-2"
              initial={{ opacity: 0.3 }}
              animate={{ 
                opacity: [0.3, 1, 0.3],
                y: [0, 4, 0]
              }}
              transition={{
                duration: 1.5,
                delay: index * 0.2,
                repeat: Infinity,
                repeatType: "loop"
              }}
            >
              <path 
                d="M2 2L12 12L22 2" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="text-primary-yellow"
              />
            </motion.svg>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection; 