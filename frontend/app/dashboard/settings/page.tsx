'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useToast, ToastType } from '@/components/Toast';
import { doc, setDoc, getDoc, Firestore } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { updatePassword, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [reAuthModalOpen, setReAuthModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [actionType, setActionType] = useState<'delete' | 'password' | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  
  const [emailNotifications, setEmailNotifications] = useState({
    newFeatures: true,
    resumeTips: true,
    jobAlerts: false,
    marketingEmails: false,
  });
  
  // Fetch user settings from Firestore when component mounts
  useEffect(() => {
    const fetchUserSettings = async () => {
      if (!user) return;
      
      try {
        // Make sure db is not null before creating a document reference
        if (db) {
          const userSettingsRef = doc(db as Firestore, 'userSettings', user.uid);
          const docSnap = await getDoc(userSettingsRef);
          
          if (docSnap.exists() && docSnap.data().emailNotifications) {
            setEmailNotifications(docSnap.data().emailNotifications);
          }
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        showToast(ToastType.ERROR, 'Failed to load your settings');
      }
    };
    
    fetchUserSettings();
  }, [user, showToast]);
  
  const handleEmailSettingChange = (setting: string) => {
    setEmailNotifications({
      ...emailNotifications,
      [setting]: !emailNotifications[setting as keyof typeof emailNotifications],
    });
  };
  
  const handleSaveSettings = async () => {
    if (!user || !db) {
      showToast(ToastType.ERROR, 'You must be logged in to save settings');
      return;
    }
    
    setLoading(true);
    
    try {
      // Save to Firestore with proper casting
      const userSettingsRef = doc(db as Firestore, 'userSettings', user.uid);
      await setDoc(userSettingsRef, {
        emailNotifications,
        updatedAt: new Date()
      }, { merge: true });
      
      showToast(ToastType.SUCCESS, 'Settings saved successfully');
    } catch (error) {
      console.error("Error saving settings:", error);
      showToast(ToastType.ERROR, 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChangePassword = () => {
    setPasswordModalOpen(true);
  };
  
  const confirmChangePassword = async () => {
    if (!user) return;
    
    if (newPassword !== confirmPassword) {
      showToast(ToastType.ERROR, 'Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      showToast(ToastType.ERROR, 'Password must be at least 6 characters');
      return;
    }
    
    setActionType('password');
    setReAuthModalOpen(true);
  };
  
  const handleExportData = async () => {
    if (!user || !db) return;
    
    setLoading(true);
    try {
      // Fetch user data from Firestore with proper type casting
      const userSettingsRef = doc(db as Firestore, 'userSettings', user.uid);
      const userResumesRef = doc(db as Firestore, 'resumes', user.uid);
      
      const settingsSnap = await getDoc(userSettingsRef);
      const resumesSnap = await getDoc(userResumesRef);
      
      // Combine data
      const userData = {
        profile: {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: user.metadata.creationTime
        },
        settings: settingsSnap.exists() ? settingsSnap.data() : {},
        resumes: resumesSnap.exists() ? resumesSnap.data() : {}
      };
      
      // Create and download JSON file
      const dataStr = JSON.stringify(userData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `jobcraft-data-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      showToast(ToastType.SUCCESS, 'Your data has been exported');
    } catch (error) {
      console.error("Error exporting data:", error);
      showToast(ToastType.ERROR, 'Failed to export your data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteAccount = () => {
    setActionType('delete');
    setReAuthModalOpen(true);
  };
  
  const confirmAction = async () => {
    if (!user || !password) return;
    
    setLoading(true);
    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email!, password);
      await reauthenticateWithCredential(user, credential);
      
      if (actionType === 'delete') {
        // Delete user account
        await deleteUser(user);
        showToast(ToastType.SUCCESS, 'Your account has been deleted');
        router.push('/'); 
      } else if (actionType === 'password') {
        // Change password
        await updatePassword(user, newPassword);
        showToast(ToastType.SUCCESS, 'Password changed successfully');
        setPasswordModalOpen(false);
      }
      
      setReAuthModalOpen(false);
    } catch (error) {
      console.error("Error:", error);
      showToast(ToastType.ERROR, 'Authentication failed. Please check your password.');
    } finally {
      setLoading(false);
      setPassword('');
    }
  };
  
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold text-deep-blue">Settings</h1>
        <button
          onClick={handleSaveSettings}
          disabled={loading}
          className={`px-6 py-2.5 ${loading ? 'bg-gray-400' : 'bg-accent-orange hover:bg-accent-orange/90'} text-white rounded-lg transition-all duration-200 transform hover:-translate-y-1 shadow-md flex items-center space-x-2`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex px-6">
            <button className="px-6 py-4 text-sm font-medium border-b-2 border-accent-orange text-accent-orange relative">
              Account Settings
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-accent-orange to-yellow-400"></span>
            </button>
          </nav>
        </div>
        
        <div className="p-8 space-y-10">
          {/* Email Notifications */}
          <div className="transition-all duration-300 hover:shadow-md p-6 rounded-lg border border-gray-100">
            <h2 className="text-lg font-semibold text-deep-blue mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-accent-orange" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Email Notifications
            </h2>
            <div className="space-y-5">
              {Object.entries(emailNotifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg transition-all duration-200 hover:bg-gray-100">
                  <label htmlFor={`email-${key}`} className="text-sm text-gray-700 flex-1">
                    <div className="font-medium">
                      {key === 'newFeatures' && 'New features and updates'}
                      {key === 'resumeTips' && 'Resume tips and improvement suggestions'}
                      {key === 'jobAlerts' && 'Job alerts based on your resume'}
                      {key === 'marketingEmails' && 'Marketing emails and promotions'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {key === 'newFeatures' && 'Stay updated with the latest features and improvements'}
                      {key === 'resumeTips' && 'Receive personalized suggestions to improve your resume'}
                      {key === 'jobAlerts' && 'Get notified about job opportunities matching your profile'}
                      {key === 'marketingEmails' && 'Receive promotional content and special offers'}
                    </div>
                  </label>
                  <div className="relative inline-block w-14 align-middle select-none ml-6">
                    <input
                      type="checkbox"
                      id={`email-${key}`}
                      checked={value}
                      onChange={() => handleEmailSettingChange(key)}
                      className="sr-only"
                      disabled={loading}
                    />
                    <div 
                      onClick={() => !loading && handleEmailSettingChange(key)}
                      className={`toggle-bg block w-14 h-7 rounded-full cursor-pointer transition-colors duration-200 ease-in-out shadow-md ${
                        value ? 'bg-accent-orange' : 'bg-gray-300'
                      }`}
                    >
                      <div 
                        className={`toggle-dot absolute top-0.5 left-0.5 bg-white w-6 h-6 rounded-full shadow-lg transition-transform duration-200 ease-in-out ${
                          value ? 'transform translate-x-7' : ''
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Account Actions */}
          <div className="transition-all duration-300 hover:shadow-md p-6 rounded-lg border border-gray-100">
            <h2 className="text-lg font-semibold text-deep-blue mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-accent-orange" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              Account Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={handleChangePassword}
                disabled={loading}
                className="p-4 bg-white border border-gray-200 rounded-lg shadow transition-all duration-200 text-gray-700 flex flex-col items-center justify-center hover:border-accent-orange hover:shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 text-accent-orange" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Change Password</span>
                <span className="text-xs text-gray-500 mt-1">Update your account password</span>
              </button>
              <button 
                onClick={handleExportData}
                disabled={loading}
                className="p-4 bg-white border border-gray-200 rounded-lg shadow transition-all duration-200 text-gray-700 flex flex-col items-center justify-center hover:border-accent-orange hover:shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 text-accent-orange" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Export My Data</span>
                <span className="text-xs text-gray-500 mt-1">Download your account data</span>
              </button>
              <button 
                onClick={handleDeleteAccount}
                disabled={loading}
                className="p-4 bg-white border border-red-200 rounded-lg shadow transition-all duration-200 text-red-600 flex flex-col items-center justify-center hover:border-red-400 hover:shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Delete Account</span>
                <span className="text-xs text-gray-500 mt-1">Permanently delete your account</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Re-authentication Modal */}
      {reAuthModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full animate-scaleIn">
            <h3 className="text-xl font-semibold mb-4 text-deep-blue">Confirm your password</h3>
            <p className="text-gray-600 mb-6">
              {actionType === 'delete' 
                ? 'For security reasons, please enter your password to delete your account.' 
                : 'For security reasons, please enter your current password to continue.'}
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your current password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-transparent"
            />
            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => {
                  setReAuthModalOpen(false);
                  setPassword('');
                }}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmAction}
                disabled={!password || loading}
                className={`px-6 py-2.5 ${!password || loading ? 'bg-gray-400' : actionType === 'delete' ? 'bg-red-500 hover:bg-red-600' : 'bg-accent-orange hover:bg-accent-orange/90'} text-white rounded-lg transition-colors flex items-center`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : actionType === 'delete' ? 'Delete Account' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Change Password Modal */}
      {passwordModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full animate-scaleIn">
            <h3 className="text-xl font-semibold mb-6 text-deep-blue">Change Password</h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                />
              </div>
              <div className="flex justify-end space-x-4 mt-8">
                <button 
                  onClick={() => {
                    setPasswordModalOpen(false);
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmChangePassword}
                  disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword || loading}
                  className={`px-6 py-2.5 ${!newPassword || !confirmPassword || newPassword !== confirmPassword || loading ? 'bg-gray-400' : 'bg-accent-orange hover:bg-accent-orange/90'} text-white rounded-lg transition-colors flex items-center`}
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add custom styles for toggle switches and animations */}
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
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
} 