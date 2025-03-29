'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

// Expanded testimonials array with more entries
const testimonials = [
  {
    name: 'Priya Sharma',
    position: 'Software Engineer',
    content:
      'JobCraft helped me optimize my resume for tech roles. The AI feedback was spot-on and helped me highlight the right skills. I got calls from 3 companies within a week!',
  },
  {
    name: 'Rahul Verma',
    position: 'Product Manager',
    content:
      'The detailed analysis of my resume against job descriptions was eye-opening. I was able to tailor my applications much better and landed my dream job.',
  },
  {
    name: 'Ananya Patel',
    position: 'Data Scientist',
    content:
      'As someone transitioning into data science, JobCraft was invaluable. It helped me identify skill gaps and suggested specific improvements that made my resume stand out.',
  },
  {
    name: 'Vikram Singh',
    position: 'Frontend Developer',
    content:
      'The resume optimization tool helped me showcase my React and Next.js skills effectively. I received interview calls from top startups within days of updating my resume.',
  },
  {
    name: 'Neha Gupta',
    position: 'Marketing Specialist',
    content:
      'Even for non-technical roles, JobCraft was extremely helpful. It helped me quantify my achievements and highlight relevant experience for each application.',
  },
  {
    name: 'Arjun Reddy',
    position: 'DevOps Engineer',
    content:
      'The platform suggested specific certifications that would enhance my profile. After adding those to my resume, I saw a 40% increase in response rate from recruiters.',
  },
  {
    name: 'Meera Kapoor',
    position: 'UX Designer',
    content:
      'The AI feedback on my portfolio and resume helped me present my design process more effectively. I landed interviews with top design teams thanks to JobCraft.',
  },
  {
    name: 'Rajesh Kumar',
    position: 'Data Analyst',
    content:
      'The skill gap analysis was eye-opening. JobCraft identified exactly what I needed to add to my resume to match the job descriptions I was targeting.',
  },
  {
    name: 'Deepika Mehta',
    position: 'HR Manager',
    content:
      'As someone who reviews hundreds of resumes, I recommend JobCraft to all job seekers. The AI suggestions align perfectly with what recruiters look for in candidates.',
  },
];

const TestimonialsSection = () => {
  // Initialize Embla Carousel with autoplay plugin
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'start',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 }
    }
  }, [Autoplay({ delay: 5000, stopOnInteraction: true })]);
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="bg-gradient-to-br from-primary-blue via-primary-blue to-blue-900 py-24 text-pure-white relative overflow-hidden">
      {/* Enhanced decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.05, 0.03],
            rotate: 360
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-gradient-radial from-primary-yellow to-transparent opacity-30 rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.02, 0.04, 0.02],
            rotate: -360
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1/4 -left-1/4 w-[1000px] h-[1000px] bg-gradient-radial from-light-blue to-transparent opacity-20 rounded-full"
        />

        {/* Enhanced grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" 
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
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
            className="mb-4 inline-flex items-center rounded-full border border-white/30 bg-white/5 px-3 py-1 text-sm text-primary-yellow"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="mr-1.5 h-4 w-4">
              <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
            </svg>
            Testimonials
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-4 text-3xl font-bold text-pure-white md:text-4xl lg:text-5xl"
          >
            Success <span className="text-primary-yellow">Stories</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-16 text-lg text-gray-300"
          >
            See how JobCraft.in has helped job seekers across India land their dream jobs
          </motion.p>
        </div>

        {/* Enhanced Embla Carousel */}
        <div className="overflow-hidden -mx-4" ref={emblaRef}>
          <div className="flex">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="flex-[0_0_100%] min-w-0 px-4 md:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 % 0.3 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    y: -8,
                    transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] }
                  }}
                  className="rounded-2xl bg-gradient-to-b from-white/15 to-white/5 p-8 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden group h-full"
                >
                  {/* Card shine effect on hover */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 duration-700 transition-opacity bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full"
                    style={{
                      backgroundSize: '200% 100%',
                      transition: 'transform 0.7s ease'
                    }}
                  />
                
                  {/* Enhanced quote icon with animation */}
                  <motion.div 
                    initial={{ rotate: 0 }}
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute -top-2 -left-2 text-primary-yellow opacity-20 transform scale-150 group-hover:opacity-30 transition-all duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/>
                    </svg>
                  </motion.div>
                  
                  <div className="mb-6">
                    {/* Enhanced star rating with animation */}
                    <div className="flex text-primary-yellow mb-4 gap-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            delay: i * 0.1,
                            type: "spring",
                            stiffness: 400,
                            damping: 10
                          }}
                          whileHover={{ 
                            scale: 1.3, 
                            rotate: [0, 15, -15, 0],
                            transition: { 
                              rotate: { duration: 0.5, ease: "easeInOut", repeat: 0 }
                            }
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-5 w-5 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-[360deg]"
                            style={{
                              filter: 'drop-shadow(0 0 5px rgba(252, 211, 77, 0.5))'
                            }}
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-gray-200 italic relative z-10 leading-relaxed">
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="text-primary-yellow/80 text-xl font-serif mr-1.5 inline-block"
                      >"</motion.span>
                      {testimonial.content}
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                        className="text-primary-yellow/80 text-xl font-serif ml-1.5 inline-block"
                      >"</motion.span>
                    </p>
                  </div>
                  
                  {/* Enhanced profile section */}
                  <div className="flex items-center mt-auto relative z-10">
                    <div>
                      <motion.h3 
                        className="text-lg font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent group-hover:from-primary-yellow/90 group-hover:to-white transition-all duration-300"
                      >
                        {testimonial.name}
                      </motion.h3>
                      <p className="text-sm text-primary-yellow font-medium">
                        {testimonial.position}
                      </p>
                    </div>
                  </div>
                  
                  {/* Enhanced decorative elements */}
                  <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-gradient-to-br from-primary-yellow/20 to-transparent rounded-full blur-2xl opacity-30 group-hover:opacity-40 group-hover:scale-110 transition-all duration-300" />
                  <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-light-blue/20 to-transparent rounded-full blur-2xl opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-300" />
                </motion.div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Enhanced navigation controls */}
        <div className="flex justify-center items-center mt-12 space-x-6">
          <motion.button 
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollPrev}
            className="p-3 rounded-full bg-white/10 text-pure-white hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/10 shadow-lg relative overflow-hidden group"
            aria-label="Previous slide"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-yellow/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 relative z-10">
              <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
            </svg>
          </motion.button>
          
          <div className="flex space-x-3">
            {scrollSnaps.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => scrollTo(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === selectedIndex 
                    ? 'bg-primary-yellow w-6 shadow-[0_0_15px_rgba(252,211,77,0.7)]' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.1, x: 2 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollNext}
            className="p-3 rounded-full bg-white/10 text-pure-white hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/10 shadow-lg relative overflow-hidden group"
            aria-label="Next slide"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-yellow/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 relative z-10">
              <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
            </svg>
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 