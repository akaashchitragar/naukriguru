'use client';

import React, { useEffect, useState } from 'react';

interface ScoreDisplayProps {
  score: number;
}

export default function ScoreDisplay({ score }: ScoreDisplayProps) {
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

  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Determine background color for progress bar
  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
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

  return (
    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
      <h3 className="text-2xl font-bold mb-6 text-deep-blue text-center">Match Score</h3>
      
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative w-48 h-48 flex-shrink-0">
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className={`text-5xl font-bold ${getScoreColor(score)}`}>
              {animatedScore}%
            </span>
            <span className={`text-sm font-medium mt-2 ${getScoreColor(score)}`}>
              {getScoreMessage(score)}
            </span>
          </div>
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="10"
            />
            {/* Progress circle with gradient */}
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={score >= 80 ? "#10B981" : score >= 60 ? "#FBBF24" : "#EF4444"} />
                <stop offset="100%" stopColor={score >= 80 ? "#059669" : score >= 60 ? "#F59E0B" : "#DC2626"} />
              </linearGradient>
            </defs>
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="10"
              strokeDasharray={`${animatedScore * 2.83} 283`}
              strokeDashoffset="0"
              transform="rotate(-90 50 50)"
              className="transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
          </svg>
        </div>
        
        <div className="flex-1">
          <h4 className="text-lg font-semibold mb-2 text-gray-800">What this means:</h4>
          <p className="text-gray-600 mb-4">{getDetailedFeedback(score)}</p>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Keywords Match</span>
              <span className="text-sm font-medium text-gray-800">{Math.min(100, score + 10)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`${getProgressColor(score)} h-2 rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${Math.min(100, score + 10)}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Experience Level</span>
              <span className="text-sm font-medium text-gray-800">{Math.max(0, score - 5)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`${getProgressColor(score)} h-2 rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${Math.max(0, score - 5)}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Skills Relevance</span>
              <span className="text-sm font-medium text-gray-800">{Math.min(100, score + 5)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`${getProgressColor(score)} h-2 rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${Math.min(100, score + 5)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 