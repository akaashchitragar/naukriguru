'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import Header from '@/components/Header';
import ResumeAnalyzer from '@/components/ResumeAnalyzer';
import LoginForm from '@/components/LoginForm';
import UserProfile from '@/components/UserProfile';

export default function Home() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'analyze' | 'profile'>('analyze');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      
      <main className="container mx-auto py-8 px-4">
        {!user ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h1 className="text-3xl font-bold text-indigo-800 mb-4">
                Naukri Guru - AI Resume Analysis
              </h1>
              <p className="text-lg text-gray-700 mb-6">
                Get your resume analyzed by AI to see how well it matches job descriptions.
                Improve your chances of landing your dream job with personalized feedback.
              </p>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-indigo-700">
                  Key Features
                </h2>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>AI-powered resume analysis</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Match score against job descriptions</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Personalized improvement suggestions</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Save and track your analyses</span>
                  </li>
                </ul>
              </div>
            </div>
            <LoginForm />
          </div>
        ) : (
          <div>
            {activeTab === 'analyze' ? <ResumeAnalyzer /> : <UserProfile />}
          </div>
        )}
      </main>
      
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Naukri Guru. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 