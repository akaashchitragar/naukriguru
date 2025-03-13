'use client';

import React from 'react';

interface FeedbackSectionProps {
  feedback: string;
  skillsMatch: string[];
  improvementAreas: string[];
}

export default function FeedbackSection({ 
  feedback, 
  skillsMatch, 
  improvementAreas 
}: FeedbackSectionProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Detailed Feedback</h3>
      
      <div className="space-y-6">
        {/* General Feedback */}
        <div>
          <h4 className="text-lg font-medium mb-2 text-indigo-700">Overall Assessment</h4>
          <p className="text-gray-700 whitespace-pre-line">{feedback}</p>
        </div>
        
        {/* Skills Match */}
        <div>
          <h4 className="text-lg font-medium mb-2 text-green-600">Matching Skills</h4>
          {skillsMatch.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {skillsMatch.map((skill, index) => (
                <li key={index} className="text-gray-700">{skill}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No matching skills identified.</p>
          )}
        </div>
        
        {/* Improvement Areas */}
        <div>
          <h4 className="text-lg font-medium mb-2 text-amber-600">Areas for Improvement</h4>
          {improvementAreas.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {improvementAreas.map((area, index) => (
                <li key={index} className="text-gray-700">{area}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No specific improvement areas identified.</p>
          )}
        </div>
      </div>
    </div>
  );
} 