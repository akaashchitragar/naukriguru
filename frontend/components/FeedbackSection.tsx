   'use client';

import React, { useState } from 'react';

interface FeedbackSectionProps {
  feedback: string;
  skillsMatch: string[];
  improvementAreas: string[];
  overallAssessment?: string[];
  industryInsights?: {
    industry: string;
    title: string;
    recommendations: string[];
  };
  jobTitle?: string;
  onPrint?: () => void;
  formattingChecks?: {
    font_check: {
      passed: boolean;
      details: string[];
    };
    layout_check: {
      passed: boolean;
      details: string[];
    };
    page_setup_check: {
      passed: boolean;
      details: string[];
    };
  };
  atsTips?: string[];
}

// Interface for detail with status
interface FormattingDetail {
  text: string;
  status: 'passed' | 'needs_improvement' | 'failed';
}

export default function FeedbackSection({ 
  feedback, 
  skillsMatch, 
  improvementAreas,
  overallAssessment = [],
  industryInsights,
  jobTitle,
  onPrint,
  formattingChecks,
  atsTips = []
}: FeedbackSectionProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'skills' | 'improvements' | 'industry' | 'formatting'>('all');
  
  // Format feedback into an intro paragraph and bullet points
  const formatFeedback = (feedbackText: string) => {
    // Split the feedback into sentences
    const sentences = feedbackText.split(/(?<=[.!?])\s+/);
    
    // Use the first 1-2 sentences as the intro (aim for around 2 lines)
    let introText = '';
    let remainingText = feedbackText;
    
    if (sentences.length > 1) {
      // Take first 2 sentences or 1 if it's long
      const firstSentence = sentences[0];
      if (firstSentence.length > 100) {
        introText = firstSentence;
        remainingText = feedbackText.substring(firstSentence.length).trim();
      } else if (sentences.length > 1) {
        introText = sentences[0] + ' ' + sentences[1];
        remainingText = feedbackText.substring(introText.length).trim();
      }
    }
    
    // Convert the remaining text into bullet points
    const bulletPoints = remainingText
      .split(/(?<=[.!?])\s+/)
      .filter(sentence => sentence.trim().length > 0)
      .map(sentence => sentence.trim())
      // Remove leading * or - characters if they exist
      .map(sentence => sentence.replace(/^[\*\-]\s*/, ''));
    
    return (
      <>
        <p className="text-gray-700 mb-4 leading-relaxed">{introText}</p>
        {bulletPoints.length > 0 && (
          <ul className="space-y-3 text-gray-700">
            {bulletPoints.map((point, index) => (
              <li key={index} className="flex items-start">
                <span className="text-gray-800 font-medium mr-3 text-base">
                  {index + 1}.
                </span>
                <span className="flex-1">{point}</span>
              </li>
            ))}
          </ul>
        )}
      </>
    );
  };
  
  // Use industry insights from API or fallback to a generic message
  const getIndustryContent = () => {
    if (!industryInsights) {
      return (
        <div className="text-center p-4">
          <p className="text-gray-500 italic">No industry-specific insights available.</p>
        </div>
      );
    }
    
    return (
      <div className="ml-4 flex-1">
        <div className="flex items-center mb-3">
          <h4 className="text-lg font-semibold text-blue-700">{industryInsights.title}</h4>
          <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            {industryInsights.industry}
          </span>
          {jobTitle && (
            <span className="ml-2 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
              {jobTitle}
            </span>
          )}
        </div>
        <ul className="space-y-3">
          {industryInsights.recommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start">
              <span className="text-blue-800 font-medium mr-3 text-base">
                {index + 1}.
              </span>
              <span className="text-gray-700 flex-1">{recommendation.replace(/^[\*\-]\s*/, '')}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Function to evaluate item status and render appropriate icon
  const renderStatusIcon = (status: 'passed' | 'needs_improvement' | 'failed') => {
    switch (status) {
      case 'passed':
        // Green check mark for passed items
        return (
          <span className="text-green-500 mr-2 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </span>
        );
      case 'failed':
        // Red X for failed items
        return (
          <span className="text-red-500 mr-2 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </span>
        );
      case 'needs_improvement':
      default:
        // Yellow exclamation mark for items that need improvement
        return (
          <span className="text-amber-500 mr-2 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </span>
        );
    }
  };

  // Function to determine item status based on text content
  const getItemStatus = (detail: string): 'passed' | 'needs_improvement' | 'failed' => {
    // Check if this detail contains words suggesting it's passed, needs improvement, or failed
    const isFailed = detail.toLowerCase().includes('missing') || 
                    detail.toLowerCase().includes('incorrect') ||
                    detail.toLowerCase().includes('error') ||
                    detail.toLowerCase().includes('problem') ||
                    detail.toLowerCase().includes('incompatible');
                    
    const needsImprovement = detail.toLowerCase().includes('avoid') || 
                           detail.toLowerCase().includes('should') || 
                           detail.toLowerCase().includes('consider') ||
                           detail.toLowerCase().includes('needs') ||
                           detail.toLowerCase().includes('improve');
    
    if (isFailed) return 'failed';
    if (needsImprovement) return 'needs_improvement';
    return 'passed';
  };

  // Process raw details into categorized details with status
  const processDetails = (details: string[]): FormattingDetail[] => {
    return details.map(detail => ({
      text: detail,
      status: getItemStatus(detail)
    }));
  };
  
  // Use formatting checks from API or fallback to a generic message
  const getFormattingContent = () => {
    if (!formattingChecks) {
      return (
        <div className="text-center p-4">
          <p className="text-gray-500 italic">No formatting check results available.</p>
        </div>
      );
    }
    
    // Process all details to add status
    const fontDetails = processDetails(formattingChecks.font_check.details);
    const layoutDetails = processDetails(formattingChecks.layout_check.details);
    const pageSetupDetails = processDetails(formattingChecks.page_setup_check.details);
    
    return (
      <div className="ml-4 flex-1">
        <h4 className="text-lg font-semibold mb-4 text-purple-700">Resume Format Analysis</h4>
        
        {/* Font Check Section */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <h5 className="text-md font-medium text-gray-800">Font & Typography</h5>
            <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full flex items-center ${
              formattingChecks.font_check.passed 
                ? 'bg-green-100 text-green-800' 
                : 'bg-amber-100 text-amber-800'
            }`}>
              {formattingChecks.font_check.passed ? 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                :
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              }
              {formattingChecks.font_check.passed ? 'Passed' : 'Needs Improvement'}
            </span>
          </div>
          <ul className="space-y-2 ml-2">
            {fontDetails.map((detail, index) => (
              <li key={index} className="flex items-start text-gray-700">
                {renderStatusIcon(detail.status)}
                <span>{detail.text}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Layout Check Section */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <h5 className="text-md font-medium text-gray-800">Layout & Structure</h5>
            <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full flex items-center ${
              formattingChecks.layout_check.passed 
                ? 'bg-green-100 text-green-800' 
                : 'bg-amber-100 text-amber-800'
            }`}>
              {formattingChecks.layout_check.passed ? 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                :
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              }
              {formattingChecks.layout_check.passed ? 'Passed' : 'Needs Improvement'}
            </span>
          </div>
          <ul className="space-y-2 ml-2">
            {layoutDetails.map((detail, index) => (
              <li key={index} className="flex items-start text-gray-700">
                {renderStatusIcon(detail.status)}
                <span>{detail.text}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Page Setup Check Section */}
        <div>
          <div className="flex items-center mb-2">
            <h5 className="text-md font-medium text-gray-800">Page Setup & Dimensions</h5>
            <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full flex items-center ${
              formattingChecks.page_setup_check.passed 
                ? 'bg-green-100 text-green-800' 
                : 'bg-amber-100 text-amber-800'
            }`}>
              {formattingChecks.page_setup_check.passed ? 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                :
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              }
              {formattingChecks.page_setup_check.passed ? 'Passed' : 'Needs Improvement'}
            </span>
          </div>
          <ul className="space-y-2 ml-2">
            {pageSetupDetails.map((detail, index) => (
              <li key={index} className="flex items-start text-gray-700">
                {renderStatusIcon(detail.status)}
                <span>{detail.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-deep-blue">Detailed Feedback</h3>
        {onPrint && (
          <button
            onClick={onPrint}
            className="px-4 py-2 bg-deep-blue text-white rounded-md hover:bg-deep-blue/90 shadow-sm no-print"
          >
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Results
            </span>
          </button>
        )}
      </div>
      
      {/* Tab Navigation */}
      <div className="flex flex-wrap border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 font-medium text-sm transition-all ${
            activeTab === 'all'
              ? 'text-accent-orange border-b-2 border-accent-orange'
              : 'text-gray-500 hover:text-deep-blue'
          }`}
        >
          Overall Assessment
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`px-4 py-2 font-medium text-sm transition-all ${
            activeTab === 'skills'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-500 hover:text-deep-blue'
          }`}
        >
          Matching Skills
        </button>
        <button
          onClick={() => setActiveTab('improvements')}
          className={`px-4 py-2 font-medium text-sm transition-all ${
            activeTab === 'improvements'
              ? 'text-amber-600 border-b-2 border-amber-600'
              : 'text-gray-500 hover:text-deep-blue'
          }`}
        >
          Improvement Areas
        </button>
        <button
          onClick={() => setActiveTab('industry')}
          className={`px-4 py-2 font-medium text-sm transition-all ${
            activeTab === 'industry'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-deep-blue'
          }`}
        >
          Industry Insights
        </button>
        <button
          onClick={() => setActiveTab('formatting')}
          className={`px-4 py-2 font-medium text-sm transition-all ${
            activeTab === 'formatting'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-500 hover:text-deep-blue'
          }`}
        >
          Formatting Checks
        </button>
      </div>
      
      <div className="space-y-8">
        {/* General Feedback */}
        {(activeTab === 'all') && (
          <>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 transition-all duration-300 hover:shadow-md">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-deep-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-lg font-semibold mb-2 text-deep-blue">Overall Assessment</h4>
                {overallAssessment && overallAssessment.length > 0 ? (
                  <ul className="space-y-3 text-gray-700">
                    {overallAssessment.map((point, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-deep-blue font-medium mr-3 text-base">
                          {index + 1}.
                        </span>
                        <span className="flex-1">{point}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  formatFeedback(feedback)
                )}
              </div>
            </div>
          </div>
            
          {/* ATS Tips Section */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 transition-all duration-300 hover:shadow-md">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-lg font-semibold mb-3 text-blue-700">ATS Tips</h4>
                {atsTips && atsTips.length > 0 ? (
                  <ul className="space-y-3">
                    {atsTips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-800 font-medium mr-3 text-base">
                          {index + 1}.
                        </span>
                        <span className="text-gray-700 flex-1">{tip.replace(/^[\*\-]\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-blue-800 font-medium mr-3 text-base">1.</span>
                      <span className="text-gray-700 flex-1">Use standard fonts like Arial, Calibri, or Times New Roman for better ATS parsing.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-800 font-medium mr-3 text-base">2.</span>
                      <span className="text-gray-700 flex-1">Avoid tables, columns, and text boxes which can confuse ATS software.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-800 font-medium mr-3 text-base">3.</span>
                      <span className="text-gray-700 flex-1">Include exact keywords from the job description to improve your match score.</span>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
          </>
        )}
        
        {/* Skills Match */}
        {(activeTab === 'skills') && (
          <div className="bg-green-50 p-6 rounded-lg border border-green-100 transition-all duration-300 hover:shadow-md">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-lg font-semibold mb-3 text-green-700">Matching Skills</h4>
                {skillsMatch.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {skillsMatch.map((skill, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No matching skills identified.</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Improvement Areas */}
        {(activeTab === 'improvements') && (
          <div className="bg-amber-50 p-6 rounded-lg border border-amber-100 transition-all duration-300 hover:shadow-md">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-lg font-semibold mb-3 text-amber-700">Areas for Improvement</h4>
                {improvementAreas.length > 0 ? (
                  <ul className="space-y-3">
                    {improvementAreas.map((area, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-amber-800 font-medium mr-3 text-base">
                          {index + 1}.
                        </span>
                        <span className="text-gray-700 flex-1">{area.replace(/^[\*\-]\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No specific improvement areas identified.</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Industry-specific Recommendations */}
        {(activeTab === 'industry') && (
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 transition-all duration-300 hover:shadow-md">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              {getIndustryContent()}
            </div>
          </div>
        )}

        {/* Formatting Checks */}
        {(activeTab === 'formatting') && (
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-100 transition-all duration-300 hover:shadow-md">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              {getFormattingContent()}
            </div>
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap gap-3 justify-end">
        <button 
          onClick={() => {
            const industryText = industryInsights 
              ? `${industryInsights.title}:\n${industryInsights.recommendations.join('\n')}`
              : 'No industry insights available.';
            
            // Include formatting checks in clipboard content if available
            let formattingText = 'Formatting Checks: No data available.';
            if (formattingChecks) {
              formattingText = 'Formatting Checks:\n';
              formattingText += '- Font & Typography: ' + (formattingChecks.font_check.passed ? 'Passed' : 'Needs Improvement') + '\n';
              formattingText += formattingChecks.font_check.details.map(d => '  • ' + d).join('\n') + '\n';
              formattingText += '- Layout & Structure: ' + (formattingChecks.layout_check.passed ? 'Passed' : 'Needs Improvement') + '\n';
              formattingText += formattingChecks.layout_check.details.map(d => '  • ' + d).join('\n') + '\n';
              formattingText += '- Page Setup: ' + (formattingChecks.page_setup_check.passed ? 'Passed' : 'Needs Improvement') + '\n';
              formattingText += formattingChecks.page_setup_check.details.map(d => '  • ' + d).join('\n');
            }
            
            // Include ATS Tips in clipboard content
            const atsTipsText = atsTips && atsTips.length > 0 
              ? atsTips.join('\n') 
              : 'Use standard fonts for better ATS parsing.\nAvoid tables and complex formatting.\nInclude keywords from the job description.';
            
            navigator.clipboard.writeText(
              `Overall Assessment:\n${overallAssessment && overallAssessment.length > 0 ? 
                overallAssessment.map((p, i) => `${i+1}. ${p}`).join('\n') : 
                feedback}\n\n` +
              `ATS Tips:\n${atsTipsText}\n\n` +
              `Matching Skills:\n${skillsMatch.join('\n')}\n\n` +
              `Areas for Improvement:\n${improvementAreas.join('\n')}\n\n` +
              industryText + '\n\n' +
              formattingText
            );
          }}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
        >
          <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
            <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
          </svg>
          Copy to Clipboard
        </button>
      </div>
    </div>
  );
} 