'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FeedbackCardProps {
  score: number;
  message?: string;
  onRescan?: () => void;
}

export default function FeedbackCard({ score, message, onRescan }: FeedbackCardProps) {
  // Generate a relevant emoji and color based on the score
  const getScoreDetails = (score: number) => {
    if (score >= 80) {
      return { 
        emoji: '🌟', 
        color: 'from-green-400 to-green-600',
        textColor: 'text-green-700',
        buttonColor: 'bg-green-500 hover:bg-green-600', 
        message: message || 'Your resume is well-matched with the job requirements! You\'re a strong candidate.' 
      };
    } else if (score >= 65) {
      return { 
        emoji: '👍', 
        color: 'from-yellow-400 to-yellow-600',
        textColor: 'text-yellow-700',
        buttonColor: 'bg-yellow-500 hover:bg-yellow-600', 
        message: message || 'Your resume matches many requirements, but there\'s room for improvement.' 
      };
    } else if (score >= 40) {
      return { 
        emoji: '🔍', 
        color: 'from-orange-400 to-orange-600',
        textColor: 'text-orange-700',
        buttonColor: 'bg-orange-500 hover:bg-orange-600', 
        message: message || 'Your resume needs significant improvements to align with this job\'s requirements.' 
      };
    } else {
      return { 
        emoji: '⚠️', 
        color: 'from-red-400 to-red-600',
        textColor: 'text-red-700',
        buttonColor: 'bg-red-500 hover:bg-red-600', 
        message: message || 'Your resume doesn\'t match well with this position. Consider major revisions.' 
      };
    }
  };

  const details = getScoreDetails(score);

  return (
    <div className="relative bg-gradient-to-b from-yellow-50 to-yellow-100 rounded-2xl shadow-lg overflow-hidden">
      {/* Header with dynamic gradient */}
      <div className={`px-6 py-8 bg-gradient-to-r ${details.color} text-white`}>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Resume Match Rate</h2>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.2 
            }}
            className="text-5xl"
          >
            {details.emoji}
          </motion.div>
        </div>
      </div>

      {/* Score display */}
      <div className="flex justify-center -mt-10">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative bg-white rounded-full p-1 shadow-lg"
        >
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-yellow-200 to-yellow-100 flex items-center justify-center">
            <div className="w-28 h-28 rounded-full bg-white flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-yellow-500">{score}%</span>
              <span className="text-sm text-yellow-700 font-medium">
                {score >= 80 ? 'Excellent' : score >= 65 ? 'Good Match' : score >= 40 ? 'Average' : 'Poor Match'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Feedback message */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="px-6 py-4 pt-8"
      >
        <div className={`bg-white p-4 rounded-xl border-l-4 border-yellow-500 shadow-sm ${details.textColor}`}>
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              <svg className="h-5 w-5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-base font-medium">{details.message}</p>
          </div>
        </div>
      </motion.div>

      {/* Action button */}
      <div className="px-6 py-4 pb-6 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`flex items-center px-6 py-3 text-white font-medium rounded-full shadow-md transition-all ${details.buttonColor}`}
          onClick={onRescan}
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Upload & Rescan
        </motion.button>
      </div>

      {/* Info footer */}
      <div className="bg-blue-50 px-4 py-3 border-t border-blue-100">
        <div className="flex items-start text-xs text-blue-600">
          <svg className="h-4 w-4 mr-1 mt-0.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            A higher match rate increases your chances of getting past Applicant Tracking Systems (ATS) and catching the recruiter's attention.
          </span>
        </div>
      </div>
    </div>
  );
} 