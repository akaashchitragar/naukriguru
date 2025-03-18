import React, { useEffect, useState } from 'react';

interface CoreMetricsProps {
  keywordsMatchPercentage?: number;
  experienceLevelPercentage?: number;
  skillsRelevancePercentage?: number;
  score: number;
}

export default function CoreMetrics({
  keywordsMatchPercentage,
  experienceLevelPercentage,
  skillsRelevancePercentage,
  score
}: CoreMetricsProps) {
  // State for animation
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Determine color based on score with more distinct ranges
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Determine background color for progress bar with more distinct colors
  const getMetricColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-gradient-to-r from-green-400 to-green-600';
    if (percentage >= 60) return 'bg-gradient-to-r from-yellow-300 to-yellow-500';
    return 'bg-gradient-to-r from-red-400 to-red-600';
  };

  // Determine border color for metric card
  const getMetricBorderColor = (percentage: number) => {
    if (percentage >= 80) return 'border-green-200 hover:border-green-300';
    if (percentage >= 60) return 'border-yellow-200 hover:border-yellow-300';
    return 'border-red-200 hover:border-red-300';
  };

  // Function to render an individual metric with enhanced styling
  const renderMetric = (label: string, percentage: number, description?: string, icon?: React.ReactNode) => {
    // Get or calculate the percentage for this metric
    const displayPercentage = Math.round(percentage);
    
    return (
      <div className={`bg-white rounded-lg p-5 shadow-sm border ${getMetricBorderColor(displayPercentage)} hover:shadow-md transition-all duration-300 flex-1`}>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            {icon}
            <div>
              <span className="text-sm font-semibold text-gray-800">{label}</span>
            </div>
          </div>
          <span className={`text-lg font-bold ${getScoreColor(displayPercentage)} transition-colors duration-500`}>
            {displayPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3.5 mt-2 overflow-hidden shadow-inner">
          <div 
            className={`${getMetricColor(displayPercentage)} h-3.5 rounded-full transition-all duration-1000 ease-out relative`}
            style={{ width: animate ? `${displayPercentage}%` : '0%' }}
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

  // Get or calculate the percentages for each metric
  const keywordsPercentage = keywordsMatchPercentage !== undefined 
    ? keywordsMatchPercentage 
    : Math.min(100, score + 10);
    
  const experiencePercentage = experienceLevelPercentage !== undefined 
    ? experienceLevelPercentage 
    : Math.max(0, score - 5);
    
  const skillsPercentage = skillsRelevancePercentage !== undefined 
    ? skillsRelevancePercentage 
    : Math.min(100, score + 5);

  return (
    <div className="w-full p-5 rounded-xl bg-white shadow-sm border border-gray-100 mb-6 overflow-hidden">
      <div className="flex items-center mb-4 border-b border-gray-100 pb-3">
        <div className="p-2 bg-blue-50 rounded-lg mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-800">CORE METRICS</h3>
        <div className="ml-auto text-sm text-gray-500 flex items-center">
          <span className="h-2 w-2 rounded-full bg-blue-500 mr-1"></span>
          <span>Based on job match analysis</span>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        {/* Keywords Match */}
        {renderMetric(
          "Keywords Match", 
          keywordsPercentage,
          undefined,
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        )}
        
        {/* Experience Level */}
        {renderMetric(
          "Experience Level", 
          experiencePercentage,
          undefined,
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
            <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
          </svg>
        )}
        
        {/* Skills Relevance */}
        {renderMetric(
          "Skills Relevance", 
          skillsPercentage,
          undefined,
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
        <div className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p>These metrics show how well your resume matches the job description. Higher scores indicate better alignment with what employers are looking for.</p>
        </div>
      </div>
    </div>
  );
} 