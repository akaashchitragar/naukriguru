'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import ScoreDisplay from '@/components/ScoreDisplay';
import FeedbackSection from '@/components/FeedbackSection';

export default function AnalysisDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysisDetail = async () => {
      if (!user || !id) {
        router.push('/dashboard/history');
        return;
      }

      try {
        setLoading(true);
        const db = getFirestore();
        const docRef = doc(db, 'resumeAnalyses', id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // Verify this analysis belongs to the current user
          if (data.userId !== user.uid) {
            setError('You do not have permission to view this analysis');
            setLoading(false);
            return;
          }
          
          setAnalysis({
            id: docSnap.id,
            ...data,
            timestamp: data.timestamp?.toDate() || new Date()
          });
        } else {
          setError('Analysis not found');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching analysis details:', err);
        setError('Failed to load analysis details');
        setLoading(false);
      }
    };

    fetchAnalysisDetail();
  }, [id, user, router]);

  // Format the data for our components
  const prepareResultData = () => {
    if (!analysis) return null;
    
    return {
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
    };
  };
  
  const resultData = prepareResultData();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resume Analysis Details</h1>
          {analysis && (
            <div className="mt-2 flex items-center">
              <span className="text-gray-600 mr-3">
                Job Title: {analysis.jobTitle || 'Not specified'}
              </span>
              <span className="text-gray-600">
                Analyzed: {analysis.timestamp.toLocaleDateString()} at {analysis.timestamp.toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>
        <Link
          href="/dashboard/history"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to History
        </Link>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mb-4"></div>
          <p className="text-gray-600">Loading analysis details...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <div className="mt-4">
                <Link
                  href="/dashboard/history"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                >
                  Return to History
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : resultData ? (
        <div className="flex flex-col lg:flex-row">
          {/* Left sidebar with score display */}
          <div className="lg:w-1/3 p-4">
            <div className="sticky top-20">
              <ScoreDisplay 
                score={resultData.match_score}
                keywordsMatchPercentage={resultData.keywords_match_percentage}
                experienceLevelPercentage={resultData.experience_level_percentage}
                skillsRelevancePercentage={resultData.skills_relevance_percentage}
              />
              
              {/* Job Description Section */}
              {analysis.jobDescription && (
                <div className="mt-6 bg-white rounded-xl shadow-md p-5 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Job Description</h3>
                  <div className="bg-gray-50 p-4 rounded-md max-h-64 overflow-y-auto">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{analysis.jobDescription}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Main content with feedback */}
          <div className="lg:w-2/3 p-4">
            <div className="bg-white rounded-xl shadow-md">
              <FeedbackSection 
                feedback={resultData.feedback}
                skillsMatch={resultData.skills_match}
                improvementAreas={resultData.improvement_areas}
                industryInsights={resultData.industry_insights}
                jobTitle={resultData.job_title}
                formattingChecks={resultData.formatting_checks}
                scoreData={{
                  score: resultData.match_score,
                  keywordsMatchPercentage: resultData.keywords_match_percentage,
                  experienceLevelPercentage: resultData.experience_level_percentage,
                  skillsRelevancePercentage: resultData.skills_relevance_percentage
                }}
                onPrint={() => window.print()}
              />
            </div>
          </div>
        </div>
      ) : (
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
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Data</h3>
          <p className="text-gray-600 mb-4">
            We couldn't find any data for this analysis.
          </p>
          <Link
            href="/dashboard/history"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-blue hover:bg-primary-blue/90 focus:outline-none"
          >
            Return to History
          </Link>
        </div>
      )}
    </div>
  );
} 