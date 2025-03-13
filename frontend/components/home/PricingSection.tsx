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
  },
];

const PricingSection: React.FC<PricingSectionProps> = ({ onLoginClick }) => {
  return (
    <section id="pricing" className="bg-light-gray py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-deep-blue md:text-4xl">
            Choose Your Plan
          </h2>
          <p className="mb-16 text-lg text-gray-600">
            Select the perfect plan to boost your career opportunities
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative overflow-hidden rounded-xl ${
                plan.popular
                  ? 'bg-deep-blue text-white shadow-xl shadow-deep-blue/20'
                  : 'bg-white text-deep-blue shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute right-0 top-0 bg-accent-orange px-4 py-1 text-sm font-medium text-white">
                  Most Popular
                </div>
              )}
              <div className="p-6">
                <h3 className="mb-2 text-2xl font-bold">{plan.name}</h3>
                <p className={plan.popular ? 'text-gray-300' : 'text-gray-600'}>
                  {plan.description}
                </p>
                <div className="my-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className={plan.popular ? 'text-gray-300' : 'text-gray-600'}>
                    {plan.period}
                  </span>
                </div>
                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckIcon className={`mr-2 h-5 w-5 flex-shrink-0 ${
                        plan.popular ? 'text-accent-orange' : 'text-green-500'
                      }`} />
                      <span className={plan.popular ? 'text-gray-300' : 'text-gray-600'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onLoginClick}
                  className={`w-full rounded-lg px-4 py-3 font-medium transition-all ${
                    plan.popular
                      ? 'bg-accent-orange text-white hover:bg-accent-orange/90'
                      : 'bg-deep-blue text-white hover:bg-deep-blue/90'
                  }`}
                >
                  {plan.cta}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            All plans include secure document handling, regular feature updates, and SSL encryption.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLoginClick}
            className="mt-6 inline-flex items-center rounded-lg bg-deep-blue px-6 py-3 font-medium text-white shadow-md transition-all hover:bg-deep-blue/90"
          >
            <span>Already a member?</span>
            <span className="ml-2 font-semibold text-accent-orange">Sign In</span>
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection; 