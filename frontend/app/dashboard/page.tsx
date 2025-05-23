'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { ApiClient } from '@/lib/api';
import { useToast, ToastType } from '@/components/Toast';
import { ErrorFallback } from '@/components/ErrorFallback';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { PreloaderProvider, usePreloader } from '@/lib/preloader';
import Preloader from '@/components/Preloader';
import { getFirestore, collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';

const apiClient = new ApiClient();

interface DashboardStats {
  totalResumes: number;
  totalAnalyses: number;
  averageScore: number;
  recentAnalyses: any[];
}

function DashboardContent() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { isLoading, setIsLoading } = usePreloader();
  const [stats, setStats] = useState<DashboardStats>({
    totalResumes: 0,
    totalAnalyses: 0,
    averageScore: 0,
    recentAnalyses: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);

  const fetchDashboardData = async () => {
    // Prevent multiple fetch calls if already fetching or already fetched
    if (!user || dataFetched) return;
    
    setLoading(true);
    setError(false);
    
    try {
      // First check if API is available with more retries
      try {
        const isApiAvailable = await apiClient.checkHealth();
        
        if (!isApiAvailable) {
          console.warn('API health check failed in dashboard, continuing with fallbacks');
          // Show a warning toast but continue with fallbacks instead of showing error
          showToast(ToastType.WARNING, 'API server may be slow. Some features might be limited.', 7000);
          // Continue with the function instead of returning early
        }
      } catch (healthError) {
        console.error('API health check error in dashboard:', healthError);
        // Show a warning instead of error to allow graceful degradation
        showToast(ToastType.WARNING, 'API connectivity issues detected. Using cached data where possible.', 7000);
        // Continue with the function to use fallbacks
      }
      
      // Try to get resumes, with error handling
      let userResumes = [];
      try {
        userResumes = await apiClient.getUserResumes();
      } catch (resumeError) {
        console.error('Error fetching resumes:', resumeError);
        // Continue with empty resumes array
      }
      
      // Get analyses from Firestore like in the history page
      const db = getFirestore();
      let analysesData: any[] = [];
      
      try {
        const analysesRef = collection(db, 'resumeAnalyses');
        const q = query(
          analysesRef,
          where('userId', '==', user.uid)
          // No orderBy to avoid index error initially
        );
        
        const querySnapshot = await getDocs(q);
        analysesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Handle timestamp safely
          timestamp: doc.data().timestamp instanceof Timestamp ? 
            doc.data().timestamp.toDate() : new Date()
        }));
        
        // Sort on client side instead of using orderBy in query
        analysesData.sort((a, b) => b.timestamp - a.timestamp);
      } catch (err: any) {
        console.error('Error fetching analyses with simple query:', err);
        
        // If that fails, try to get analyses from API as fallback
        try {
          const userAnalyses = await apiClient.getUserAnalyses(5);
          if (userAnalyses && userAnalyses.length > 0) {
            analysesData = userAnalyses;
          }
        } catch (apiError) {
          console.error('Failed to get analyses from API:', apiError);
          // Continue with empty analyses array
          analysesData = [];
        }
      }
      
      // Calculate stats
      const totalResumes = userResumes.length;
      const totalAnalyses = analysesData.length;
      
      // Calculate average score only if we have analyses
      const averageScore = totalAnalyses > 0
        ? analysesData.reduce((sum, analysis) => {
            // Use matchScore from Firestore data or match_score from API
            const score = analysis.matchScore || analysis.match_score || 0;
            return sum + score;
          }, 0) / totalAnalyses
        : 0;
      
      // Format recent analyses for display, always using the most recent ones
      // Make sure we're using the latest records by sorting again
      analysesData.sort((a, b) => {
        const dateA = a.timestamp || a.created_at || new Date(0);
        const dateB = b.timestamp || b.created_at || new Date(0);
        return dateB - dateA;
      });
      
      const recentAnalyses = analysesData.slice(0, 5).map(analysis => ({
        id: analysis.id,
        resume_id: analysis.resumeId || analysis.resume_id,
        resume_name: analysis.resumeName || analysis.resume_name || 'Resume',
        match_score: analysis.matchScore || analysis.match_score || 0,
        created_at: analysis.timestamp || analysis.created_at,
        job_title: analysis.jobTitle || analysis.job_title || ''
      }));
      
      setStats({
        totalResumes,
        totalAnalyses,
        averageScore,
        recentAnalyses,
      });
      
      setLoading(false);
      setDataFetched(true);
      // Signal to preloader that it can finish loading
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showToast(ToastType.ERROR, 'Failed to load dashboard data. Please try again.');
      setError(true);
      setLoading(false);
      setDataFetched(true);
      // Even on error, we should stop the preloader
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && !dataFetched) {
      fetchDashboardData();
      
      // Set up a retry mechanism after 15 seconds if data fails to load
      // This helps recover from transient network/API issues
      const retryTimeout = setTimeout(() => {
        if (error || (loading && !dataFetched)) {
          console.log('Retrying dashboard data fetch after timeout');
          setDataFetched(false); // Reset the fetched flag to allow a retry
          fetchDashboardData();
        }
      }, 15000);
      
      return () => clearTimeout(retryTimeout);
    } else {
      // If no user, signal to preloader that we're done loading
      setIsLoading(false);
    }
  }, [user, dataFetched, error, loading]);

  // If the dashboard fails to load, but we have network connectivity,
  // let's add a "Try Mock Mode" button to help users continue
  const enableMockMode = () => {
    // Store preference in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('use_mock_api', 'true');
      // Force a page reload to apply the setting
      window.location.reload();
    }
  };

  // Only show fallback UI if we're not in the initial loading state
  if (loading && !isLoading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-8">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-gray-600">Loading dashboard data...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <ErrorFallback
        message="Failed to load dashboard data"
        secondaryMessage="There might be connectivity issues with our API server."
        onRetry={() => {
          setError(false);
          fetchDashboardData();
        }}
        actions={
          <button
            onClick={enableMockMode}
            className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
          >
            Try Mock Mode
          </button>
        }
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Message */}
      <div className="mb-6 text-center sm:text-left">
        <h2 className="text-2xl font-bold text-gray-800">Welcome back, {user?.displayName || 'there'}!</h2>
        <p className="text-gray-600">Here's an overview of your resume performance and analytics.</p>
      </div>
      
      {/* Hero Section - Resume Analyzer */}
      <div className="bg-gradient-to-r from-deep-blue to-primary-blue rounded-lg shadow-md overflow-hidden mb-6">
        <div className="px-6 py-6 sm:px-8 sm:py-8 flex flex-col md:flex-row items-center">
          <div className="flex-1 text-white mb-4 md:mb-0 md:pr-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Resume Analyzer</h1>
            <p className="text-base opacity-90 mb-4">
              Boost your job search with AI-powered resume analysis. Match your resume against job descriptions and get instant feedback.
            </p>
            <Link 
              href="/dashboard/analyze" 
              className="inline-flex items-center px-4 py-2 bg-primary-yellow rounded-md font-medium text-deep-blue hover:bg-primary-yellow/90 transition-colors shadow-sm"
            >
              Analyze My Resume
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          <div className="flex-shrink-0 w-full md:w-1/3 lg:w-1/4 hidden md:block">
            <div className="relative bg-white/10 backdrop-blur-sm rounded-lg p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-white/15 group overflow-hidden">
              {/* Background particles */}
              <div className="absolute inset-0 overflow-hidden opacity-30">
                <div className="absolute top-[10%] right-[25%] w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
                <div className="absolute top-[70%] left-[15%] w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping" style={{ animationDuration: '4s' }}></div>
                <div className="absolute top-[40%] right-[10%] w-1 h-1 bg-green-400 rounded-full animate-ping" style={{ animationDuration: '5s' }}></div>
              </div>
              
              <svg className="w-full h-auto text-white relative z-10" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Document background */}
                <rect x="30" y="20" width="140" height="120" rx="6" fill="currentColor" fillOpacity="0.15" className="transition-all duration-300" />
                
                {/* Document header */}
                <rect x="50" y="40" width="100" height="10" rx="2" fill="currentColor" className="transition-all duration-500 origin-left hover:scale-x-105" />
                
                {/* Content lines with different animation delays */}
                <rect x="50" y="60" width="80" height="6" rx="2" fill="currentColor" fillOpacity="0.6" className="transition-all duration-300 origin-left hover:translate-x-1" />
                <rect x="50" y="76" width="90" height="6" rx="2" fill="currentColor" fillOpacity="0.5" className="transition-all duration-300 origin-left hover:translate-x-1" />
                <rect x="50" y="92" width="65" height="6" rx="2" fill="currentColor" fillOpacity="0.5" className="transition-all duration-300 origin-left hover:translate-x-1" />
                <rect x="50" y="108" width="95" height="6" rx="2" fill="currentColor" fillOpacity="0.5" className="transition-all duration-300 origin-left hover:translate-x-1" />
                
                {/* Tick mark instead of AI badge */}
                <circle cx="150" cy="40" r="10" fill="#10B981" fillOpacity="0.9" />
                <path 
                  d="M146 40 L149 43 L154 37" 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  fill="none"
                />
                
                {/* Scanning animation line - single, more subtle line */}
                <line x1="30" y1="65" x2="170" y2="65" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,3" className="animate-scan" />
                
                {/* Match highlights */}
                <circle cx="40" cy="60" r="3" fill="#FFCB05" fillOpacity="0.8" className="animate-pulse" />
                <circle cx="40" cy="92" r="3" fill="#FFCB05" fillOpacity="0.8" className="animate-pulse" style={{ animationDelay: '0.7s' }} />
              </svg>
              
              {/* AI-Powered badge */}
              <div className="absolute top-2 right-2 flex items-center gap-1 px-2.5 py-1 rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 bg-gradient-to-r from-green-500 via-green-400 to-emerald-500 bg-size-200 bg-pos-0 hover:bg-pos-100 group/badge">
                <div className="relative flex h-3 w-3 mr-0.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </div>
                <span className="text-white text-xs font-bold tracking-wide">AI-Powered</span>
                <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover/badge:opacity-100 transition-opacity duration-300"></span>
              </div>
              
              {/* Matching indicator */}
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-primary-blue/90 text-white text-xs py-1 px-2.5 rounded-md opacity-80 flex items-center space-x-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span>Matching Resume</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/60 to-light-blue/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            <div className="flex items-center relative z-10">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary-blue" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Your Resumes</p>
                <h3 className="text-4xl font-bold text-gray-800 group-hover:text-primary-blue transition-colors">{stats.totalResumes}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/60 to-yellow-400/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            <div className="flex items-center relative z-10">
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-amber-200 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Analyses Completed</p>
                <h3 className="text-4xl font-bold text-gray-800 group-hover:text-amber-600 transition-colors">{stats.totalAnalyses}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/60 to-green-400/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            <div className="flex items-center relative z-10">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-emerald-200 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Average Match Score</p>
                <h3 className="text-4xl font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">
                  {stats.averageScore > 0 ? Math.round(stats.averageScore) : 0}%
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Analyses Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Analyses</h2>
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-deep-blue to-primary-blue py-4 px-6 flex justify-between items-center">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              <h2 className="text-xl font-semibold text-white">Latest Resume Analyses</h2>
            </div>
            <Link href="/dashboard/history" className="text-sm text-white/90 hover:text-white flex items-center transition-colors">
              View all
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          {stats.recentAnalyses && stats.recentAnalyses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resume / Job Title</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.recentAnalyses.map((analysis, index) => (
                    <tr key={analysis.id || index} className="hover:bg-blue-50/50 transition-colors group/row">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {analysis.created_at && typeof analysis.created_at === 'object' 
                          ? 'seconds' in analysis.created_at 
                            ? new Date(analysis.created_at.seconds * 1000).toLocaleDateString()
                            : 'toDate' in analysis.created_at && typeof analysis.created_at.toDate === 'function'
                              ? analysis.created_at.toDate().toLocaleDateString()
                              : new Date().toLocaleDateString()
                        : analysis.created_at instanceof Date 
                          ? analysis.created_at.toLocaleDateString()
                          : new Date().toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-blue" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {analysis.job_title || analysis.resume_name || 
                               (analysis.resume_id && analysis.resume_id.length > 8 
                                 ? `${analysis.resume_id.substring(0, 8)}...`
                                 : analysis.resume_id) || 
                               `Resume ${index + 1}`}
                            </div>
                            {analysis.job_title && <div className="text-xs text-gray-500 mt-0.5">
                              Position applied for
                            </div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="flex items-center mb-1">
                            <div className="w-24 bg-gray-200 rounded-full h-2.5">
                              <div 
                                className={`h-2.5 rounded-full ${
                                  analysis.match_score >= 80 ? 'bg-green-500' : 
                                  analysis.match_score >= 60 ? 'bg-yellow-500' :
                                  analysis.match_score >= 40 ? 'bg-amber-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${analysis.match_score}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900 mr-1">{analysis.match_score}%</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                              analysis.match_score >= 80 ? 'bg-green-100 text-green-800' : 
                              analysis.match_score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                              analysis.match_score >= 40 ? 'bg-amber-100 text-amber-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {analysis.match_score >= 80 ? 'Excellent' : 
                               analysis.match_score >= 60 ? 'Good' :
                               analysis.match_score >= 40 ? 'Fair' :
                               'Poor'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Link 
                          href={`/dashboard/analysis-detail/${analysis.id}`} 
                          className="inline-flex items-center px-3 py-1.5 bg-white text-primary-blue border border-primary-blue/50 rounded hover:bg-primary-blue hover:text-white text-sm font-medium transition-colors group-hover/row:border-primary-blue"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 px-6 text-center">
              <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-blue/70" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No analyses yet</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                Get started by analyzing your resume against a job description to see how well you match.
              </p>
              <Link 
                href="/dashboard/analyze" 
                className="inline-flex items-center px-4 py-2 bg-primary-blue rounded text-white font-medium hover:bg-primary-blue/90 transition-colors"
              >
                Start Analysis
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
} 