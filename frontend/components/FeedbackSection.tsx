   'use client';

import React, { useState } from 'react';

interface FeedbackSectionProps {
  feedback: string;
  skillsMatch: string[];
  improvementAreas: string[];
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
  scoreData?: {
    score: number;
    keywordsMatchPercentage?: number;
    experienceLevelPercentage?: number;
    skillsRelevancePercentage?: number;
  };
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
  industryInsights,
  jobTitle,
  onPrint,
  formattingChecks,
  scoreData
}: FeedbackSectionProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'skills' | 'improvements' | 'industry' | 'formatting'>('all');
  
  // Format feedback into a short, crisp paragraph
  const formatFeedback = (feedbackText: string) => {
    // Remove any leading asterisks or bullet markers that might be present
    const cleanedText = feedbackText.replace(/^[\*\-]\s*/gm, '');
    
    return (
      <p className="text-gray-700 leading-relaxed">
        {cleanedText}
      </p>
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

  // Function to get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Function to get background color for progress bar
  const getProgressBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Function to get message based on score
  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Excellent Match!';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Average Match';
    return 'Poor Match';
  };
  
  // Print view component that shows all sections
  const PrintView = () => (
    <div className="print-only" style={{ display: 'none' }}>
      <div className="print-header">
        <h2 className="text-2xl font-bold text-deep-blue">Resume Analysis Report</h2>
        <div className="metadata">
          {jobTitle && <span>Position: {jobTitle} | </span>}
          <span>Generated on {new Date().toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          })}</span>
        </div>
      </div>
      
      {/* Score Summary */}
      {scoreData && (
        <div className="print-section-content">
          <div className="score-display">
            <div className="score-value" style={{ borderColor: scoreData.score >= 80 ? '#22c55e' : (scoreData.score >= 60 ? '#eab308' : '#ef4444') }}>
              {scoreData.score}%
            </div>
            <div className="score-details">
              <h4 className="text-xl font-bold">
                {getScoreMessage(scoreData.score)}
              </h4>
              <p className="text-gray-700">
                {scoreData.score >= 80 ? 
                  "Your resume aligns very well with this position's requirements. You're a strong candidate!" : 
                  (scoreData.score >= 60 ? 
                    "Your resume matches many requirements but there are areas for improvement." : 
                    "There are significant gaps between your resume and the job requirements.")}
              </p>
            </div>
          </div>
          
          {/* Core Metrics */}
          <h4 className="text-lg font-semibold mt-8 mb-4">Core Metrics</h4>
          <div className="metrics-container flex flex-row gap-4">
            {/* Keywords Match */}
            <div className="metric-item flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">Keywords Match</span>
                <span className="font-medium">
                  {scoreData.keywordsMatchPercentage !== undefined ? 
                    `${Math.round(scoreData.keywordsMatchPercentage)}%` : 
                    `${Math.round(Math.min(100, scoreData.score + 10))}%`}
                </span>
              </div>
              <div className="w-full bg-gray-200 h-2.5 rounded-full print-bar">
                <div 
                  className={`${getProgressBarColor(scoreData.score)} h-2.5 rounded-full`}
                  style={{ width: `${scoreData.keywordsMatchPercentage !== undefined ? 
                    Math.round(scoreData.keywordsMatchPercentage) : 
                    Math.round(Math.min(100, scoreData.score + 10))}%` }}
                ></div>
              </div>
            </div>
            
            {/* Experience Level */}
            <div className="metric-item flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">Experience Level</span>
                <span className="font-medium">
                  {scoreData.experienceLevelPercentage !== undefined ? 
                    `${Math.round(scoreData.experienceLevelPercentage)}%` : 
                    `${Math.round(Math.max(0, scoreData.score - 5))}%`}
                </span>
              </div>
              <div className="w-full bg-gray-200 h-2.5 rounded-full print-bar">
                <div 
                  className={`${getProgressBarColor(scoreData.score)} h-2.5 rounded-full`}
                  style={{ width: `${scoreData.experienceLevelPercentage !== undefined ? 
                    Math.round(scoreData.experienceLevelPercentage) : 
                    Math.round(Math.max(0, scoreData.score - 5))}%` }}
                ></div>
              </div>
            </div>
            
            {/* Skills Relevance */}
            <div className="metric-item flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">Skills Relevance</span>
                <span className="font-medium">
                  {scoreData.skillsRelevancePercentage !== undefined ? 
                    `${Math.round(scoreData.skillsRelevancePercentage)}%` : 
                    `${Math.round(scoreData.score)}%`}
                </span>
              </div>
              <div className="w-full bg-gray-200 h-2.5 rounded-full print-bar">
                <div 
                  className={`${getProgressBarColor(scoreData.score)} h-2.5 rounded-full`}
                  style={{ width: `${scoreData.skillsRelevancePercentage !== undefined ? 
                    Math.round(scoreData.skillsRelevancePercentage) : 
                    Math.round(scoreData.score)}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
            <p>These metrics show how well your resume matches the job description. Higher scores indicate better alignment with what employers are looking for.</p>
          </div>
          
          {/* Overall Assessment */}
          <div className="print-section-content">
            <h3 className="print-section-header">Overall Assessment</h3>
            <div className="p-4 border border-blue-100 rounded-lg bg-blue-50">
              {formatFeedback(feedback)}
            </div>
          </div>
          
          {/* Matching Skills */}
          <div className="print-section-content">
            <h3 className="print-section-header">Matching Skills</h3>
            {skillsMatch.length > 0 ? (
              <div className="skills-container">
                {skillsMatch.map((skill, index) => (
                  <span 
                    key={index} 
                    className="skill-pill"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No matching skills identified.</p>
            )}
          </div>
          
          {/* Improvement Areas */}
          <div className="print-section-content">
            <h3 className="print-section-header">Areas for Improvement</h3>
            {improvementAreas.length > 0 ? (
              <ul className="improvement-list">
                {improvementAreas.map((area, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-gray-700 flex-1">{area.replace(/^[\*\-]\s*/, '')}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No specific improvement areas identified.</p>
            )}
          </div>
          
          <div className="page-break-before"></div>
          
          {/* Industry Insights */}
          <div className="print-section-content">
            <h3 className="print-section-header">Industry Insights</h3>
            {industryInsights ? (
              <div className="p-4 border border-blue-100 rounded-lg bg-blue-50">
                <div className="mb-3">
                  <h4 className="text-lg font-semibold text-blue-700">{industryInsights.title}</h4>
                  <div className="text-sm text-gray-600 mb-2">Industry: {industryInsights.industry}</div>
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
            ) : (
              <p className="text-gray-500 italic">No industry-specific insights available.</p>
            )}
          </div>
          
          {/* Formatting Checks */}
          <div className="print-section-content">
            <h3 className="print-section-header">Resume Format Analysis</h3>
            {formattingChecks ? (
              <div className="p-4 border border-purple-100 rounded-lg">
                {/* Font Check Section */}
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <h5 className="text-md font-medium text-gray-800">Font & Typography</h5>
                    <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${
                      formattingChecks.font_check.passed ? 'status-passed' : 'status-needs-improvement'
                    }`}>
                      {formattingChecks.font_check.passed ? 'Passed' : 'Needs Improvement'}
                    </span>
                  </div>
                  <ul className="formatting-list">
                    {processDetails(formattingChecks.font_check.details).map((detail, index) => (
                      <li key={index} className={`status-${detail.status}`}>
                        <span>{detail.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Layout Check Section */}
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <h5 className="text-md font-medium text-gray-800">Layout & Structure</h5>
                    <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${
                      formattingChecks.layout_check.passed ? 'status-passed' : 'status-needs-improvement'
                    }`}>
                      {formattingChecks.layout_check.passed ? 'Passed' : 'Needs Improvement'}
                    </span>
                  </div>
                  <ul className="formatting-list">
                    {processDetails(formattingChecks.layout_check.details).map((detail, index) => (
                      <li key={index} className={`status-${detail.status}`}>
                        <span>{detail.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Page Setup Check Section */}
                <div>
                  <div className="flex items-center mb-2">
                    <h5 className="text-md font-medium text-gray-800">Page Setup & Dimensions</h5>
                    <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${
                      formattingChecks.page_setup_check.passed ? 'status-passed' : 'status-needs-improvement'
                    }`}>
                      {formattingChecks.page_setup_check.passed ? 'Passed' : 'Needs Improvement'}
                    </span>
                  </div>
                  <ul className="formatting-list">
                    {processDetails(formattingChecks.page_setup_check.details).map((detail, index) => (
                      <li key={index} className={`status-${detail.status}`}>
                        <span>{detail.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">No formatting check results available.</p>
            )}
          </div>
          
          {/* Footer */}
          <div className="print-footer">
            <div>Generated by NaukriGuru Resume Analyzer</div>
            <div>{new Date().toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</div>
          </div>
        </div>
      )}
    </div>
  );
  
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md">
      <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 className="text-xl font-semibold text-deep-blue">Detailed Feedback</h3>
        <button 
          onClick={onPrint}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none no-print transition-all duration-200 hover:shadow"
        >
          <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
          </svg>
          Print Results
        </button>
      </div>
      
      {/* Print View */}
      <PrintView />
      
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto border-b border-gray-200 bg-white sticky top-0 z-10 no-print shadow-sm">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-3 font-medium text-sm transition-all ${
            activeTab === 'all'
              ? 'text-accent-orange border-b-2 border-accent-orange'
              : 'text-gray-500 hover:text-deep-blue'
          }`}
        >
          Overall Assessment
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`px-4 py-3 font-medium text-sm transition-all ${
            activeTab === 'skills'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-500 hover:text-deep-blue'
          }`}
        >
          Matching Skills
        </button>
        <button
          onClick={() => setActiveTab('improvements')}
          className={`px-4 py-3 font-medium text-sm transition-all ${
            activeTab === 'improvements'
              ? 'text-amber-600 border-b-2 border-amber-600'
              : 'text-gray-500 hover:text-deep-blue'
          }`}
        >
          Improvement Areas
        </button>
        <button
          onClick={() => setActiveTab('industry')}
          className={`px-4 py-3 font-medium text-sm transition-all ${
            activeTab === 'industry'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-deep-blue'
          }`}
        >
          Industry Insights
        </button>
        <button
          onClick={() => setActiveTab('formatting')}
          className={`px-4 py-3 font-medium text-sm transition-all ${
            activeTab === 'formatting'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-500 hover:text-deep-blue'
          }`}
        >
          Formatting Checks
        </button>
      </div>
      
      <div className="p-6 space-y-8">
        {/* General Feedback */}
        {(activeTab === 'all') && (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 transition-all duration-300 hover:shadow-md">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-deep-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-lg font-semibold mb-4 text-deep-blue">Overall Assessment</h4>
                {formatFeedback(feedback)}
              </div>
            </div>
          </div>
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
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800 shadow-sm"
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
                      <li key={index} className="flex items-start bg-white p-3 rounded-md shadow-sm">
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
    </div>
  );
} 