'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import Header from '@/components/Header';
import ResumeAnalyzer from '@/components/ResumeAnalyzer';
import LoginForm from '@/components/LoginForm';
import UserProfile from '@/components/UserProfile';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import PricingSection from '@/components/home/PricingSection';
import CTASection from '@/components/home/CTASection';
import Footer from '@/components/home/Footer';
import LoginModal from '@/components/LoginModal';

export default function Home() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'analyze' | 'profile'>('analyze');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleOpenLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-orange"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is logged in, show the app interface
  if (user) {
    return (
      <div className="min-h-screen bg-light-gray">
        <Header 
          user={user} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        
        <main className="container mx-auto py-8 px-4">
          {activeTab === 'analyze' ? <ResumeAnalyzer /> : <UserProfile />}
        </main>
        
        <Footer />
      </div>
    );
  }

  // If user is not logged in, show the marketing homepage
  return (
    <div className="min-h-screen">
      <Header 
        user={null} 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onLoginClick={handleOpenLoginModal}
      />
      
      <main>
        <HeroSection onLoginClick={handleOpenLoginModal} />
        <FeaturesSection onLoginClick={handleOpenLoginModal} />
        <HowItWorksSection onLoginClick={handleOpenLoginModal} />
        <TestimonialsSection />
        <PricingSection onLoginClick={handleOpenLoginModal} />
        <CTASection onLoginClick={handleOpenLoginModal} />
      </main>
      
      <Footer />

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={handleCloseLoginModal} />
    </div>
  );
} 