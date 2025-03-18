'use client';

import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [indexUrl, setIndexUrl] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const fetchAnalyses = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const db = getFirestore();
        // First try to get data without the compound query
        try {
          const analysesRef = collection(db, 'resumeAnalyses');
          const q = query(
            analysesRef,
            where('userId', '==', user.uid)
            // No orderBy to avoid index error
          );
          
          const querySnapshot = await getDocs(q);
          const analysesData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Handle timestamp safely
            timestamp: doc.data().timestamp instanceof Timestamp ? 
              doc.data().timestamp.toDate() : new Date()
          }));
          
          // Sort on client side instead of using orderBy in query
          analysesData.sort((a, b) => b.timestamp - a.timestamp);
          
          setAnalyses(analysesData);
          setLoading(false);
        } catch (err: any) {
          console.error('Error fetching analyses with simple query:', err);
          // Try using both filters, might trigger index error
          const analysesRef = collection(db, 'resumeAnalyses');
          const q = query(
            analysesRef,
            where('userId', '==', user.uid),
            orderBy('timestamp', 'desc')
          );
          
          try {
            const querySnapshot = await getDocs(q);
            const analysesData = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              timestamp: doc.data().timestamp?.toDate() || new Date()
            }));
            
            setAnalyses(analysesData);
            setLoading(false);
          } catch (indexErr: any) {
            // Check if this is an index error
            if (indexErr.message && indexErr.message.includes('index')) {
              // Extract the URL from the error message
              const urlMatch = indexErr.message.match(/https:\/\/console\.firebase\.google\.com[^"]+/);
              if (urlMatch) {
                setIndexUrl(urlMatch[0]);
              }
              setError('This feature requires a database index to be created. Please check the error message for details.');
            } else {
              setError('Failed to load your analysis history. Please try again later.');
            }
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Error in fetchAnalyses:', err);
        setError('Failed to load your analysis history. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchAnalyses();
  }, [user]);
  
  // Function to get appropriate badge color based on score
  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };
  
  // Function to get appropriate text for match level
  const getMatchText = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Average Match';
    return 'Poor Match';
  };
  
  // Function to view the detailed analysis page
  const viewAnalysisDetails = (analysisId: string) => {
    router.push(`/dashboard/analysis-detail/${analysisId}`);
  };
  
  // Function to restore a specific analysis result to local storage (Keep this as backup method)
  const restoreAnalysis = (analysis: any) => {
    // Store the result data in localStorage
    localStorage.setItem('resume_analyzer_result', JSON.stringify({
      match_score: analysis.matchScore,
      keywords_match_percentage: analysis.keywordsMatchPercentage,
      experience_level_percentage: analysis.experienceLevelPercentage,
      skills_relevance_percentage: analysis.skillsRelevancePercentage,
      feedback: analysis.feedback,
      skills_match: analysis.skillsMatch,
      improvement_areas: analysis.improvementAreas,
      industry_insights: analysis.industryInsights,
      job_title: analysis.jobTitle,
      formatting_checks: analysis.formattingChecks
    }));
    
    // Set the step to show results
    localStorage.setItem('resume_analyzer_step', '3');
    
    // Redirect to the analyze page
    window.location.href = '/dashboard/analyze';
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Resume Analysis History</h1>
        <p className="text-gray-600 mt-2">
          View all your past resume analyses and their results
        </p>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
          {indexUrl && (
            <div className="mt-4">
              <p className="text-sm text-gray-700 mb-2">
                A database index needs to be created. Please follow these steps:
              </p>
              <ol className="list-decimal pl-5 text-sm text-gray-700 space-y-1">
                <li>Visit the Firebase console using the URL from the error message</li>
                <li>Sign in with the appropriate account</li>
                <li>Click "Create index" to set up the required index</li>
                <li>Return to this page and refresh once the index is created</li>
              </ol>
              <div className="mt-4">
                <a 
                  href={indexUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-blue hover:bg-primary-blue/90 focus:outline-none"
                >
                  Open Firebase Console
                </a>
                <button
                  onClick={() => window.location.reload()}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          )}
        </div>
      ) : analyses.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis History</h3>
          <p className="text-gray-600 mb-4">
            You haven't analyzed any resumes yet. Start by analyzing your resume against a job description.
          </p>
          <Link
            href="/dashboard/analyze"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-blue hover:bg-primary-blue/90 focus:outline-none"
          >
            Go to Resume Analyzer
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Match Score
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Keywords Match
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analyses.map((analysis) => (
                  <tr key={analysis.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {analysis.jobTitle || 'Unknown Job'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDistanceToNow(analysis.timestamp, { addSuffix: true })}
                      </div>
                      <div className="text-xs text-gray-400">
                        {analysis.timestamp.toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getScoreBadgeColor(analysis.matchScore)}`}>
                        {analysis.matchScore}% - {getMatchText(analysis.matchScore)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                          <div 
                            className={`h-2.5 rounded-full ${
                              analysis.keywordsMatchPercentage >= 80 ? 'bg-green-500' : 
                              analysis.keywordsMatchPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${analysis.keywordsMatchPercentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">{Math.round(analysis.keywordsMatchPercentage)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => viewAnalysisDetails(analysis.id)}
                        className="text-primary-blue hover:text-primary-blue/80 mr-4"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 