'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/solid';

interface PricingSectionProps {
  onLoginClick?: () => void;
}

const plans = [
  {
    name: 'Basic',
    price: '₹99',
    period: '/month',
    description: 'Perfect for job seekers just getting started',
    features: [
      '5 resume matches per month',
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
    price: '₹199',
    period: '/month',
    description: 'Ideal for active job seekers',
    features: [
      'Unlimited resume matches',
      'Advanced ATS optimization',
      'Industry-specific recommendations',
      'Skill benchmarking',
      'Multiple resume versions',
      'Resume templates library',
      'Chat support',
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
    price: '₹299',
    period: '/month',
    description: 'For professionals seeking career advancement',
    features: [
      'Everything in Pro plan',
      'AI-powered resume rewriting',
      'Interview preparation tips',
      'Salary insights',
      'Industry trends analysis',
      'Career path recommendations',
      'One-on-one expert consultation',
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
    <section id="pricing" className="bg-pure-white py-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute -top-24 -left-24 text-primary-blue opacity-5 h-96 w-96" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-1.5C87,13.4,81.4,26.8,73.6,38.2C65.8,49.5,55.7,58.8,43.9,67.2C32,75.7,16,83.3,0.6,82.4C-14.9,81.5,-29.8,72.1,-41.2,62.2C-52.6,52.3,-60.5,41.9,-67.4,30.3C-74.2,18.6,-80,5.8,-79.1,-6.9C-78.3,-19.5,-70.8,-32.1,-61.1,-41.2C-51.4,-50.3,-39.4,-56,-27.7,-63.4C-16,-70.8,-4.6,-79.9,7.9,-82.1C20.4,-84.2,30.7,-83.5,44.7,-76.4Z" transform="translate(100 100)" />
        </svg>
        <svg className="absolute top-1/4 right-0 text-primary-yellow opacity-5 h-64 w-64" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M39.9,-65.7C54.3,-60,70.2,-53.3,79.7,-41.3C89.2,-29.2,92.3,-11.7,89.1,4.3C85.8,20.3,76.2,34.8,65.6,47.2C55,59.7,43.3,70.1,29.7,75.3C16.1,80.6,0.5,80.7,-14.9,77.7C-30.3,74.7,-45.6,68.5,-57.8,58.4C-70,48.2,-79.1,34.1,-83.7,18.8C-88.3,3.4,-88.3,-13.2,-82.5,-27.2C-76.7,-41.1,-65,-52.5,-51.5,-58.7C-38,-64.9,-22.7,-66,-8.8,-62.8C5.1,-59.6,25.5,-71.4,39.9,-65.7Z" transform="translate(100 100)" />
        </svg>
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
            className="mb-4 inline-flex items-center rounded-full border border-primary-blue/30 bg-primary-blue/5 px-3 py-1 text-sm text-primary-blue"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="mr-1.5 h-4 w-4">
              <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
              <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
            </svg>
            Pricing Plans
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
                transition: { duration: 0.3 }
              }}
              className={`relative overflow-hidden rounded-2xl h-full flex flex-col ${
                plan.popular
                  ? 'bg-gradient-primary text-pure-white shadow-xl border-2 border-primary-yellow/20'
                  : 'bg-pure-white text-primary-blue border border-light-gray shadow-lg hover:shadow-xl transition-shadow'
              }`}
            >
              {plan.popular && (
                <div className="absolute -right-12 top-7 bg-primary-yellow px-12 py-1 text-sm font-medium text-primary-blue transform rotate-45">
                  Most Popular
                </div>
              )}
              
              <div className="p-8 flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className={`mr-3 p-2 rounded-lg ${plan.popular ? 'bg-white/10' : 'bg-primary-blue/10'}`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                </div>
                
                <p className={`mb-6 ${plan.popular ? 'text-gray-300' : 'text-medium-gray'}`}>
                  {plan.description}
                </p>
                
                <div className="mb-6 pb-6 border-b border-dashed border-gray-300/20">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className={`ml-1 ${plan.popular ? 'text-gray-300' : 'text-medium-gray'}`}>
                    {plan.period}
                  </span>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <div className={`mr-3 p-0.5 rounded-full ${plan.popular ? 'bg-primary-yellow text-primary-blue' : 'bg-light-blue/20 text-light-blue'}`}>
                        <CheckIcon className="h-4 w-4" />
                      </div>
                      <span className={plan.popular ? 'text-gray-300' : 'text-medium-gray'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onLoginClick}
                  className={`w-full rounded-xl px-6 py-4 font-medium transition-all mt-auto ${
                    plan.popular
                      ? 'bg-primary-yellow text-primary-blue hover:bg-dark-yellow shadow-accent'
                      : 'bg-primary-blue text-pure-white hover:bg-secondary-blue shadow-primary'
                  }`}
                >
                  {plan.cta}
                </motion.button>
              </div>
              
              {/* Decorative corner SVG for popular plan */}
              {plan.popular && (
                <svg className="absolute bottom-0 right-0 h-24 w-24 text-primary-yellow opacity-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="95" cy="95" r="60" fill="currentColor" />
                </svg>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center justify-center p-1 rounded-xl bg-light-gray/50 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary-blue mr-2">
              <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-medium-gray">
              All plans include secure document handling, regular feature updates, and SSL encryption
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection; 