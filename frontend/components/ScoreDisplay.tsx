'use client';

import React, { useEffect, useState } from 'react';

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

  // Determine color based on score with more distinct ranges
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Determine background color for progress bar with more distinct colors
  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Get stroke color for the circle
  const getStrokeColor = (score: number) => {
    if (score >= 80) return "#10B981"; // green-500
    if (score >= 60) return "#F59E0B"; // amber-500
    return "#EF4444"; // red-500
  };

  // Determine message based on score
  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Excellent Match!';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Average Match';
    return 'Poor Match';
  };
  
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

  // Function to get the appropriate color for a specific metric
  const getMetricColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Function to render an individual metric with enhanced styling
  const renderMetric = (label: string, percentage: number, description?: string) => {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:shadow-md transition-all duration-300">
        <div className="flex justify-between items-center mb-1">
          <div>
            <span className="text-sm font-medium text-gray-800">{label}</span>
            {description && (
              <p className="text-xs text-gray-500 mt-0.5">{description}</p>
            )}
          </div>
          <span className={`text-lg font-semibold ${getScoreColor(percentage)}`}>
            {percentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
          <div 
            className={`${getMetricColor(percentage)} h-3 rounded-full transition-all duration-1000 ease-out relative`}
            style={{ width: `${percentage}%` }}
          >
            {/* Animated pulse effect for values ≥ 80% */}
            {percentage >= 80 && (
              <span className="absolute right-0 top-0 bottom-0 w-2 h-2 bg-white rounded-full my-auto mr-1 animate-pulse"></span>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Function to render core metrics
  const renderCoreMetrics = () => {
    // Get or calculate the percentages for each metric
    const keywordsPercentage = keywordsMatchPercentage !== undefined 
      ? Math.round(keywordsMatchPercentage) 
      : Math.round(Math.min(100, score + 10));
      
    const experiencePercentage = experienceLevelPercentage !== undefined 
      ? Math.round(experienceLevelPercentage) 
      : Math.round(Math.max(0, score - 5));
      
    const skillsPercentage = skillsRelevancePercentage !== undefined 
      ? Math.round(skillsRelevancePercentage) 
      : Math.round(Math.min(100, score + 5));

    return (
      <div className="p-5 rounded-lg bg-white shadow-sm border border-gray-100">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Core Metrics</h4>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-600">Keywords Match</span>
              <span className={`text-sm font-medium ${getScoreColor(keywordsPercentage)}`}>
                {keywordsPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`${getMetricColor(keywordsPercentage)} h-2.5 rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${keywordsPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-600">Experience Level</span>
              <span className={`text-sm font-medium ${getScoreColor(experiencePercentage)}`}>
                {experiencePercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`${getMetricColor(experiencePercentage)} h-2.5 rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${experiencePercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-600">Skills Relevance</span>
              <span className={`text-sm font-medium ${getScoreColor(skillsPercentage)}`}>
                {skillsPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`${getMetricColor(skillsPercentage)} h-2.5 rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${skillsPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 transition-all hover:shadow-xl">
      {/* Overall Score Section with gradient background based on score */}
      <div className={`p-6 bg-gradient-to-br ${
        score >= 80 ? 'from-green-50 to-green-100' : 
        score >= 60 ? 'from-yellow-50 to-yellow-100' : 
        'from-red-50 to-red-100'
      }`}>
        <h3 className="text-2xl font-bold mb-5 text-center text-gray-800">Resume Match Rate</h3>
        
        <div className="flex flex-col items-center">
          {/* Score Circle with enhanced visual design */}
          <div className="relative w-48 h-48 mb-8 transform transition-transform duration-700 hover:scale-105">
            {/* Outer glow effect */}
            <div className={`absolute inset-0 rounded-full blur-md opacity-30 ${
              score >= 80 ? 'bg-green-400' : 
              score >= 60 ? 'bg-yellow-400' : 
              'bg-red-400'
            }`}></div>
            
            {/* Enhanced colored border based on score */}
            <div className={`absolute inset-0 rounded-full border-4 ${
              score >= 80 ? 'border-green-100' : 
              score >= 60 ? 'border-yellow-100' : 
              'border-red-100'
            }`}></div>
            
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className={`text-5xl font-bold ${getScoreColor(score)}`}>
                {animatedScore}%
              </span>
              <span className={`text-sm font-medium mt-2 ${getScoreColor(score)}`}>
                {getScoreMessage(score)}
              </span>
            </div>
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background track with color matching score range */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={score >= 80 ? "#E5FFEC" : score >= 60 ? "#FFF6E5" : "#FFEBEB"}
                strokeWidth="8"
              />
              {/* Progress track with dynamic color and shadow */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={getStrokeColor(score)}
                strokeWidth="8"
                strokeDasharray={`${animatedScore * 2.83} 283`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                style={{ filter: "drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.1))" }}
              />
            </svg>
          </div>
          
          {/* What this means - with enhanced card design */}
          <div className={`p-4 rounded-lg w-full mb-5 ${
            score >= 80 ? 'bg-white border-l-4 border-green-500 shadow-md' : 
            score >= 60 ? 'bg-white border-l-4 border-yellow-500 shadow-md' : 
            'bg-white border-l-4 border-red-500 shadow-md'
          }`}>
            <p className={`text-center ${
              score >= 80 ? 'text-green-800' : 
              score >= 60 ? 'text-yellow-800' : 
              'text-red-800'
            }`}>{getDetailedFeedback(score)}</p>
          </div>
          
          {/* Rescan Button with enhanced styling */}
          {onRescan && (
            <button 
              onClick={onRescan}
              className={`py-2.5 px-8 rounded-md font-medium shadow-md hover:shadow-lg active:shadow-sm transition-all duration-300 flex items-center space-x-2 ${
                score >= 80 ? 'bg-green-500 hover:bg-green-600 text-white' :
                score >= 60 ? 'bg-yellow-500 hover:bg-yellow-600 text-white' :
                'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              <span>Upload & Rescan</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Additional tips section */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="ml-3 text-sm text-gray-600">
            A higher match rate increases your chances of getting past Applicant Tracking Systems (ATS) and catching the recruiter's attention.
          </p>
        </div>
      </div>
    </div>
  );
} 