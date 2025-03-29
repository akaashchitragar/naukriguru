'use client';

import React, { useEffect, useState } from 'react';
import FeedbackCard from './FeedbackCard';

interface ScoreDisplayProps {
  score: number;
  // Issue metrics from API
  searchabilityIssues?: number;
  hardSkillsIssues?: number;
  softSkillsIssues?: number;
  recruiterTipsIssues?: number;
  formattingIssues?: number;
  // Keyword matching metrics
  keywordsMatchPercentage?: number;
  experienceLevelPercentage?: number;
  skillsRelevancePercentage?: number;
  // Optional callback for rescan button
  onRescan?: () => void;
}

export default function ScoreDisplay({ 
  score,
  searchabilityIssues,
  hardSkillsIssues,
  softSkillsIssues,
  recruiterTipsIssues,
  formattingIssues,
  keywordsMatchPercentage,
  experienceLevelPercentage,
  skillsRelevancePercentage,
  onRescan
}: ScoreDisplayProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    // Animate the score from 0 to the actual value
    const duration = 1500; // 1.5 seconds
    const interval = 20; // Update every 20ms
    const steps = duration / interval;
    const increment = score / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        current = score;
        clearInterval(timer);
      }
      setAnimatedScore(Math.round(current));
    }, interval);
    
    return () => clearInterval(timer);
  }, [score]);

  // Get detailed feedback based on score
  const getDetailedFeedback = (score: number) => {
    if (score >= 80) {
      return "Your resume is well-aligned with this job description. You're a strong candidate!";
    }
    if (score >= 60) {
      return "Your resume matches many requirements, but there's room for improvement.";
    }
    if (score >= 40) {
      return "Your resume needs significant improvements to better match this job.";
    }
    return "Your resume doesn't match well with this job. Consider major revisions.";
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Use the new FeedbackCard for main score display */}
      <FeedbackCard 
        score={animatedScore} 
        message={getDetailedFeedback(score)}
        onRescan={onRescan}
      />
      
      {/* Tips section with simplified UI */}
      {(searchabilityIssues || hardSkillsIssues || softSkillsIssues || recruiterTipsIssues || formattingIssues) && (
        <div className="p-5 rounded-lg bg-white shadow-sm border border-gray-100">
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Resume Tips</h4>
          <div className="space-y-2 text-sm">
            {searchabilityIssues && (
              <div className="flex items-center">
                <svg className="h-4 w-4 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-gray-700">Searchability Issues: <span className="font-medium">{searchabilityIssues}</span></span>
              </div>
            )}
            {hardSkillsIssues && (
              <div className="flex items-center">
                <svg className="h-4 w-4 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="text-gray-700">Hard Skills Issues: <span className="font-medium">{hardSkillsIssues}</span></span>
              </div>
            )}
            {softSkillsIssues && (
              <div className="flex items-center">
                <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-gray-700">Soft Skills Issues: <span className="font-medium">{softSkillsIssues}</span></span>
              </div>
            )}
            {recruiterTipsIssues && (
              <div className="flex items-center">
                <svg className="h-4 w-4 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">Recruiter Tips Issues: <span className="font-medium">{recruiterTipsIssues}</span></span>
              </div>
            )}
            {formattingIssues && (
              <div className="flex items-center">
                <svg className="h-4 w-4 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
                <span className="text-gray-700">Formatting Issues: <span className="font-medium">{formattingIssues}</span></span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 