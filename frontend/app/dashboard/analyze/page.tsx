'use client';

import React from 'react';
import ResumeAnalyzer from '@/components/ResumeAnalyzer';

export default function AnalyzePage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-deep-blue">Resume Analysis</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 w-full">
        <ResumeAnalyzer />
      </div>
    </div>
  );
} 