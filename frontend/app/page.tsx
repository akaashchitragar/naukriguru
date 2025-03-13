'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import Header from '@/components/Header';
import ResumeAnalyzer from '@/components/ResumeAnalyzer';
import LoginForm from '@/components/LoginForm';
import UserProfile from '@/components/UserProfile';
import Image from 'next/image';

export default function Home() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'analyze' | 'profile'>('analyze');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-deep-blue"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray">
      <Header 
        user={user} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      
      <main>
        {!user ? (
          <>
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-deep-blue to-soft-purple py-20 px-4">
              <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium mb-6">
                      #1 Resume Analysis Tool for Job Seekers
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                      Your Resume, <span className="text-accent-orange">Perfected</span> by AI
                    </h1>
                    <p className="text-xl text-white/90 mb-8">
                      Land your dream job with AI-powered resume analysis that matches your skills to job descriptions with precision.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button className="px-8 py-3 bg-accent-orange text-white font-semibold rounded-lg hover:bg-opacity-90 transition shadow-lg transform hover:-translate-y-1">
                        Get Started Free
                      </button>
                      <button className="px-8 py-3 bg-white/10 text-white border border-white/30 font-semibold rounded-lg hover:bg-white/20 transition">
                        See How It Works
                      </button>
                    </div>
                    <div className="mt-8 flex items-center">
                      <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white"></div>
                        ))}
                      </div>
                      <div className="ml-4">
                        <p className="text-white font-medium">Join 10,000+ job seekers</p>
                        <div className="flex text-yellow-400">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="bg-white p-6 rounded-xl shadow-xl">
                      <LoginForm />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-white">
              <div className="container mx-auto max-w-6xl px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  {[
                    { value: "10,000+", label: "Job Seekers" },
                    { value: "85%", label: "Interview Success Rate" },
                    { value: "25,000+", label: "Resumes Analyzed" },
                    { value: "92%", label: "User Satisfaction" }
                  ].map((stat, index) => (
                    <div key={index} className="p-6">
                      <div className="text-3xl md:text-4xl font-bold text-deep-blue mb-2">{stat.value}</div>
                      <div className="text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 bg-white">
              <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                  <span className="inline-block px-3 py-1 bg-accent-orange/10 text-accent-orange rounded-full text-sm font-medium mb-3">How It Works</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-deep-blue mb-4">Supercharge Your Job Search</h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Our AI-powered platform analyzes your resume against job descriptions to give you the edge in your job search.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      title: "Upload Your Resume",
                      description: "Simply upload your resume in PDF or DOCX format. Our AI will parse and analyze your document within seconds.",
                      icon: (
                        <svg className="w-12 h-12 text-accent-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      )
                    },
                    {
                      title: "Add Job Description",
                      description: "Paste the job description you're interested in applying for. Our system will identify key requirements and skills.",
                      icon: (
                        <svg className="w-12 h-12 text-accent-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )
                    },
                    {
                      title: "Get Personalized Insights",
                      description: "Receive detailed feedback, a match score, and industry-specific recommendations to improve your chances of landing an interview.",
                      icon: (
                        <svg className="w-12 h-12 text-accent-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      )
                    }
                  ].map((feature, index) => (
                    <div key={index} className="bg-light-gray p-8 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="bg-white/80 w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold text-deep-blue mb-3 text-center">{feature.title}</h3>
                      <p className="text-gray-600 text-center">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 px-4 bg-deep-blue text-white">
              <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                  <span className="inline-block px-3 py-1 bg-white/10 text-white rounded-full text-sm font-medium mb-3">Why Choose Us</span>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Stand Out From The Competition</h2>
                  <p className="text-xl text-white/80 max-w-3xl mx-auto">
                    Naukri Guru gives you the competitive edge in today's challenging job market.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {[
                    {
                      title: "AI-Powered Analysis",
                      description: "Our advanced AI algorithms analyze your resume against job descriptions with precision that manual reviews can't match.",
                      icon: (
                        <svg className="w-10 h-10 text-accent-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      )
                    },
                    {
                      title: "Industry-Specific Insights",
                      description: "Get tailored recommendations based on your industry, highlighting the skills and experiences that matter most to recruiters.",
                      icon: (
                        <svg className="w-10 h-10 text-accent-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      )
                    },
                    {
                      title: "Keyword Optimization",
                      description: "Identify missing keywords and phrases that ATS systems look for, ensuring your resume passes automated screening.",
                      icon: (
                        <svg className="w-10 h-10 text-accent-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      )
                    },
                    {
                      title: "Track Your Progress",
                      description: "Save your analyses and track improvements over time as you refine your resume for different job applications.",
                      icon: (
                        <svg className="w-10 h-10 text-accent-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      )
                    }
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300">
                      <div className="mr-4 p-3 rounded-lg bg-deep-blue/50">
                        {benefit.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                        <p className="text-white/70">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 px-4 bg-light-gray">
              <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                  <span className="inline-block px-3 py-1 bg-accent-orange/10 text-accent-orange rounded-full text-sm font-medium mb-3">Success Stories</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-deep-blue mb-4">What Job Seekers Say</h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Join thousands of professionals who have improved their job application success rate.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      quote: "Naukri Guru helped me tailor my resume perfectly for a senior developer role. I got called for an interview within days!",
                      author: "Priya S.",
                      role: "Software Engineer",
                      company: "Hired at TechCorp"
                    },
                    {
                      quote: "The industry-specific recommendations were spot on. I was able to highlight skills I didn't even know were relevant.",
                      author: "Rahul M.",
                      role: "Data Scientist",
                      company: "Hired at DataInsights"
                    },
                    {
                      quote: "After using Naukri Guru for three job applications, I received interview calls for all of them. The match score feature is a game-changer!",
                      author: "Ananya K.",
                      role: "Marketing Specialist",
                      company: "Hired at BrandBoost"
                    }
                  ].map((testimonial, index) => (
                    <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 relative">
                      <div className="absolute -top-5 left-8 w-10 h-10 bg-accent-orange rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                      </div>
                      <div className="flex mb-4 text-yellow-400 mt-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                        <div>
                          <p className="font-bold text-deep-blue">{testimonial.author}</p>
                          <p className="text-gray-500 text-sm">{testimonial.role}</p>
                          <p className="text-accent-orange text-sm font-medium">{testimonial.company}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gradient-to-r from-deep-blue to-soft-purple">
              <div className="container mx-auto max-w-5xl">
                <div className="bg-white/10 backdrop-blur-sm p-10 rounded-2xl shadow-xl">
                  <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Land Your Dream Job?</h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                      Join thousands of job seekers who have improved their resume and landed interviews with Naukri Guru.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
                      <div className="flex items-center justify-center">
                        <svg className="w-6 h-6 text-accent-orange mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white">Free first analysis</span>
                      </div>
                      <div className="flex items-center justify-center">
                        <svg className="w-6 h-6 text-accent-orange mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white">No credit card required</span>
                      </div>
                      <div className="flex items-center justify-center">
                        <svg className="w-6 h-6 text-accent-orange mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white">Instant results</span>
                      </div>
                    </div>
                    <button className="px-8 py-4 bg-accent-orange text-white font-semibold rounded-lg hover:bg-opacity-90 transition shadow-lg text-lg transform hover:scale-105">
                      Get Started Free
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <div className="container mx-auto py-8 px-4">
            {activeTab === 'analyze' ? <ResumeAnalyzer /> : <UserProfile />}
          </div>
        )}
      </main>
      
      <footer className="bg-deep-blue text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  className="w-8 h-8 text-accent-orange mr-2"
                >
                  <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
                  <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
                  <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
                </svg>
                <h3 className="text-xl font-bold">Naukri Guru</h3>
              </div>
              <p className="text-white/70 mb-4">AI-powered resume analysis for job seekers.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-white/70 hover:text-accent-orange transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-white/70 hover:text-accent-orange transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.668-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" className="text-white/70 hover:text-accent-orange transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-white/70">
                <li className="hover:text-white transition-colors"><a href="#">Resume Analysis</a></li>
                <li className="hover:text-white transition-colors"><a href="#">Job Matching</a></li>
                <li className="hover:text-white transition-colors"><a href="#">Skill Recommendations</a></li>
                <li className="hover:text-white transition-colors"><a href="#">Industry Insights</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-white/70">
                <li className="hover:text-white transition-colors"><a href="#">Blog</a></li>
                <li className="hover:text-white transition-colors"><a href="#">Career Tips</a></li>
                <li className="hover:text-white transition-colors"><a href="#">Resume Templates</a></li>
                <li className="hover:text-white transition-colors"><a href="#">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-white/70">
                <li className="hover:text-white transition-colors"><a href="#">About Us</a></li>
                <li className="hover:text-white transition-colors"><a href="#">Contact</a></li>
                <li className="hover:text-white transition-colors"><a href="#">Privacy Policy</a></li>
                <li className="hover:text-white transition-colors"><a href="#">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} Naukri Guru. All rights reserved.</p>
            <p className="text-white/50 text-sm mt-2 md:mt-0">Crafted with ❤️ for job seekers worldwide</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 