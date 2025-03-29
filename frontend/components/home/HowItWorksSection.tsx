'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

interface HowItWorksSectionProps {
  onLoginClick?: () => void;
}

const steps = [
  {
    number: '01',
    title: 'Upload Your Resume',
    description: 'Upload your existing resume in PDF format.',
    gradientFrom: 'from-amber-400',
    gradientTo: 'to-orange-500',
    iconBg: 'bg-orange-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zm6.905 9.97a.75.75 0 00-1.06 0l-3 3a.75.75 0 101.06 1.06l1.72-1.72V18a.75.75 0 001.5 0v-4.19l1.72 1.72a.75.75 0 101.06-1.06l-3-3z" clipRule="evenodd" />
        <path d="M14.25 5.25a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963A5.23 5.23 0 0016.5 7.5h-1.875a.375.375 0 01-.375-.375V5.25z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Enter Job Description',
    description: 'Paste the job description you want to apply for to match your resume against it.',
    gradientFrom: 'from-rose-400',
    gradientTo: 'to-purple-500',
    iconBg: 'bg-purple-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path fillRule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 003 3h15a3 3 0 01-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125zM12 9.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H12zm-.75-2.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H12a.75.75 0 01-.75-.75zM6 12.75a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5H6zm-.75 3.75a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75zM6 6.75a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-3A.75.75 0 009 6.75H6z" clipRule="evenodd" />
        <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 01-3 0V6.75z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Get Comprehensive Analysis',
    description: 'Our AI analyzes your resume against the job description and provides a detailed match score.',
    gradientFrom: 'from-purple-400',
    gradientTo: 'to-indigo-500',
    iconBg: 'bg-indigo-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Receive Tailored Recommendations',
    description: 'Get personalized suggestions to improve your resume and increase your chances of getting hired.',
    gradientFrom: 'from-cyan-400',
    gradientTo: 'to-blue-500',
    iconBg: 'bg-blue-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd" />
      </svg>
    ),
  },
];

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onLoginClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const stepRefs = steps.map(() => useRef<HTMLDivElement>(null));
  const stepsInView = stepRefs.map(ref => useInView(ref, { once: true, amount: 0.3 }));
  
  const progressWidth = useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-gray-50 via-white to-blue-50/30" ref={containerRef}>
      {/* Enhanced background decorative elements */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.03, 0.05, 0.03],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-gradient-radial from-primary-blue to-transparent opacity-50"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.02, 0.04, 0.02],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
            delay: 1
          }}
          className="absolute -bottom-1/4 -left-1/4 w-[1000px] h-[1000px] bg-gradient-radial from-primary-yellow to-transparent opacity-30"
        />
        
        {/* Enhanced grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" 
          style={{
            backgroundImage: 'radial-gradient(circle, #1E40AF 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      </motion.div>

      <div className="container relative mx-auto px-4 md:px-6">
        {/* Header Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-20"
        >
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
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 01-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 01-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584zM12 18a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            How It Works
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-4 text-3xl font-bold text-primary-blue md:text-4xl lg:text-5xl"
          >
            Optimize Your Resume in
            <span className="text-primary-yellow ml-2">4 Simple Steps</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-16 text-lg text-medium-gray"
          >
            Our AI-powered platform helps you tailor your resume to match job requirements and increase your chances of landing interviews.
          </motion.p>
        </motion.div>

        {/* Steps Section */}
        <div className="relative max-w-6xl mx-auto">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                ref={stepRefs[index]}
                variants={itemVariants}
                className="relative h-full"
                whileHover={{ 
                  scale: 1.02,
                  transition: {
                    duration: 0.2,
                    ease: [0.23, 1, 0.32, 1]
                  }
                }}
              >
                <div className="group relative h-full">
                  {/* Enhanced Step Number */}
                  <motion.div
                    whileHover={{ 
                      scale: 1.1,
                      rotate: [0, -10, 10, 0],
                      transition: {
                        rotate: {
                          duration: 0.5,
                          ease: "easeInOut"
                        }
                      }
                    }}
                    className={`absolute -top-6 left-4 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center z-10 backdrop-blur-sm`}
                    style={{
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.03)'
                    }}
                  >
                    <span className={`text-2xl font-bold bg-gradient-to-br ${step.gradientFrom} ${step.gradientTo} bg-clip-text text-transparent`}>
                      {step.number}
                    </span>
                  </motion.div>

                  {/* Enhanced Content Card */}
                  <motion.div 
                    className={`h-full pt-14 pb-8 px-6 bg-gradient-to-b from-white via-white to-gray-50/50 rounded-2xl relative overflow-hidden group-hover:-translate-y-1 transition-all duration-200 shadow-xl hover:shadow-2xl`}
                    style={{
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05), 0 8px 20px -6px rgba(0,0,0,0.02)'
                    }}
                  >
                    {/* Enhanced top gradient line */}
                    <div className={`absolute inset-x-0 top-0 h-2 bg-gradient-to-r ${step.gradientFrom} ${step.gradientTo} opacity-80 rounded-t-2xl`} />
                    
                    {/* Enhanced Icon */}
                    <div className="mb-6">
                      <div className={`inline-flex p-3 rounded-xl bg-gray-50/80 backdrop-blur-sm group-hover:scale-110 transition-transform duration-200`}>
                        <div 
                          className={`${step.iconBg} p-3 rounded-lg shadow-lg transform transition-all duration-200 group-hover:rotate-12`}
                          style={{
                            boxShadow: `0 10px 25px -3px ${step.iconBg === 'bg-orange-500' ? 'rgba(249, 115, 22, 0.3)' : 
                                      step.iconBg === 'bg-purple-500' ? 'rgba(168, 85, 247, 0.3)' : 
                                      step.iconBg === 'bg-indigo-500' ? 'rgba(99, 102, 241, 0.3)' : 
                                      'rgba(59, 130, 246, 0.3)'}`
                          }}
                        >
                          <div className="text-white w-6 h-6">
                            {step.icon}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Title */}
                    <h3 className={`text-xl font-bold mb-4 bg-gradient-to-br ${step.gradientFrom} ${step.gradientTo} bg-clip-text text-transparent transform transition-all duration-200 group-hover:scale-105`}>
                      {step.title}
                    </h3>
                    
                    {/* Enhanced Description */}
                    <p className="text-gray-600 flex-grow leading-relaxed">
                      {step.description}
                    </p>

                    {/* Enhanced decorative elements */}
                    <div 
                      className={`absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br ${step.gradientFrom} ${step.gradientTo} opacity-[0.03] rounded-full blur-xl transition-all duration-300 group-hover:opacity-[0.06] group-hover:scale-110`} 
                    />
                    
                    {/* Added connecting lines between cards on larger screens */}
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-gray-200/80 to-gray-300/80 transform -translate-y-1/2" />
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorksSection; 