'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useToast, ToastType } from '@/components/Toast';

export default function SettingsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [emailNotifications, setEmailNotifications] = useState({
    newFeatures: true,
    resumeTips: true,
    jobAlerts: false,
    marketingEmails: false,
  });
  
  const [displayPreferences, setDisplayPreferences] = useState({
    darkMode: false,
    compactView: false,
    showScores: true,
    autoSave: true,
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    shareAnalytics: true,
    storeHistory: true,
    allowCookies: true,
  });
  
  const handleEmailSettingChange = (setting: string) => {
    setEmailNotifications({
      ...emailNotifications,
      [setting]: !emailNotifications[setting as keyof typeof emailNotifications],
    });
  };
  
  const handleDisplaySettingChange = (setting: string) => {
    setDisplayPreferences({
      ...displayPreferences,
      [setting]: !displayPreferences[setting as keyof typeof displayPreferences],
    });
  };
  
  const handlePrivacySettingChange = (setting: string) => {
    setPrivacySettings({
      ...privacySettings,
      [setting]: !privacySettings[setting as keyof typeof privacySettings],
    });
  };
  
  const handleSaveSettings = () => {
    // In a real app, this would save to the backend
    showToast(ToastType.SUCCESS, 'Settings saved successfully');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-deep-blue">Settings</h1>
        <button
          onClick={handleSaveSettings}
          className="px-4 py-2 bg-accent-orange text-white rounded-md hover:bg-accent-orange/90 transition-colors"
        >
          Save Changes
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button className="px-6 py-4 text-sm font-medium border-b-2 border-accent-orange text-accent-orange">
              Account Settings
            </button>
          </nav>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Email Notifications */}
          <div>
            <h2 className="text-lg font-semibold text-deep-blue mb-4">Email Notifications</h2>
            <div className="space-y-3">
              {Object.entries(emailNotifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <label htmlFor={`email-${key}`} className="text-sm text-gray-700">
                    {key === 'newFeatures' && 'New features and updates'}
                    {key === 'resumeTips' && 'Resume tips and improvement suggestions'}
                    {key === 'jobAlerts' && 'Job alerts based on your resume'}
                    {key === 'marketingEmails' && 'Marketing emails and promotions'}
                  </label>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      id={`email-${key}`}
                      checked={value}
                      onChange={() => handleEmailSettingChange(key)}
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    />
                    <label
                      htmlFor={`email-${key}`}
                      className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                        value ? 'bg-accent-orange' : 'bg-gray-300'
                      }`}
                    ></label>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Display Preferences */}
          <div>
            <h2 className="text-lg font-semibold text-deep-blue mb-4">Display Preferences</h2>
            <div className="space-y-3">
              {Object.entries(displayPreferences).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <label htmlFor={`display-${key}`} className="text-sm text-gray-700">
                    {key === 'darkMode' && 'Dark mode'}
                    {key === 'compactView' && 'Compact view'}
                    {key === 'showScores' && 'Show scores in analysis results'}
                    {key === 'autoSave' && 'Auto-save drafts'}
                  </label>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      id={`display-${key}`}
                      checked={value}
                      onChange={() => handleDisplaySettingChange(key)}
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    />
                    <label
                      htmlFor={`display-${key}`}
                      className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                        value ? 'bg-accent-orange' : 'bg-gray-300'
                      }`}
                    ></label>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Privacy Settings */}
          <div>
            <h2 className="text-lg font-semibold text-deep-blue mb-4">Privacy Settings</h2>
            <div className="space-y-3">
              {Object.entries(privacySettings).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <label htmlFor={`privacy-${key}`} className="text-sm text-gray-700">
                    {key === 'shareAnalytics' && 'Share anonymous usage data to improve the service'}
                    {key === 'storeHistory' && 'Store analysis history'}
                    {key === 'allowCookies' && 'Allow cookies for personalization'}
                  </label>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      id={`privacy-${key}`}
                      checked={value}
                      onChange={() => handlePrivacySettingChange(key)}
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    />
                    <label
                      htmlFor={`privacy-${key}`}
                      className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                        value ? 'bg-accent-orange' : 'bg-gray-300'
                      }`}
                    ></label>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Account Actions */}
          <div>
            <h2 className="text-lg font-semibold text-deep-blue mb-4">Account Actions</h2>
            <div className="space-y-4">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                Change Password
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                Export My Data
              </button>
              <button className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add custom styles for toggle switches */}
      <style jsx>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #fff;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #FF6B6B;
        }
        .toggle-checkbox {
          right: 0;
          transition: all 0.3s;
          border-color: #fff;
        }
        .toggle-label {
          transition: all 0.3s;
        }
      `}</style>
    </div>
  );
} 