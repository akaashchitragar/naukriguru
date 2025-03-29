'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/solid';

interface PricingSectionProps {
  onLoginClick?: () => void;
}

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: '/forever',
    description: 'Perfect for trying out our AI-powered resume analysis',
    features: [
      '3 resume scans',
      'Basic ATS compatibility check',
      'Core skills gap analysis',
      'Basic keyword optimization',
      'Email support',
    ],
    cta: 'Get Started',
    popular: false,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
        <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
      </svg>
    ),
  },
  {
    name: 'Pro',
    price: '₹99',
    period: '/month',
    description: 'Ideal for active job seekers',
    features: [
      '10 resume scans',
      'Advanced ATS optimization',
      'Industry-specific insights',
      'Skill benchmarking',
      'Multiple resume versions',
      'Resume templates library',
      'Priority email support',
    ],
    cta: 'Get Started',
    popular: true,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
        <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.75.75 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    name: 'Ultimate',
    price: '₹199',
    period: '/month',
    description: 'For professionals seeking career advancement',
    features: [
      'Unlimited resume scans',
      'Everything in Pro plan',
      'AI-powered resume rewriting',
      'Interview preparation tips',
      'Salary insights',
      'Industry trends analysis',
      'Career path recommendations',
      'Priority 24/7 support',
    ],
    cta: 'Get Started',
    popular: false,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
        <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z" clipRule="evenodd" />
      </svg>
    ),
  },
];

const PricingSection: React.FC<PricingSectionProps> = ({ onLoginClick }) => {
  return (
    <section id="pricing" className="bg-gradient-to-br from-pure-white to-gray-50 py-24 relative overflow-hidden">
      {/* Enhanced background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.05, 0.03],
            rotate: 360
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-gradient-radial from-primary-blue to-transparent rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.02, 0.04, 0.02],
            rotate: -360
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1/4 -left-1/4 w-[1000px] h-[1000px] bg-gradient-radial from-primary-yellow to-transparent rounded-full"
        />

        {/* Enhanced grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]" 
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(30, 64, 175, 0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="mx-auto max-w-3xl text-center mb-16">
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
            className="mb-4 inline-flex items-center rounded-full border border-primary-blue/30 bg-gradient-to-r from-primary-blue/20 to-primary-blue/5 px-4 py-1.5 text-sm text-primary-blue backdrop-blur-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="mr-2 h-4 w-4 animate-pulse">
              <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
              <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
            </svg>
            <span className="relative">
              Pricing Plans
              <motion.span
                className="absolute -bottom-0.5 left-0 h-[2px] bg-gradient-to-r from-primary-blue to-transparent"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-4 text-3xl font-bold text-primary-blue md:text-4xl lg:text-5xl"
          >
            Choose Your <span className="text-primary-yellow">Plan</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-16 text-lg text-medium-gray"
          >
            Select the perfect plan to boost your career opportunities
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 relative">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] }
              }}
              className={`relative overflow-hidden rounded-2xl h-full flex flex-col ${
                plan.popular
                  ? 'bg-gradient-to-br from-primary-blue to-secondary-blue text-pure-white shadow-2xl border-2 border-primary-yellow/20'
                  : 'bg-white text-primary-blue border border-light-gray shadow-xl hover:shadow-2xl transition-all duration-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -right-12 top-7 bg-gradient-to-r from-primary-yellow to-dark-yellow px-12 py-1 text-sm font-medium text-primary-blue transform rotate-45 shadow-lg">
                  Most Popular
                </div>
              )}
              
              <div className="p-8 flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className={`mr-3 p-2 rounded-lg ${
                    plan.popular 
                      ? 'bg-white/10 backdrop-blur-sm' 
                      : 'bg-gradient-to-br from-primary-blue/10 to-primary-blue/5'
                  }`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                </div>
                
                <p className={`mb-6 ${plan.popular ? 'text-gray-200' : 'text-medium-gray'}`}>
                  {plan.description}
                </p>
                
                <div className={`mb-6 pb-6 border-b ${plan.popular ? 'border-white/20' : 'border-gray-200'}`}>
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className={`ml-1 ${plan.popular ? 'text-gray-300' : 'text-medium-gray'}`}>
                    {plan.period}
                  </span>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <motion.li 
                      key={i} 
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      viewport={{ once: true }}
                    >
                      <div className={`mr-3 p-0.5 rounded-full ${
                        plan.popular 
                          ? 'bg-primary-yellow text-primary-blue' 
                          : 'bg-gradient-to-br from-primary-blue/20 to-primary-blue/10 text-primary-blue'
                      }`}>
                        <CheckIcon className="h-4 w-4" />
                      </div>
                      <span className={`${plan.popular ? 'text-gray-200' : 'text-medium-gray'}`}>
                        {feature}
                      </span>
                    </motion.li>
                  ))}
                </ul>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onLoginClick}
                  className={`group relative overflow-hidden w-full rounded-xl px-6 py-4 font-medium transition-all mt-auto ${
                    plan.popular
                      ? 'bg-primary-yellow text-primary-blue hover:bg-dark-yellow shadow-accent'
                      : 'bg-gradient-to-r from-primary-blue to-secondary-blue text-pure-white shadow-primary'
                  }`}
                >
                  <motion.span className="relative z-10 flex items-center justify-center gap-2">
                    {plan.cta}
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
              </div>
              
              {/* Enhanced decorative elements */}
              {plan.popular && (
                <>
                  <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-gradient-to-br from-primary-yellow/20 to-transparent rounded-full blur-2xl opacity-30" />
                  <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-light-blue/20 to-transparent rounded-full blur-2xl opacity-20" />
                </>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white shadow-sm border border-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary-blue mr-2">
              <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-medium-gray">
              All plans include secure document handling, regular feature updates, and SSL encryption
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection; 