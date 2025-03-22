'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { PreloaderProvider } from '@/lib/preloader';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'analyze' | 'profile'>('analyze');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Only redirect if user is already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleOpenLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  // If user is logged in, show a minimal loading state while redirecting
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-orange"></div>
          <p className="mt-4 text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  // Always show the marketing homepage if not logged in
  return (
    <PreloaderProvider>
      <div className="min-h-screen">
        <Header 
          user={null} 
          activeTab="analyze" 
          onTabChange={() => {}}
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
    </PreloaderProvider>
  );
} 