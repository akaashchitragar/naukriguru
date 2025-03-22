'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import { ApiClient } from '@/lib/api';
import ResumeChecklist from './ResumeChecklist';
import { useToast, ToastType } from './Toast';
import { handleAsyncOperation } from '@/lib/error-utils';
import Avatar from './Avatar';

const apiClient = new ApiClient();

// Utility function to properly format dates from Firestore
const formatFirestoreDate = (timestamp: any): string => {
  try {
    // Handle Firestore timestamp objects
    if (timestamp && typeof timestamp === 'object') {
      // Check if it's a Firestore timestamp with seconds
      if (timestamp.seconds !== undefined) {
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString();
      }
      
      // Check if it's a Firebase server timestamp that might be pending
      if (timestamp.toDate && typeof timestamp.toDate === 'function') {
        return timestamp.toDate().toLocaleDateString();
      }
    }
    
    // Handle regular Date objects or timestamp numbers
    if (timestamp) {
      const date = new Date(timestamp);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString();
      }
    }
    
    return "Invalid Date";
  } catch (e) {
    console.error("Error formatting date:", e);
    return "Invalid Date";
  }
};

interface Resume {
  id: string;
  file_name: string;
  file_url: string;
  created_at: any;
}

interface Analysis {
  id: string;
  resume_id: string;
  job_description: string;
  match_score: number;
  created_at: any;
}

interface UserProfileProps {
  initialActiveTab?: 'profile-edit' | 'account-settings';
}

