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
    <section className="bg-white py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-deep-blue to-[#1a3a5f] p-8 md:p-12">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-accent-orange blur-3xl"></div>
            <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#4cc9f0] blur-3xl"></div>
          </div>

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-4 text-3xl font-bold text-white md:text-4xl"
            >
              Ready to Boost Your Career?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="mb-8 text-lg text-gray-300"
            >
              Join thousands of job seekers who have already improved their chances of landing their dream job with Job Craft.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 md:justify-center"
            >
              <Link
                href="/auth/signup"
                className="rounded-lg bg-accent-orange px-8 py-3 text-center font-medium text-white shadow-lg shadow-accent-orange/30 transition-all hover:bg-accent-orange/90 hover:shadow-xl hover:shadow-accent-orange/20"
              >
                Get Started Free
              </Link>
              <motion.button
                onClick={onLoginClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-lg border border-gray-600 bg-white/10 px-8 py-3 text-center font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
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
                  <div key={i} className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-white">
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
                <span className="font-semibold text-white">1,000+</span> users joined this month
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection; 