'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

// Expanded testimonials array with more entries
const testimonials = [
  {
    name: 'Priya Sharma',
    position: 'Software Engineer',
    company: 'TCS',
    image: 'https://randomuser.me/api/portraits/women/79.jpg',
    content:
      'Job Craft helped me optimize my resume for tech roles. The AI feedback was spot-on and helped me highlight the right skills. I got calls from 3 companies within a week!',
  },
  {
    name: 'Rahul Verma',
    position: 'Product Manager',
    company: 'Flipkart',
    image: 'https://randomuser.me/api/portraits/men/75.jpg',
    content:
      'The detailed analysis of my resume against job descriptions was eye-opening. I was able to tailor my applications much better and landed my dream job at Flipkart.',
  },
  {
    name: 'Ananya Patel',
    position: 'Data Scientist',
    company: 'Amazon',
    image: 'https://randomuser.me/api/portraits/women/63.jpg',
    content:
      'As someone transitioning into data science, Job Craft was invaluable. It helped me identify skill gaps and suggested specific improvements that made my resume stand out.',
  },
  {
    name: 'Vikram Singh',
    position: 'Frontend Developer',
    company: 'Swiggy',
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
    content:
      'The resume optimization tool helped me showcase my React and Next.js skills effectively. I received interview calls from top startups within days of updating my resume.',
  },
  {
    name: 'Neha Gupta',
    position: 'Marketing Specialist',
    company: 'Zomato',
    image: 'https://randomuser.me/api/portraits/women/28.jpg',
    content:
      'Even for non-technical roles, Job Craft was extremely helpful. It helped me quantify my achievements and highlight relevant experience for each application.',
  },
  {
    name: 'Arjun Reddy',
    position: 'DevOps Engineer',
    company: 'Infosys',
    image: 'https://randomuser.me/api/portraits/men/36.jpg',
    content:
      'The platform suggested specific certifications that would enhance my profile. After adding those to my resume, I saw a 40% increase in response rate from recruiters.',
  },
  {
    name: 'Meera Kapoor',
    position: 'UX Designer',
    company: 'MakeMyTrip',
    image: 'https://randomuser.me/api/portraits/women/33.jpg',
    content:
      'The AI feedback on my portfolio and resume helped me present my design process more effectively. I landed interviews with top design teams thanks to Job Craft.',
  },
  {
    name: 'Rajesh Kumar',
    position: 'Data Analyst',
    company: 'PhonePe',
    image: 'https://randomuser.me/api/portraits/men/22.jpg',
    content:
      'The skill gap analysis was eye-opening. Job Craft identified exactly what I needed to add to my resume to match the job descriptions I was targeting.',
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
    <section className="bg-gradient-primary py-20 text-pure-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute top-0 left-0 text-primary-yellow opacity-10 h-64 w-64" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M44.3,-76.1C59.9,-69.5,76.9,-60.9,86.1,-47.1C95.3,-33.3,96.7,-14.3,93.8,3.4C90.9,21.1,83.7,37.5,72.6,50.2C61.5,62.9,46.5,71.9,30.8,76.8C15.1,81.7,-1.3,82.5,-16.9,78.5C-32.5,74.5,-47.4,65.7,-59.3,53.7C-71.2,41.7,-80.1,26.5,-83.1,10.1C-86.1,-6.3,-83.2,-23.9,-75.2,-38.6C-67.2,-53.3,-54.1,-65.1,-39.7,-72.3C-25.3,-79.5,-9.6,-82.1,3.9,-88.5C17.4,-94.9,28.7,-82.7,44.3,-76.1Z" transform="translate(100 100)" />
        </svg>
        <svg className="absolute bottom-0 right-0 text-light-blue opacity-10 h-96 w-96" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
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
            See how Job Craft has helped job seekers across India land their dream jobs
          </motion.p>
        </div>

        {/* Embla Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="flex-[0_0_100%] min-w-0 pl-4 md:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 % 0.3 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    y: -8,
                    transition: { duration: 0.3 }
                  }}
                  className="rounded-2xl bg-white/10 p-8 backdrop-blur-sm border border-white/10 shadow-xl relative overflow-hidden group h-full"
                >
                  {/* Quote icon */}
                  <div className="absolute -top-2 -left-2 text-primary-yellow opacity-20 transform scale-150 group-hover:opacity-30 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/>
                    </svg>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex text-primary-yellow mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-5 w-5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-300 italic relative z-10">"{testimonial.content}"</p>
                  </div>
                  
                  <div className="flex items-center mt-auto">
                    <div className="relative mr-4 h-16 w-16 overflow-hidden rounded-full border-2 border-primary-yellow/30">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                      <p className="text-sm text-primary-yellow">
                        {testimonial.position}
                      </p>
                      <p className="text-xs text-gray-300">
                        {testimonial.company}
                      </p>
                    </div>
                  </div>
                  
                  {/* Decorative corner element */}
                  <svg className="absolute bottom-0 right-0 h-24 w-24 text-primary-yellow opacity-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="95" cy="95" r="60" fill="currentColor" />
                  </svg>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Navigation controls */}
        <div className="flex justify-center items-center mt-10 space-x-4">
          <button 
            onClick={scrollPrev}
            className="p-3 rounded-full bg-white/10 text-pure-white hover:bg-white/20 transition-colors"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
            </svg>
          </button>
          
          <div className="flex space-x-2">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === selectedIndex ? 'bg-primary-yellow' : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          <button 
            onClick={scrollNext}
            className="p-3 rounded-full bg-white/10 text-pure-white hover:bg-white/20 transition-colors"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 