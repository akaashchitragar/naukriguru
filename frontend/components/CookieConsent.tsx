'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface CookieConsentProps {
  className?: string;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Essential cookies are always enabled
    functional: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a cookie choice
    const consentGiven = localStorage.getItem('cookieConsent');
    
    if (!consentGiven) {
      // Only show the banner if consent hasn't been given yet
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000); // Delay the appearance for better UX
      
      return () => clearTimeout(timer);
    } else {
      // If consent was given, parse and set the saved preferences
      try {
        const savedPreferences = JSON.parse(consentGiven);
        if (savedPreferences && typeof savedPreferences === 'object') {
          setPreferences(prev => ({
            ...prev,
            ...savedPreferences
          }));
        }
      } catch (e) {
        console.error('Error parsing saved cookie preferences', e);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    setPreferences(allAccepted);
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    setIsVisible(false);
    setIsSettingsOpen(false);
  };

  const handlePreferenceChange = (key: keyof typeof preferences) => {
    if (key === 'essential') return; // Essential cookies cannot be disabled
    
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className={`fixed bottom-0 left-0 right-0 z-50 ${className}`}
        >
          <div className="bg-primary-blue text-white shadow-lg border-t border-primary-yellow/20">
            <div className="container mx-auto px-4 py-4">
              {!isSettingsOpen ? (
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-primary-yellow mb-1">We Value Your Privacy</h3>
                    <p className="text-sm text-gray-300">
                      We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                      By clicking "Accept All", you consent to our use of cookies. Visit our{' '}
                      <Link href="/cookies" className="text-primary-yellow hover:underline">
                        Cookie Policy
                      </Link>{' '}
                      to learn more.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                    <button
                      onClick={toggleSettings}
                      className="px-4 py-2 text-sm bg-transparent border border-gray-500 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      Cookie Settings
                    </button>
                    <button
                      onClick={handleAcceptAll}
                      className="px-4 py-2 text-sm bg-primary-yellow text-primary-blue font-medium rounded-lg hover:bg-dark-yellow transition-colors"
                    >
                      Accept All
                    </button>
                  </div>
                </div>
              ) : (
                <div className="animate-fadeIn">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-primary-yellow">Cookie Preferences</h3>
                    <button 
                      onClick={toggleSettings}
                      className="text-gray-300 hover:text-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="font-medium">Essential Cookies</p>
                        <p className="text-sm text-gray-300">Necessary for the website to function properly. Always enabled.</p>
                      </div>
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={preferences.essential}
                          disabled
                          className="sr-only"
                        />
                        <div className="h-6 w-11 bg-gray-500 rounded-full opacity-50"></div>
                        <div className="absolute h-4 w-4 left-1 bg-white rounded-full"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="font-medium">Functional Cookies</p>
                        <p className="text-sm text-gray-300">Enable personalized features and remember your preferences.</p>
                      </div>
                      <div 
                        className="relative flex items-center cursor-pointer"
                        onClick={() => handlePreferenceChange('functional')}
                      >
                        <input
                          type="checkbox"
                          checked={preferences.functional}
                          onChange={() => {}}
                          className="sr-only"
                        />
                        <div className={`h-6 w-11 rounded-full transition ${preferences.functional ? 'bg-primary-yellow' : 'bg-gray-500'}`}></div>
                        <div className={`absolute h-4 w-4 rounded-full bg-white transition-all ${preferences.functional ? 'left-6' : 'left-1'}`}></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="font-medium">Analytics Cookies</p>
                        <p className="text-sm text-gray-300">Help us understand how visitors interact with our website.</p>
                      </div>
                      <div 
                        className="relative flex items-center cursor-pointer"
                        onClick={() => handlePreferenceChange('analytics')}
                      >
                        <input
                          type="checkbox"
                          checked={preferences.analytics}
                          onChange={() => {}}
                          className="sr-only"
                        />
                        <div className={`h-6 w-11 rounded-full transition ${preferences.analytics ? 'bg-primary-yellow' : 'bg-gray-500'}`}></div>
                        <div className={`absolute h-4 w-4 rounded-full bg-white transition-all ${preferences.analytics ? 'left-6' : 'left-1'}`}></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="font-medium">Marketing Cookies</p>
                        <p className="text-sm text-gray-300">Used to track visitors across websites for advertising purposes.</p>
                      </div>
                      <div 
                        className="relative flex items-center cursor-pointer"
                        onClick={() => handlePreferenceChange('marketing')}
                      >
                        <input
                          type="checkbox"
                          checked={preferences.marketing}
                          onChange={() => {}}
                          className="sr-only"
                        />
                        <div className={`h-6 w-11 rounded-full transition ${preferences.marketing ? 'bg-primary-yellow' : 'bg-gray-500'}`}></div>
                        <div className={`absolute h-4 w-4 rounded-full bg-white transition-all ${preferences.marketing ? 'left-6' : 'left-1'}`}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={toggleSettings}
                      className="px-4 py-2 text-sm bg-transparent border border-gray-500 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSavePreferences}
                      className="px-4 py-2 text-sm bg-primary-yellow text-primary-blue font-medium rounded-lg hover:bg-dark-yellow transition-colors"
                    >
                      Save Preferences
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent; 