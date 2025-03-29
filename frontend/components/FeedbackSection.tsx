   'use client';

import React, { useState } from 'react';
import IndustryInsightCard from './IndustryInsightCard';

interface FeedbackSectionProps {
  feedback: string;
  skillsMatch: string[];
  improvementAreas: string[];
  industryInsights?: {
    industry: string;
    title: string;
    recommendations: string[];
    current_year?: number;
    market_overview?: string;
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
  const [activeTab, setActiveTab] = useState<'all' | 'skills' | 'improvements' | 'industry' | 'formatting' | 'quicktips'>('all');
  
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
  
  // Function to get quick resume tips for job search success
  const getQuickTips = () => {
    return [
      {
        title: "ATS Optimization",
        description: "Applicant Tracking Systems filter resumes before they reach human eyes",
        icon: (
          <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        ),
        items: [
          "Use standard section headings (Experience, Education, Skills)",
          "Mirror keywords from the job description in your resume",
          "Use a simple, single-column layout for better parsing",
          "Save your resume as a PDF to preserve formatting"
        ]
      },
      {
        title: "Keyword Optimization",
        description: "Strategic keyword placement increases your match rate",
        icon: (
          <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
        ),
        items: [
          "Include industry-specific terminology and acronyms",
          "List both hard skills (technical abilities) and soft skills (communication)",
          "Add relevant certifications and tools you're proficient with",
          "Use both spelled-out terms and acronyms (e.g., 'Artificial Intelligence (AI)')"
        ]
      },
      {
        title: "Experience Highlighting",
        description: "Showcase relevant achievements aligned with the job requirements",
        icon: (
          <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        ),
        items: [
          "Quantify achievements with specific metrics and percentages",
          "Use action verbs to begin each bullet point (Developed, Created, Led)",
          "Tailor your experience to highlight most relevant responsibilities",
          "Include results and outcomes, not just job duties"
        ]
      }
    ];
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
    
    const currentYear = industryInsights.current_year || new Date().getFullYear();
    
    return (
      <div className="ml-4 flex-1">
        {/* Use the IndustryInsightCard with direct styling */}
        <IndustryInsightCard
          title={industryInsights.title}
          industry={industryInsights.industry}
          jobTitle={jobTitle}
          currentYear={currentYear}
          className="mb-4"
        />

        {/* Market overview section */}
        {industryInsights.market_overview && (
          <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-md">
            <p className="text-blue-800 text-sm italic">{industryInsights.market_overview}</p>
          </div>
        )}
        
        {/* Recommendations list */}
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
              <div className="p-4 rounded-lg">
                {/* Use consistent component for print view as well */}
                <IndustryInsightCard
                  title={industryInsights.title}
                  industry={industryInsights.industry}
                  jobTitle={jobTitle}
                  currentYear={industryInsights.current_year}
                  className="mb-4 print-friendly"
                />
                
                {industryInsights.market_overview && (
                  <div className="mb-4 p-3 bg-blue-100 border-l-4 border-blue-400 rounded-r-md">
                    <p className="text-blue-800 text-sm italic">{industryInsights.market_overview}</p>
                  </div>
                )}
                
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
          onClick={() => setActiveTab('quicktips')}
          className={`px-4 py-3 font-medium text-sm transition-all ${
            activeTab === 'quicktips'
              ? 'text-deep-blue border-b-2 border-deep-blue'
              : 'text-gray-500 hover:text-deep-blue'
          }`}
        >
          Quick Tips
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
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border border-blue-200 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-deep-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-lg font-semibold mb-3 text-deep-blue">Overall Assessment</h4>
                <div className="space-y-5">
                  {/* Summary Card */}
                  <div className="bg-white p-5 rounded-lg shadow-sm border border-blue-100">
                    <div className="flex items-center mb-3 pb-2 border-b border-gray-100">
                      <div className="p-2 bg-blue-100 rounded-full mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h5 className="text-md font-medium text-gray-800">Resume Summary</h5>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md border-l-4 border-blue-400">
                      {formatFeedback(feedback)}
                    </div>
                  </div>
                  
                  {/* Action Steps Card */}
                  <div className="bg-white p-5 rounded-lg shadow-sm border border-blue-100">
                    <div className="flex items-center mb-3 pb-2 border-b border-gray-100">
                      <div className="p-2 bg-blue-100 rounded-full mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <h5 className="text-md font-medium text-gray-800">Next Steps</h5>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-start p-2 rounded-md hover:bg-blue-50 transition-all duration-200">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-3 text-white font-medium text-sm shadow-sm">
                          1
                        </div>
                        <p className="text-gray-700 text-sm">
                          <span className="font-medium">Explore the tabs above</span> to see detailed feedback on your skills, improvement areas, and industry insights.
                        </p>
                      </div>
                      
                      <div className="flex items-start p-2 rounded-md hover:bg-blue-50 transition-all duration-200">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-3 text-white font-medium text-sm shadow-sm">
                          2
                        </div>
                        <p className="text-gray-700 text-sm">
                          <span className="font-medium">Focus on improvement areas</span> to enhance your resume's effectiveness.
                        </p>
                      </div>
                      
                      <div className="flex items-start p-2 rounded-md hover:bg-blue-50 transition-all duration-200">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-3 text-white font-medium text-sm shadow-sm">
                          3
                        </div>
                        <p className="text-gray-700 text-sm">
                          <span className="font-medium">Check formatting guidelines</span> to ensure your resume is readable by both ATS systems and recruiters.
                        </p>
                      </div>
                      
                      <div className="flex items-start p-2 rounded-md hover:bg-blue-50 transition-all duration-200">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-3 text-white font-medium text-sm shadow-sm">
                          4
                        </div>
                        <p className="text-gray-700 text-sm">
                          <span className="font-medium">Review industry insights</span> to align your resume with current market trends and employer expectations.
                        </p>
                      </div>
                      
                      {onPrint && (
                        <div className="flex items-start p-2 rounded-md hover:bg-blue-50 transition-all duration-200">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-3 text-white font-medium text-sm shadow-sm">
                            5
                          </div>
                          <p className="text-gray-700 text-sm">
                            <span className="font-medium">Print or save the detailed report</span> using the "Print Results" button at the top.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Quick Tips Section as a separate tab */}
        {(activeTab === 'quicktips') && (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 transition-all duration-300 hover:shadow-md">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-deep-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-deep-blue">Quick Resume Tips</h4>
                <p className="text-sm text-gray-600">Boost your chances of getting noticed by recruiters and ATS systems</p>
              </div>
            </div>
            
            <div className="space-y-4 mt-4">
              {getQuickTips().map((tip, index) => (
                <div 
                  key={tip.title}
                  className="border border-gray-200 rounded-lg overflow-hidden bg-white"
                >
                  <div className={`px-4 py-3 flex items-center border-b border-gray-200 ${
                    tip.title === "ATS Optimization" ? "bg-gradient-to-r from-blue-50 to-blue-100" :
                    tip.title === "Keyword Optimization" ? "bg-gradient-to-r from-purple-50 to-purple-100" :
                    "bg-gradient-to-r from-yellow-50 to-yellow-100"
                  }`}>
                    <div className="mr-3">{tip.icon}</div>
                    <div>
                      <h5 className="font-medium text-gray-900">{tip.title}</h5>
                      <p className="text-xs text-gray-500">{tip.description}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-2">
                      {tip.items.map((item, i) => (
                        <li key={i} className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Skills Match */}
        {(activeTab === 'skills') && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-lg font-semibold mb-3 text-green-800">Matching Skills</h4>
                <p className="text-sm text-green-700 mb-4 bg-green-100 p-3 rounded-md border-l-4 border-green-500">
                  These skills from your resume align with the job requirements. Highlighting them can increase your chances of getting selected.
                </p>
                
                {skillsMatch.length > 0 ? (
                  <div className="space-y-6">
                    {/* Categories */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Technical Skills */}
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center mb-3">
                          <div className="p-1.5 bg-green-100 rounded-md mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                          </div>
                          <h5 className="font-medium text-gray-800">Technical Skills</h5>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {skillsMatch
                            .filter(skill => isTechnicalSkill(skill))
                            .map((skill, index) => (
                              <span 
                                key={index} 
                                className="inline-flex items-center px-2.5 py-1.5 rounded-md text-sm font-medium bg-green-100 text-green-800 border border-green-200"
                              >
                                {skill}
                              </span>
                            ))}
                          {skillsMatch.filter(skill => isTechnicalSkill(skill)).length === 0 && (
                            <span className="text-sm text-gray-500 italic">No technical skills identified</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Soft Skills */}
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center mb-3">
                          <div className="p-1.5 bg-green-100 rounded-md mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <h5 className="font-medium text-gray-800">Soft Skills</h5>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {skillsMatch
                            .filter(skill => isSoftSkill(skill))
                            .map((skill, index) => (
                              <span 
                                key={index} 
                                className="inline-flex items-center px-2.5 py-1.5 rounded-md text-sm font-medium bg-emerald-100 text-emerald-800 border border-emerald-200"
                              >
                                {skill}
                              </span>
                            ))}
                          {skillsMatch.filter(skill => isSoftSkill(skill)).length === 0 && (
                            <span className="text-sm text-gray-500 italic">No soft skills identified</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Industry Knowledge */}
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center mb-3">
                          <div className="p-1.5 bg-green-100 rounded-md mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <h5 className="font-medium text-gray-800">Industry Knowledge</h5>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {skillsMatch
                            .filter(skill => isIndustryKnowledge(skill))
                            .map((skill, index) => (
                              <span 
                                key={index} 
                                className="inline-flex items-center px-2.5 py-1.5 rounded-md text-sm font-medium bg-teal-100 text-teal-800 border border-teal-200"
                              >
                                {skill}
                              </span>
                            ))}
                          {skillsMatch.filter(skill => isIndustryKnowledge(skill)).length === 0 && (
                            <span className="text-sm text-gray-500 italic">No industry knowledge identified</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* All Skills */}
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-green-100">
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <h5 className="font-medium text-gray-800">All Matching Skills</h5>
                        </div>
                        <span className="text-sm font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full">
                          {skillsMatch.length} skills
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {skillsMatch.map((skill, index) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-green-50 to-green-100 text-green-800 border border-green-200 hover:shadow-sm transition-all duration-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Tips Card */}
                    <div className="bg-green-100 p-4 rounded-lg flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-700 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-green-800 font-medium">
                        Make these skills stand out in your resume by quantifying achievements and providing specific examples that demonstrate your expertise.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 bg-white rounded-lg border border-dashed border-green-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-gray-500 italic mb-2">No matching skills identified.</p>
                    <p className="text-sm text-gray-600">Try updating your resume with keywords from the job description to improve your match rate.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Improvement Areas */}
        {(activeTab === 'improvements') && (
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-lg border border-amber-200 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-lg font-semibold mb-4 text-amber-800">Areas for Improvement</h4>
                <p className="text-sm text-amber-700 mb-4 bg-amber-100 p-3 rounded-md border-l-4 border-amber-500">
                  Address these areas to significantly improve your resume's effectiveness and match rate.
                </p>
                {improvementAreas.length > 0 ? (
                  <div className="space-y-4">
                    {improvementAreas.map((area, index) => (
                      <div 
                        key={index} 
                        className="flex items-start bg-white p-4 rounded-md shadow-sm border border-amber-200 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mr-3 text-white font-semibold shadow-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800 leading-relaxed">
                            {area.replace(/^[\*\-]\s*/, '')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6 bg-white rounded-lg border border-dashed border-amber-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-amber-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-500 italic">No specific improvement areas identified. Your resume appears to be well-aligned with this position!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Industry-specific Recommendations */}
        {(activeTab === 'industry') && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-lg font-semibold mb-4 text-blue-800">Industry Insights</h4>
                
                {!industryInsights ? (
                  <div className="text-center p-6 bg-white rounded-lg border border-dashed border-blue-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-blue-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-500 italic">No industry-specific insights available.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Industry Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-blue-100 overflow-hidden">
                      <div className="p-4 bg-gradient-to-r from-blue-100 to-indigo-100 border-b border-blue-200">
                        <div className="flex items-center">
                          <div className="p-2 bg-white rounded-md shadow-sm mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <h5 className="text-lg font-semibold text-blue-900">{industryInsights.title}</h5>
                            <div className="flex flex-wrap items-center text-sm text-blue-700 mt-1">
                              <span className="bg-blue-50 px-2.5 py-0.5 rounded-full font-medium mr-2">
                                {industryInsights.industry}
                              </span>
                              {jobTitle && (
                                <span className="bg-indigo-50 px-2.5 py-0.5 rounded-full font-medium mr-2">
                                  {jobTitle}
                                </span>
                              )}
                              <span className="text-gray-500">
                                {industryInsights.current_year || new Date().getFullYear()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Market Overview Section */}
                      {industryInsights.market_overview && (
                        <div className="p-4 border-b border-blue-100">
                          <div className="flex">
                            <div className="flex-shrink-0 mt-1 mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                              </svg>
                            </div>
                            <div>
                              <h6 className="text-sm font-medium text-blue-800 mb-2">Market Overview</h6>
                              <p className="text-sm text-gray-700 italic bg-blue-50 p-3 rounded-md border-l-3 border-blue-300">
                                {industryInsights.market_overview}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Recommendations Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-blue-100 overflow-hidden">
                      <div className="p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <h5 className="text-md font-semibold text-blue-800">Industry Recommendations</h5>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="space-y-4">
                          {industryInsights.recommendations.map((recommendation, index) => (
                            <div 
                              key={index} 
                              className="flex items-start p-3 rounded-md bg-white border border-blue-100 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
                            >
                              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-3 text-white font-medium text-sm shadow-sm">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <p className="text-gray-700 leading-relaxed">
                                  {recommendation.replace(/^[\*\-]\s*/, '')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Industry Tips */}
                    <div className="bg-blue-100 p-4 rounded-lg flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-blue-800 font-medium">
                        Following these industry-specific recommendations can significantly improve your resume's relevance and appeal to employers in this field.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Formatting Checks */}
        {(activeTab === 'formatting') && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-lg font-semibold mb-4 text-purple-800">Resume Format Analysis</h4>
                <p className="text-sm text-purple-700 mb-5 bg-purple-100 p-3 rounded-md border-l-4 border-purple-500">
                  Proper formatting ensures your resume is readable by both ATS systems and human recruiters. Address the items below to improve your resume's presentation.
                </p>
                
                {!formattingChecks ? (
                  <div className="text-center p-6 bg-white rounded-lg border border-dashed border-purple-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-purple-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-500 italic">No formatting check results available.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Font Check Section */}
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-purple-100">
                      <div className="flex items-center mb-3 pb-2 border-b border-gray-100">
                        <div className="p-1.5 bg-purple-100 rounded-md mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                          </svg>
                        </div>
                        <h5 className="text-md font-medium text-gray-800 flex-grow">Font & Typography</h5>
                      </div>
                      <div className="space-y-2">
                        {processDetails(formattingChecks.font_check.details).map((detail, index) => (
                          <div 
                            key={index} 
                            className={`flex items-start p-2 rounded-md ${
                              detail.status === 'passed' ? 'bg-green-50' :
                              detail.status === 'failed' ? 'bg-red-50' : 'bg-amber-50'
                            }`}
                          >
                            {renderStatusIcon(detail.status)}
                            <span className="text-gray-700">{detail.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Layout Check Section */}
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-purple-100">
                      <div className="flex items-center mb-3 pb-2 border-b border-gray-100">
                        <div className="p-1.5 bg-purple-100 rounded-md mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                          </svg>
                        </div>
                        <h5 className="text-md font-medium text-gray-800 flex-grow">Layout & Structure</h5>
                      </div>
                      <div className="space-y-2">
                        {processDetails(formattingChecks.layout_check.details).map((detail, index) => (
                          <div 
                            key={index} 
                            className={`flex items-start p-2 rounded-md ${
                              detail.status === 'passed' ? 'bg-green-50' :
                              detail.status === 'failed' ? 'bg-red-50' : 'bg-amber-50'
                            }`}
                          >
                            {renderStatusIcon(detail.status)}
                            <span className="text-gray-700">{detail.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Page Setup Check Section */}
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-purple-100">
                      <div className="flex items-center mb-3 pb-2 border-b border-gray-100">
                        <div className="p-1.5 bg-purple-100 rounded-md mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <h5 className="text-md font-medium text-gray-800 flex-grow">Page Setup & Dimensions</h5>
                      </div>
                      <div className="space-y-2">
                        {processDetails(formattingChecks.page_setup_check.details).map((detail, index) => (
                          <div 
                            key={index} 
                            className={`flex items-start p-2 rounded-md ${
                              detail.status === 'passed' ? 'bg-green-50' :
                              detail.status === 'failed' ? 'bg-red-50' : 'bg-amber-50'
                            }`}
                          >
                            {renderStatusIcon(detail.status)}
                            <span className="text-gray-700">{detail.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Summary Status */}
                    <div className="bg-purple-100 p-4 rounded-lg mt-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-purple-800 font-medium">
                          {(formattingChecks.font_check.passed && formattingChecks.layout_check.passed && formattingChecks.page_setup_check.passed) 
                            ? "Your resume format is well-optimized!" 
                            : "Fix the highlighted issues to improve your resume's formatting."}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper functions to categorize skills
const isTechnicalSkill = (skill: string): boolean => {
  const technicalKeywords = [
    'programming', 'software', 'development', 'code', 'coding', 'technical', 'technology',
    'java', 'python', 'javascript', 'react', 'angular', 'vue', 'node', 'sql', 'database',
    'aws', 'cloud', 'devops', 'analytics', 'analysis', 'excel', 'machine learning', 'ai',
    'algorithm', 'data', 'infrastructure', 'engineering', 'automation', 'security',
    'testing', 'qa', 'backend', 'frontend', 'fullstack', 'mobile', 'web', 'design',
    'architecture', 'system', 'network', 'hardware', 'linux', 'windows', 'git'
  ];
  
  return technicalKeywords.some(keyword => 
    skill.toLowerCase().includes(keyword.toLowerCase())
  );
};

const isSoftSkill = (skill: string): boolean => {
  const softSkillKeywords = [
    'communication', 'teamwork', 'leadership', 'management', 'problem solving', 
    'critical thinking', 'creative', 'creativity', 'time management', 'organization',
    'adaptability', 'flexibility', 'interpersonal', 'presentation', 'public speaking',
    'negotiation', 'persuasion', 'emotional intelligence', 'conflict resolution',
    'collaboration', 'team player', 'verbal', 'written', 'listening', 'feedback',
    'coaching', 'mentoring', 'training', 'detail-oriented', 'customer service',
    'decision making', 'planning', 'prioritization', 'multitasking', 'stress management'
  ];
  
  return softSkillKeywords.some(keyword => 
    skill.toLowerCase().includes(keyword.toLowerCase())
  ) && !isTechnicalSkill(skill);
};

const isIndustryKnowledge = (skill: string): boolean => {
  // If it's neither technical nor soft, categorize as industry knowledge
  return !isTechnicalSkill(skill) && !isSoftSkill(skill);
}; 