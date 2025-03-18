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
  initialActiveTab?: 'resumes' | 'profile-edit';
}

export default function UserProfile({ initialActiveTab = 'resumes' }: UserProfileProps) {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profilePicInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'resumes' | 'profile-edit'>(initialActiveTab);
  
  // Profile editing states
  const [displayName, setDisplayName] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [uploadingProfilePic, setUploadingProfilePic] = useState(false);

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
            className={`relative py-4 px-6 text-sm font-medium transition-colors duration-200 focus:outline-none ${
              activeTab === 'resumes'
                ? 'text-primary-blue'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('resumes')}
          >
            My Resumes
            {activeTab === 'resumes' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-blue to-accent-blue transform scale-x-100 transition-transform duration-200"></span>
            )}
          </button>
          <button
            className={`relative py-4 px-6 text-sm font-medium transition-colors duration-200 focus:outline-none ${
              activeTab === 'profile-edit'
                ? 'text-primary-blue'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('profile-edit')}
          >
            Edit Profile
            {activeTab === 'profile-edit' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-blue to-accent-blue transform scale-x-100 transition-transform duration-200"></span>
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-8">
        {activeTab === 'resumes' && (
          <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-semibold text-gray-800">My Resumes</h2>
              <button
                onClick={handleUploadClick}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2.5 bg-accent-orange text-white rounded-lg hover:bg-accent-orange/90 transition-all duration-200 transform hover:-translate-y-1 shadow-md disabled:opacity-70 disabled:transform-none disabled:shadow-none"
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Upload New Resume</span>
                  </>
                )}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
                className="hidden"
              />
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <svg className="animate-spin h-8 w-8 text-primary-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : resumes.length === 0 ? (
              <div className="bg-gray-50 rounded-lg py-12 px-6 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No resumes uploaded yet</h3>
                <p className="text-gray-500 mb-6">Upload your first resume to get started with analysis and improvement suggestions.</p>
                <button
                  onClick={handleUploadClick}
                  className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Upload Your First Resume
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-12 gap-4 bg-gray-50 py-3 px-4 border-b border-gray-200 text-sm font-medium text-gray-500">
                  <div className="col-span-5">RESUME</div>
                  <div className="col-span-4 text-center">UPLOAD DATE</div>
                  <div className="col-span-3 text-right">ACTIONS</div>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {resumes.map((resume) => (
                    <div 
                      key={resume.id} 
                      className="grid grid-cols-12 gap-4 py-4 px-4 items-center hover:bg-gray-50 transition-colors duration-150"
                    >
                      <div className="col-span-5 flex items-center">
                        <div className="bg-blue-100 p-2 rounded mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="truncate">
                          <a 
                            href={resume.file_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-medium text-primary-blue hover:text-primary-blue/80 transition-colors"
                          >
                            {resume.file_name}
                          </a>
                        </div>
                      </div>
                      <div className="col-span-4 text-center text-gray-500">
                        {formatFirestoreDate(resume.created_at)}
                      </div>
                      <div className="col-span-3 flex justify-end space-x-2">
                        <button
                          onClick={() => handleAnalyzeResume(resume.id)}
                          className="p-2 text-primary-blue hover:bg-blue-50 rounded-full transition-colors"
                          title="Analyze Resume"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 9a2 2 0 114 0 2 2 0 01-4 0z" />
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 00-3.446 6.032l-2.261 2.26a1 1 0 101.414 1.415l2.261-2.261A4 4 0 1011 5z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <a
                          href={resume.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                          title="View Resume"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        </a>
                        <button
                          onClick={() => handleDeleteResume(resume.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete Resume"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

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
      </div>
      
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