'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface FeaturesSectionProps {
  onLoginClick?: () => void;
}

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10">
        <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
        <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
        <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
      </svg>
    ),
    title: 'Smart Resume Analysis',
    description: 'Our AI analyzes your resume against job descriptions to provide a comprehensive match score and detailed feedback.',
    color: 'from-blue-500 to-blue-600',
    highlight: 'primary',
    stats: '98% accuracy',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10">
        <path fillRule="evenodd" d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm4.5 7.5a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zm3.75-1.5a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0V12zm2.25-3a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0V9.75A.75.75 0 0113.5 9zm3.75-1.5a.75.75 0 00-1.5 0v9a.75.75 0 001.5 0v-9z" clipRule="evenodd" />
      </svg>
    ),
    title: 'Comprehensive Scoring',
    description: 'Get scored across multiple criteria including keyword matching, experience level, technical skills, and more.',
    color: 'from-yellow-500 to-yellow-600',
    highlight: 'secondary',
    stats: '10+ metrics',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10">
        <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
      </svg>
    ),
    title: 'Intelligent Feedback',
    description: 'Receive actionable recommendations to improve your resume and increase your chances of landing your dream job.',
    color: 'from-blue-500 to-blue-600',
    highlight: 'primary',
    stats: 'Personalized',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10">
        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
      </svg>
    ),
    title: 'ATS Optimization',
    description: 'Ensure your resume passes through Applicant Tracking Systems with our specialized optimization techniques.',
    color: 'from-yellow-500 to-yellow-600',
    highlight: 'secondary',
    stats: '85% pass rate',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10">
        <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
      </svg>
    ),
    title: 'Indian Job Market Focus',
    description: 'Tailored specifically for the Indian job market, considering local industry requirements and practices.',
    color: 'from-blue-500 to-blue-600',
    highlight: 'primary',
    stats: 'India-specific',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10">
        <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
      </svg>
    ),
    title: 'Career Path Recommendations',
    description: 'Get insights into potential career paths based on your skills, experience, and the current job market trends.',
    color: 'from-yellow-500 to-yellow-600',
    highlight: 'secondary',
    stats: 'Data-driven',
  },
];

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onLoginClick }) => {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  return (
    <section id="features" className="relative overflow-hidden bg-gradient-to-b from-gray-50 via-white to-blue-50/30 py-24">
      {/* Enhanced background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary-blue opacity-[0.03] blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-primary-yellow opacity-[0.03] blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 h-32 w-32 rounded-full bg-light-blue opacity-[0.03] blur-2xl"></div>
        <div className="absolute top-1/3 right-1/4 h-48 w-48 rounded-full bg-primary-yellow opacity-[0.03] blur-2xl"></div>
        
        {/* Enhanced Grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" 
          style={{
            backgroundImage: 'radial-gradient(circle, #1E40AF 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        ></div>
      </div>
      
      <div className="container relative mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
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
            className="mb-4 inline-flex items-center rounded-full border border-primary-blue/30 bg-primary-blue/5 px-3 py-1 text-sm text-primary-blue"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="mr-1.5 h-4 w-4">
              <path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 00.372-.648V7.93zM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 00.372.648l8.628 5.033z" />
            </svg>
            Powerful Features
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-4 text-3xl font-bold text-primary-blue md:text-4xl lg:text-5xl"
          >
            Tools to <span className="text-primary-yellow">Supercharge</span> Your Career
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-16 text-lg text-medium-gray"
          >
            Job Craft provides a comprehensive set of AI-powered tools to help you optimize your resume and increase your chances of landing your dream job.
          </motion.p>
        </div>

        {/* Features Grid with enhanced styling */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: 0.1 * index,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              whileHover={{ 
                y: -8,
                scale: 1.02,
                boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.1), 0 10px 20px -10px rgba(0, 0, 0, 0.04)',
                transition: {
                  duration: 0.2,
                  ease: [0.23, 1, 0.32, 1]
                }
              }}
              onHoverStart={() => setActiveFeature(index)}
              onHoverEnd={() => setActiveFeature(null)}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-white via-white to-gray-50/50 p-8 shadow-lg transition-all duration-200 hover:shadow-2xl border border-gray-100"
              style={{
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)'
              }}
            >
              {/* Feature Icon with enhanced animation */}
              <div 
                className={`relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} p-3 text-pure-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}
                style={{
                  boxShadow: feature.highlight === 'primary' 
                    ? '0 8px 20px -3px rgba(30, 64, 175, 0.3)' 
                    : '0 8px 20px -3px rgba(252, 211, 77, 0.3)'
                }}
              >
                {feature.icon}
                
                {/* Enhanced animated particles around icon */}
                <motion.div 
                  className="absolute -inset-1 rounded-3xl"
                  initial={{ opacity: 0 }}
                  animate={activeFeature === index ? { 
                    opacity: [0, 0.6, 0],
                    scale: [0.8, 1.2, 0.8],
                  } : { opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                  style={{
                    background: `linear-gradient(90deg, transparent, ${feature.highlight === 'primary' ? 'rgba(30, 64, 175, 0.3)' : 'rgba(252, 211, 77, 0.3)'}, transparent)`,
                  }}
                />
              </div>
              
              {/* Feature Content with enhanced styling */}
              <div className="relative z-10">
                <h3 className="mb-3 text-xl font-bold text-primary-blue group-hover:text-primary-yellow transition-colors duration-300">{feature.title}</h3>
                <p className="mb-4 text-medium-gray/90">{feature.description}</p>
                
                {/* Enhanced Stats badge */}
                <div 
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-all duration-300 ${
                    feature.highlight === 'primary' 
                      ? 'bg-primary-blue/10 text-primary-blue group-hover:bg-primary-blue/20' 
                      : 'bg-primary-yellow/10 text-primary-yellow group-hover:bg-primary-yellow/20'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mr-1.5 h-4 w-4">
                    <path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.785l-1.192.238a1 1 0 000 1.962l1.192.238a1 1 0 01.785.785l.238 1.192a1 1 0 001.962 0l.238-1.192a1 1 0 01.785-.785l1.192-.238a1 1 0 000-1.962l-1.192-.238a1 1 0 01-.785-.785l-.238-1.192zM6.949 5.684a1 1 0 00-1.898 0l-.683 2.051a1 1 0 01-.633.633l-2.051.683a1 1 0 000 1.898l2.051.684a1 1 0 01.633.632l.683 2.051a1 1 0 001.898 0l.683-2.051a1 1 0 01.633-.633l2.051-.683a1 1 0 000-1.898l-2.051-.683a1 1 0 01-.633-.633L6.95 5.684z" />
                  </svg>
                  {feature.stats}
                </div>
              </div>
              
              {/* Enhanced decorative elements */}
              <div 
                className={`absolute -right-4 -top-4 h-32 w-32 rounded-full bg-gradient-to-br ${feature.color} opacity-5 blur-2xl transition-all duration-300 group-hover:opacity-10 group-hover:scale-110`}
              ></div>
              
              {/* Enhanced Bottom Highlight */}
              <div 
                className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${feature.color} transition-all duration-500 group-hover:w-full shadow-lg`}
                style={{
                  boxShadow: feature.highlight === 'primary' 
                    ? '0 0 20px rgba(30, 64, 175, 0.3)' 
                    : '0 0 20px rgba(252, 211, 77, 0.3)'
                }}
              ></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 