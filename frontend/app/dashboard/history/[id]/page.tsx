'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { ApiClient } from '@/lib/api';
import { useToast, ToastType } from '@/components/Toast';
import { handleAsyncOperation } from '@/lib/error-utils';

const apiClient = new ApiClient();

interface Analysis {
  id: string;
  resume_id: string;
  resume_name?: string;
  job_description: string;
  match_score: number;
  created_at: any;
  feedback?: string;
  keywords_matched?: string[];
  missing_keywords?: string[];
  sections_feedback?: Record<string, string>;
}

export default function AnalysisDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalysisDetails() {
      if (user && id) {
        await handleAsyncOperation(
          async () => {
            // In a real implementation, you would fetch the specific analysis by ID
            // For now, we'll get all analyses and find the matching one
            const userAnalyses = await apiClient.getUserAnalyses(50);
            const foundAnalysis = userAnalyses.find(a => a.id === id);
            
            if (foundAnalysis) {
              setAnalysis(foundAnalysis);
            } else {
              showToast(ToastType.ERROR, 'Analysis not found');
              router.push('/dashboard/history');
            }
            
            return foundAnalysis;
          },
          {
            setLoading,
            showToast,
            errorMessage: 'Failed to load analysis details'
          }
        );
      }
    }

    fetchAnalysisDetails();
  }, [user, id, showToast, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-orange"></div>
          <p className="mt-2 text-gray-600">Loading analysis details...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Analysis not found.</p>
        <Link 
          href="/dashboard/history" 
          className="mt-4 inline-block px-4 py-2 bg-accent-orange text-white rounded-md hover:bg-accent-orange/90 transition-colors"
        >
          Back to History
        </Link>
      </div>
    );
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp || !timestamp.seconds) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-deep-blue">Analysis Details</h1>
        <Link 
          href="/dashboard/history" 
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          Back to History
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-deep-blue mb-4">Resume Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Resume Name</p>
                <p className="font-medium">{analysis.resume_name || 'Resume'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Analysis Date</p>
                <p className="font-medium">{formatDate(analysis.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Match Score</p>
                <div className="flex items-center">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    analysis.match_score >= 70 
                      ? 'bg-green-100 text-green-800' 
                      : analysis.match_score >= 40 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {analysis.match_score}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-deep-blue mb-4">Job Description</h2>
            <div className="bg-gray-50 p-4 rounded-md h-40 overflow-y-auto">
              <p className="text-sm whitespace-pre-wrap">{analysis.job_description}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-deep-blue mb-4">Analysis Feedback</h2>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="whitespace-pre-wrap">{analysis.feedback || 'No detailed feedback available for this analysis.'}</p>
          </div>
        </div>
        
        {((analysis.keywords_matched && analysis.keywords_matched.length > 0) || 
          (analysis.missing_keywords && analysis.missing_keywords.length > 0)) && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-deep-blue mb-4">Keywords Matched</h2>
              {analysis.keywords_matched && analysis.keywords_matched.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords_matched.map((keyword, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {keyword}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No keywords matched</p>
              )}
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-deep-blue mb-4">Missing Keywords</h2>
              {analysis.missing_keywords && analysis.missing_keywords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {analysis.missing_keywords.map((keyword, index) => (
                    <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      {keyword}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No missing keywords</p>
              )}
            </div>
          </div>
        )}
        
        {analysis.sections_feedback && Object.keys(analysis.sections_feedback).length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-deep-blue mb-4">Section Feedback</h2>
            <div className="space-y-4">
              {Object.entries(analysis.sections_feedback).map(([section, feedback], index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium text-deep-blue mb-2">{section}</h3>
                  <p className="text-sm whitespace-pre-wrap">{feedback}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 