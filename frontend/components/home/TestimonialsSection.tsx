'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Priya Sharma',
    position: 'Software Engineer',
    company: 'TCS',
    image: '/testimonials/testimonial-1.jpg',
    content:
      'Job Craft helped me optimize my resume for tech roles. The AI feedback was spot-on and helped me highlight the right skills. I got calls from 3 companies within a week!',
  },
  {
    name: 'Rahul Verma',
    position: 'Product Manager',
    company: 'Flipkart',
    image: '/testimonials/testimonial-2.jpg',
    content:
      'The detailed analysis of my resume against job descriptions was eye-opening. I was able to tailor my applications much better and landed my dream job at Flipkart.',
  },
  {
    name: 'Ananya Patel',
    position: 'Data Scientist',
    company: 'Amazon',
    image: '/testimonials/testimonial-3.jpg',
    content:
      'As someone transitioning into data science, Job Craft was invaluable. It helped me identify skill gaps and suggested specific improvements that made my resume stand out.',
  },
];

const TestimonialsSection = () => {
  return (
    <section className="bg-gradient-to-br from-deep-blue via-[#1a3a5f] to-[#0d1b2a] py-20 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Success Stories
          </h2>
          <p className="mb-16 text-lg text-gray-300">
            See how Job Craft has helped job seekers across India land their dream jobs
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="rounded-xl bg-white/10 p-6 backdrop-blur-sm"
            >
              <div className="mb-6 flex items-center">
                <div className="relative mr-4 h-14 w-14 overflow-hidden rounded-full">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-gray-300">
                    {testimonial.position} at {testimonial.company}
                  </p>
                </div>
              </div>
              <p className="text-gray-300">{testimonial.content}</p>
              <div className="mt-4 flex text-accent-orange">
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 