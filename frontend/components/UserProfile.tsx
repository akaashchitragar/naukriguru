'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import { ApiClient } from '@/lib/api';
import ResumeChecklist from './ResumeChecklist';
import { useToast, ToastType } from './Toast';
import { handleAsyncOperation } from '@/lib/error-utils';

const apiClient = new ApiClient();

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

export default function UserProfile() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'analyses' | 'resumes' | 'checklist'>('analyses');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchUserData() {
      if (user) {
        await handleAsyncOperation(
          async () => {
            const [userResumes, userAnalyses] = await Promise.all([
              apiClient.getUserResumes(),
              apiClient.getUserAnalyses()
            ]);
            
            setResumes(userResumes);
            setAnalyses(userAnalyses);
            return { userResumes, userAnalyses };
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

  if (!user) {
    return null;
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-200">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="w-16 h-16 bg-deep-blue rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
            {user.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-deep-blue">{user.displayName || 'My Profile'}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500 mt-1">Member since {user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 bg-white border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('analyses')}
          className={`px-6 py-3 font-medium text-sm transition-all ${
            activeTab === 'analyses'
              ? 'text-accent-orange border-b-2 border-accent-orange'
              : 'text-gray-500 hover:text-deep-blue'
          }`}
        >
          Recent Analyses
        </button>
        <button
          onClick={() => setActiveTab('resumes')}
          className={`px-6 py-3 font-medium text-sm transition-all ${
            activeTab === 'resumes'
              ? 'text-accent-orange border-b-2 border-accent-orange'
              : 'text-gray-500 hover:text-deep-blue'
          }`}
        >
          My Resumes
        </button>
        <button
          onClick={() => setActiveTab('checklist')}
          className={`px-6 py-3 font-medium text-sm transition-all ${
            activeTab === 'checklist'
              ? 'text-accent-orange border-b-2 border-accent-orange'
              : 'text-gray-500 hover:text-deep-blue'
          }`}
        >
          Resume Checklist
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-accent-orange rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-deep-blue">Loading your data...</p>
          <p className="text-sm text-gray-500">This may take a moment</p>
        </div>
      ) : (
        <div>
          {/* Recent Analyses */}
          {activeTab === 'analyses' && (
            <div className="animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-deep-blue">
                  Recent Analyses
                </h3>
                {analyses.length > 0 && (
                  <span className="text-sm text-gray-500">
                    Showing {analyses.length} {analyses.length === 1 ? 'analysis' : 'analyses'}
                  </span>
                )}
              </div>
              
              {analyses.length > 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Resume
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Match Score
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {analyses.map((analysis) => {
                          const resume = resumes.find(r => r.id === analysis.resume_id);
                          return (
                            <tr key={analysis.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(analysis.created_at?.seconds * 1000).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                {resume?.file_name || 'Unknown'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-12 h-2 bg-gray-200 rounded-full mr-2">
                                    <div 
                                      className={`h-2 rounded-full ${
                                        analysis.match_score >= 80
                                          ? 'bg-green-500'
                                          : analysis.match_score >= 60
                                          ? 'bg-yellow-500'
                                          : 'bg-red-500'
                                      }`}
                                      style={{ width: `${analysis.match_score}%` }}
                                    ></div>
                                  </div>
                                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    analysis.match_score >= 80
                                      ? 'bg-green-100 text-green-800'
                                      : analysis.match_score >= 60
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {analysis.match_score}%
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <button className="text-deep-blue hover:text-accent-orange transition-colors">
                                  View Details
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-600 mb-2">No analyses found.</p>
                  <p className="text-sm text-gray-500 mb-4">Upload a resume and analyze it to see results here.</p>
                  <button 
                    onClick={() => {
                      setActiveTab('resumes');
                      setTimeout(() => {
                        handleUploadClick();
                      }, 100);
                    }}
                    className="px-4 py-2 bg-deep-blue text-white rounded-lg hover:bg-deep-blue/90 transition-colors"
                  >
                    Upload Resume
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Uploaded Resumes */}
          {activeTab === 'resumes' && (
            <div className="animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-deep-blue">
                  My Resumes
                </h3>
                <div className="flex items-center">
                  {uploading && (
                    <div className="mr-3">
                      <div className="w-5 h-5 border-2 border-gray-200 border-t-accent-orange rounded-full animate-spin"></div>
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="application/pdf" 
                    className="hidden" 
                  />
                  <button 
                    onClick={handleUploadClick}
                    disabled={uploading}
                    className="px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-accent-orange/90 transition-colors flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Upload New Resume
                  </button>
                </div>
              </div>
              
              {resumes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resumes.map((resume) => (
                    <div
                      key={resume.id}
                      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all hover:border-accent-orange"
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-deep-blue/10 rounded-lg flex items-center justify-center mr-4">
                          <svg
                            className="w-6 h-6 text-deep-blue"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-gray-800 truncate max-w-[200px]">
                            {resume.file_name}
                          </div>
                          <p className="text-xs text-gray-500">
                            Uploaded on{' '}
                            {new Date(resume.created_at?.seconds * 1000).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3 mt-4 pt-4 border-t border-gray-100">
                        <a
                          href={resume.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm font-medium"
                        >
                          View
                        </a>
                        <button 
                          className="flex-1 text-center py-2 bg-deep-blue text-white rounded hover:bg-deep-blue/90 transition-colors text-sm font-medium"
                          onClick={() => handleAnalyzeResume(resume.id)}
                        >
                          Analyze
                        </button>
                        <button 
                          className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded transition-colors"
                          onClick={() => handleDeleteResume(resume.id)}
                          aria-label="Delete resume"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-600 mb-2">No resumes uploaded yet.</p>
                  <p className="text-sm text-gray-500 mb-4">Upload your resume to get started with the analysis.</p>
                  <button 
                    onClick={handleUploadClick}
                    disabled={uploading}
                    className="px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-accent-orange/90 transition-colors"
                  >
                    Upload Resume
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Resume Checklist */}
          {activeTab === 'checklist' && (
            <div className="animate-fadeIn">
              <ResumeChecklist />
            </div>
          )}
        </div>
      )}
    </div>
  );
} 