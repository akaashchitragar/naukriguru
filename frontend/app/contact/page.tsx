'use client';

import React, { useState } from 'react';
import SimpleHeader from '@/components/SimpleHeader';
import Footer from '@/components/home/Footer';
import { motion } from 'framer-motion';

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    // This would normally connect to a backend API
    // Simulating API call with a timeout
    setTimeout(() => {
      // Simulating successful submission
      setIsSubmitting(false);
      setSubmitted(true);
      
      // Reset form after submission
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-gray-50 flex-grow">
        <SimpleHeader />
        <main>
          <div className="relative pt-16 pb-20">
            {/* Background decorative elements */}
            <div className="absolute inset-x-0 top-0 hidden h-72 bg-gradient-to-br from-primary-blue to-secondary-blue lg:block" aria-hidden="true" />
            <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-primary-yellow opacity-10 transform -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute top-1/4 left-0 w-96 h-96 rounded-full bg-light-blue opacity-10 transform -translate-x-1/2 blur-3xl" />
            
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">Get in Touch</h1>
                <p className="mt-3 max-w-2xl mx-auto text-xl text-white/80 sm:mt-4">
                  We'd love to hear from you. Fill out the form below and our team will get back to you as soon as possible.
                </p>
              </div>
            </div>
          </div>
          
          <div className="relative -mt-12 pb-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="lg:grid lg:grid-cols-2">
                  {/* Contact form */}
                  <div className="py-10 px-6 sm:px-10 lg:col-span-1 xl:p-12">
                    <h3 className="text-2xl font-bold text-primary-blue">Send us a message</h3>
                    <p className="mt-3 text-gray-500">
                      Our team is here to help. Let us know how we can assist you with your career needs.
                    </p>
                    
                    {submitted ? (
                      <motion.div 
                        className="mt-8 bg-green-50 p-6 rounded-lg text-green-700"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <h4 className="text-lg font-medium mb-2">Thanks for reaching out!</h4>
                        <p>We've received your message and will get back to you as soon as possible.</p>
                        <button
                          onClick={() => setSubmitted(false)}
                          className="mt-4 text-primary-blue hover:text-primary-yellow font-medium transition-colors"
                        >
                          Send another message
                        </button>
                      </motion.div>
                    ) : (
                      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Full name
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            autoComplete="name"
                            required
                            value={formState.name}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue sm:text-sm"
                            placeholder="John Doe"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={formState.email}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue sm:text-sm"
                            placeholder="john@example.com"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                            Subject
                          </label>
                          <select
                            id="subject"
                            name="subject"
                            required
                            value={formState.subject}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue sm:text-sm"
                          >
                            <option value="">Please select</option>
                            <option value="General Inquiry">General Inquiry</option>
                            <option value="Product Support">Product Support</option>
                            <option value="Feedback">Feedback</option>
                            <option value="Partnership">Partnership</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                            Message
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            rows={4}
                            required
                            value={formState.message}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue sm:text-sm"
                            placeholder="How can we help you?"
                          />
                        </div>
                        
                        {error && (
                          <div className="text-red-600 text-sm">{error}</div>
                        )}
                        
                        <div>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-blue hover:bg-secondary-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue transition-colors w-full justify-center ${
                              isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                            }`}
                          >
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                  
                  {/* Contact information */}
                  <div className="bg-gradient-to-br from-primary-blue to-secondary-blue py-10 px-6 sm:px-10 lg:col-span-1 xl:p-12">
                    <h3 className="text-2xl font-bold text-white">Contact Information</h3>
                    <p className="mt-3 text-white/80">
                      Have questions? Our team is available to assist you through multiple channels.
                    </p>
                    
                    <div className="mt-8 space-y-6">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-primary-yellow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div className="ml-3 text-white">
                          <p className="text-base">+91 98765 43210</p>
                          <p className="mt-1 text-sm">Mon-Fri from 9am to 6pm IST</p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-primary-yellow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="ml-3 text-white">
                          <p className="text-base">support@jobcraft.in</p>
                          <p className="mt-1 text-sm">We'll respond within 24 hours</p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-primary-yellow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div className="ml-3 text-white">
                          <p className="text-base">Koramangala, Bengaluru</p>
                          <p className="mt-1 text-sm">Karnataka, India - 560034</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-12">
                      <h4 className="text-lg font-medium text-white">Follow Us</h4>
                      <div className="mt-4 flex space-x-4">
                        <a href="#" className="text-white hover:text-primary-yellow transition-colors">
                          <span className="sr-only">Twitter</span>
                          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                          </svg>
                        </a>

                        <a href="#" className="text-white hover:text-primary-yellow transition-colors">
                          <span className="sr-only">LinkedIn</span>
                          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                        </a>

                        <a href="#" className="text-white hover:text-primary-yellow transition-colors">
                          <span className="sr-only">Instagram</span>
                          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                          </svg>
                        </a>
                      </div>
                    </div>
                    
                    <div className="mt-12">
                      <h4 className="text-lg font-medium text-white">Business Hours</h4>
                      <dl className="mt-4 space-y-2 text-white/80">
                        <div className="flex justify-between">
                          <dt>Monday - Friday:</dt>
                          <dd>9:00 AM - 6:00 PM</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt>Saturday:</dt>
                          <dd>10:00 AM - 2:00 PM</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt>Sunday:</dt>
                          <dd>Closed</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* FAQ section */}
          <div className="bg-gray-50 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-primary-blue">Frequently Asked Questions</h2>
                <p className="mt-4 text-gray-600">
                  Find answers to commonly asked questions about JobCraft.
                </p>
              </div>
              
              <div className="mt-12 max-w-3xl mx-auto">
                <dl className="space-y-6">
                  <div className="bg-white px-6 py-4 shadow rounded-lg">
                    <dt className="text-lg font-medium text-primary-blue">How quickly will you respond to my inquiry?</dt>
                    <dd className="mt-2 text-gray-600">
                      We typically respond to all inquiries within 24 hours during business days. For urgent matters, 
                      please call our customer support number.
                    </dd>
                  </div>
                  
                  <div className="bg-white px-6 py-4 shadow rounded-lg">
                    <dt className="text-lg font-medium text-primary-blue">Do you offer customized solutions for businesses?</dt>
                    <dd className="mt-2 text-gray-600">
                      Yes, we offer enterprise solutions tailored to your organization's specific recruitment needs. 
                      Please contact our sales team for more information.
                    </dd>
                  </div>
                  
                  <div className="bg-white px-6 py-4 shadow rounded-lg">
                    <dt className="text-lg font-medium text-primary-blue">Can I request a demo before subscribing?</dt>
                    <dd className="mt-2 text-gray-600">
                      Absolutely! We offer free demos to help you understand how our platform works. 
                      Simply fill out the contact form and select "Product Support" as the subject.
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
} 