export default function UserProfile({ initialActiveTab = 'profile-edit' }: UserProfileProps) {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profilePicInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'profile-edit' | 'account-settings'>(initialActiveTab);
  
  // Profile editing states
  const [displayName, setDisplayName] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [uploadingProfilePic, setUploadingProfilePic] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const expectedDeleteText = 'delete my account';

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
    }
  }, [user]);

  useEffect(() => {
    async function fetchUserData() {
      if (user) {
        await handleAsyncOperation(
          async () => {
            const userResumes = await apiClient.getUserResumes();
            setResumes(userResumes);
            return { userResumes };
          },
          {
            setLoading,
            showToast,
            errorMessage: 'Failed to load user data'
          }
        );
      }
    }

    fetchUserData();
  }, [user, showToast]);

  const handleDeleteResume = async (resumeId: string) => {
    await handleAsyncOperation(
      async () => {
        const success = await apiClient.deleteResume(resumeId);
        if (success) {
          setResumes(prevResumes => prevResumes.filter(resume => resume.id !== resumeId));
        }
        return success;
      },
      {
        showToast,
        successMessage: 'Resume deleted successfully',
        errorMessage: 'Failed to delete resume'
      }
    );
  };

  const handleAnalyzeResume = (resumeId: string) => {
    // Navigate to analysis page or open analysis modal
    showToast(ToastType.INFO, `Preparing to analyze resume ${resumeId}...`);
    // Implementation depends on your app's navigation
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      showToast(ToastType.ERROR, 'Please upload a PDF file');
      return;
    }
    
    await handleAsyncOperation(
      async () => {
        const newResume = await apiClient.uploadResume(file);
        setResumes(prev => [newResume, ...prev]);
        return newResume;
      },
      {
        setLoading: setUploading,
        showToast,
        successMessage: 'Resume uploaded successfully',
        errorMessage: 'Failed to upload resume'
      }
    );
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsUpdatingProfile(true);
    
    try {
      // Update the user profile in Firebase Auth
      const { updateProfile } = await import('firebase/auth');
      await updateProfile(user, {
        displayName: displayName
      });
      
      showToast(ToastType.SUCCESS, 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast(ToastType.ERROR, 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleProfilePicClick = () => {
    profilePicInputRef.current?.click();
  };

  const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    setUploadingProfilePic(true);
    
    try {
      // Create a storage reference
      const { getStorage, ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      const { updateProfile } = await import('firebase/auth');
      const storage = getStorage();
      
      // Create a reference to the user's profile picture
      const profilePicRef = ref(storage, `profile_pics/${user.uid}`);
      
      // Upload the file
      await uploadBytes(profilePicRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(profilePicRef);
      
      // Update the user profile with the new photo URL
      await updateProfile(user, {
        photoURL: downloadURL
      });
      
      showToast(ToastType.SUCCESS, 'Profile picture updated');
      
      // Force a refresh to show the new profile picture
      window.location.reload();
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      showToast(ToastType.ERROR, 'Failed to update profile picture');
    } finally {
      setUploadingProfilePic(false);
      if (profilePicInputRef.current) {
        profilePicInputRef.current.value = '';
      }
    }
  };

  const handleChangePassword = async () => {
    if (!user || !user.email) return;
    
    setIsChangingPassword(true);
    
    try {
      const { sendPasswordResetEmail, getAuth } = await import('firebase/auth');
      const auth = getAuth();
      
      await sendPasswordResetEmail(auth, user.email);
      showToast(ToastType.SUCCESS, 'Password reset email sent. Check your inbox to complete the process.');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      showToast(ToastType.ERROR, 'Failed to send password reset email');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setIsDeletingAccount(true);
    
    try {
      // Delete user from Firebase Auth
      await user.delete();
      
      showToast(ToastType.SUCCESS, 'Your account has been deleted successfully');
      
      // Redirect to home page after successful deletion
      window.location.href = '/';
    } catch (error: any) {
      console.error('Error deleting account:', error);
      
      // If account deletion fails due to recent login requirement
      if (error.code === 'auth/requires-recent-login') {
        showToast(ToastType.ERROR, 'For security reasons, please sign out and log in again before deleting your account');
        setShowDeleteConfirm(false);
      } else {
        showToast(ToastType.ERROR, 'Failed to delete your account');
      }
    } finally {
      setIsDeletingAccount(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-0 bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Profile Header with gradient background */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-800 px-8 py-10 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center">
            <div className="relative">
              <Avatar 
                user={user} 
                size="lg" 
                className="mr-6 ring-4 ring-white/30 shadow-xl" 
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">{user.displayName || 'My Profile'}</h2>
              <p className="text-blue-100">{user.email}</p>
              <p className="text-sm text-blue-200 mt-1">Member since {user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-200 flex items-center gap-2 hover:shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>

      {/* Tabs Navigation - Modern Underline Style */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex px-8">
          <button
            onClick={() => setActiveTab('profile-edit')}
            className={`relative py-4 px-6 text-sm font-medium transition-colors duration-200 focus:outline-none ${
              activeTab === 'profile-edit' ? 'text-primary-blue' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Edit Profile
            {activeTab === 'profile-edit' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-blue to-accent-blue transform scale-x-100 transition-transform duration-200"></span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('account-settings')}
            className={`relative py-4 px-6 text-sm font-medium transition-colors duration-200 focus:outline-none ${
              activeTab === 'account-settings' ? 'text-primary-blue' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Account Settings
            {activeTab === 'account-settings' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-blue to-accent-blue transform scale-x-100 transition-transform duration-200"></span>
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-8">
        {activeTab === 'profile-edit' && (
        <div className="animate-fadeIn">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-8 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-accent-orange" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Profile
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
              {/* Profile Picture Section */}
              <div className="md:col-span-2">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg flex flex-col items-center transition-transform duration-300 hover:shadow-md">
                  <div className="relative group mb-6">
                    <div className="relative flex flex-col items-center">
                      <Avatar user={user} size="lg" className="w-24 h-24 ring-4 ring-white shadow-md mb-4" />
                      {uploadingProfilePic && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full">
                          <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 text-center">{user.displayName || 'Your Name'}</h3>
                    <p className="text-sm text-gray-500 text-center">{user.email}</p>
                  </div>
                  
                  <button 
                    onClick={handleProfilePicClick}
                    className="mt-2 w-full py-2 px-4 bg-white border border-gray-200 text-primary-blue rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center shadow-sm hover:shadow-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    Change Profile Picture
                  </button>
                  <p className="mt-4 text-xs text-center text-gray-500 px-4">
                    Upload a professional photo to personalize your profile. JPG, PNG or GIF formats accepted.
                  </p>
                </div>
              </div>
              
              {/* Form Section */}
              <div className="md:col-span-3">
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-md font-medium text-gray-700 mb-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      Personal Information
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                          Display Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="displayName"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue outline-none transition-colors"
                            placeholder="Enter your name"
                          />
                          <div className="absolute left-3 top-3 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">This name will be displayed on your profile and all your activities</p>
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            id="email"
                            value={user.email || ''}
                            disabled
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 bg-gray-50 rounded-lg text-gray-500 cursor-not-allowed"
                          />
                          <div className="absolute left-3 top-3 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                          </div>
                        </div>
                        <div className="mt-1 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          <p className="text-xs text-gray-500">Email cannot be changed for security reasons</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isUpdatingProfile || !displayName}
                      className={`w-full py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center ${
                        isUpdatingProfile || !displayName
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-primary-blue text-white hover:bg-primary-blue/90 shadow-md hover:shadow-lg transform hover:-translate-y-1'
                      }`}
                    >
                      {isUpdatingProfile ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Updating Profile...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h1a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h1v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                          </svg>
                          Save Profile Changes
                        </>
                      )}
                    </button>
                    
                    <div className="mt-4 text-center">
                      <p className="text-xs text-gray-500">
                        Your profile information is securely stored and only visible to you and the JobCraft team
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          <input
            type="file"
            ref={profilePicInputRef}
            onChange={handleProfilePicChange}
            accept="image/*"
            className="hidden"
          />
        </div>
        )}

        {activeTab === 'account-settings' && (
        <div className="animate-fadeIn">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-8 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-accent-orange" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              Account Actions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Change Password */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md flex flex-col items-center text-center">
                <div className="mb-4 bg-yellow-100 p-4 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">Change Password</h3>
                <p className="text-sm text-gray-500 mb-4">Update your account password</p>
                
                <button 
                  onClick={handleChangePassword}
                  disabled={isChangingPassword}
                  className={`mt-auto w-full py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center ${
                    isChangingPassword
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-yellow-500 text-white hover:bg-yellow-600'
                  }`}
                >
                  {isChangingPassword ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </div>
              
              {/* Delete Account */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md flex flex-col items-center text-center">
                <div className="mb-4 bg-red-100 p-4 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">Delete Account</h3>
                <p className="text-sm text-gray-500 mb-4">Permanently delete your account</p>
                
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="mt-auto w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center justify-center"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
      
      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => !isDeletingAccount && setShowDeleteConfirm(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full m-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Account Confirmation</h3>
              <p className="text-sm text-gray-500 mb-4">This action cannot be undone and all your data will be permanently lost.</p>
              
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">To confirm, please type <span className="font-bold text-red-600">delete my account</span></p>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="delete my account"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  disabled={isDeletingAccount}
                />
                
                <div className="flex flex-wrap mt-2 gap-1">
                  {expectedDeleteText.split('').map((char, index) => {
                    const isCorrect = index < deleteConfirmText.length && deleteConfirmText[index] === char;
                    const isIncorrect = index < deleteConfirmText.length && deleteConfirmText[index] !== char;
                    
                    return (
                      <span 
                        key={index}
                        className={`inline-block px-1 rounded ${
                          isCorrect 
                            ? 'bg-green-100 text-green-700' 
                            : isIncorrect 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {char === ' ' ? '\u00A0' : char}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmText('');
                }}
                disabled={isDeletingAccount}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center ${
                  isDeletingAccount || deleteConfirmText !== expectedDeleteText 
                    ? 'opacity-50 cursor-not-allowed' 
                    : ''
                }`}
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount || deleteConfirmText !== expectedDeleteText}
              >
                {isDeletingAccount ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete Account'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
} 