'use client';

import React, { useEffect, useState } from 'react';
import FeedbackCard from './FeedbackCard';
import { motion } from 'framer-motion';

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
  keywordsMatchPercentage = 0,
  experienceLevelPercentage = 0,
  skillsRelevancePercentage = 0,
  onRescan
}: ScoreDisplayProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [activeTab, setActiveTab] = useState<'metrics'>('metrics');
  
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

  // Helper function to get color classes based on percentage
  const getColorClass = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
    if (percentage >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  // Helper function to get rating text based on percentage
  const getRatingText = (percentage: number) => {
    if (percentage >= 80) return "Excellent";
    if (percentage >= 60) return "Good";
    if (percentage >= 40) return "Fair";
    return "Poor";
  };

  const tabs = [
    { id: 'metrics', label: 'Core Metrics' }
  ];

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Main score display card */}
      <FeedbackCard 
        score={animatedScore} 
        message={getDetailedFeedback(score)}
        onRescan={onRescan}
      />
      
      {/* Tabs Navigation */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab('metrics')}
                className={`relative py-3 px-4 text-sm font-medium flex-1 text-center ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-5">
          {/* Core Metrics Tab */}
          {activeTab === 'metrics' && (
            <motion.div 
              variants={fadeInUpVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >              
              {/* Keywords Match */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-blue-500 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Keywords Match</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-bold text-gray-800">{keywordsMatchPercentage}%</span>
                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      {getRatingText(keywordsMatchPercentage)}
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${keywordsMatchPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full ${getColorClass(keywordsMatchPercentage)}`}
                  />
                </div>
              </div>
              
              {/* Experience Level */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-purple-500 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Experience Level</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-bold text-gray-800">{experienceLevelPercentage}%</span>
                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      {getRatingText(experienceLevelPercentage)}
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${experienceLevelPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className={`h-full ${getColorClass(experienceLevelPercentage)}`}
                  />
                </div>
              </div>
              
              {/* Skills Relevance */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Skills Relevance</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-bold text-gray-800">{skillsRelevancePercentage}%</span>
                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      {getRatingText(skillsRelevancePercentage)}
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${skillsRelevancePercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                    className={`h-full ${getColorClass(skillsRelevancePercentage)}`}
                  />
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                These metrics show how well your resume aligns with key aspects of the job description.
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
} 