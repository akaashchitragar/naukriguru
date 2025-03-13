   'use client';

import React, { useState } from 'react';

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
  const [activeTab, setActiveTab] = useState<'all' | 'skills' | 'improvements' | 'industry'>('all');
  
  // Detect industry from feedback or skills
  const detectIndustry = (): string => {
    const feedbackLower = feedback.toLowerCase();
    const allSkills = [...skillsMatch, ...improvementAreas].map(s => s.toLowerCase());
    const allText = feedbackLower + ' ' + allSkills.join(' ');
    
    const industryKeywords = {
      'IT & Software': ['software', 'developer', 'programming', 'code', 'java', 'python', 'javascript', 'react', 'node', 'web', 'app', 'development', 'frontend', 'backend', 'fullstack', 'devops', 'cloud', 'aws', 'azure', 'database'],
      'Finance & Banking': ['finance', 'banking', 'investment', 'accounting', 'financial', 'bank', 'trading', 'analyst', 'portfolio', 'audit', 'tax', 'compliance', 'risk'],
      'Healthcare': ['healthcare', 'medical', 'clinical', 'doctor', 'nurse', 'patient', 'hospital', 'pharma', 'health', 'care', 'medicine'],
      'Marketing & Sales': ['marketing', 'sales', 'digital', 'social media', 'seo', 'content', 'brand', 'campaign', 'customer', 'market', 'advertising', 'growth'],
      'Manufacturing': ['manufacturing', 'production', 'quality', 'assembly', 'operations', 'supply chain', 'logistics', 'inventory', 'warehouse'],
      'Education': ['education', 'teaching', 'teacher', 'professor', 'academic', 'school', 'university', 'college', 'curriculum', 'student'],
      'Data Science': ['data', 'analytics', 'machine learning', 'ai', 'artificial intelligence', 'statistics', 'analysis', 'visualization', 'big data', 'ml', 'model'],
      'Design': ['design', 'ui', 'ux', 'user interface', 'user experience', 'graphic', 'creative', 'visual', 'product design'],
      'Human Resources': ['hr', 'human resources', 'recruitment', 'talent', 'hiring', 'onboarding', 'employee', 'workforce', 'compensation', 'benefits']
    };
    
    let matchedIndustry = 'General';
    let highestMatchCount = 0;
    
    for (const [industry, keywords] of Object.entries(industryKeywords)) {
      const matchCount = keywords.filter(keyword => allText.includes(keyword)).length;
      if (matchCount > highestMatchCount) {
        highestMatchCount = matchCount;
        matchedIndustry = industry;
      }
    }
    
    return matchedIndustry;
  };
  
  const industry = detectIndustry();
  
  // Define the type for industry recommendations
  type IndustryRecommendation = {
    title: string;
    recommendations: string[];
  };
  
  type IndustryRecommendations = {
    [key: string]: IndustryRecommendation;
  };
  
  // Industry-specific recommendations
  const getIndustryRecommendations = (industry: string): IndustryRecommendation => {
    const recommendations: IndustryRecommendations = {
      'IT & Software': {
        title: 'IT & Software Industry Recommendations',
        recommendations: [
          'Highlight specific programming languages and frameworks with years of experience',
          'Quantify your achievements with metrics (e.g., "Reduced page load time by 40%")',
          'Include links to your GitHub profile or portfolio',
          'Mention specific methodologies you\'re familiar with (Agile, Scrum, etc.)',
          'List certifications relevant to the role (AWS, Azure, etc.)'
        ]
      },
      'Finance & Banking': {
        title: 'Finance & Banking Industry Recommendations',
        recommendations: [
          'Emphasize regulatory knowledge and compliance experience',
          'Highlight quantitative skills and financial modeling expertise',
          'Include relevant certifications (CFA, CPA, etc.)',
          'Demonstrate experience with financial software and tools',
          'Quantify achievements in terms of portfolio performance or cost savings'
        ]
      },
      'Healthcare': {
        title: 'Healthcare Industry Recommendations',
        recommendations: [
          'Highlight relevant certifications and licenses',
          'Emphasize patient care experience and outcomes',
          'Mention experience with healthcare software (EMR/EHR systems)',
          'Include knowledge of healthcare regulations (HIPAA, etc.)',
          'Demonstrate understanding of medical terminology'
        ]
      },
      'Marketing & Sales': {
        title: 'Marketing & Sales Industry Recommendations',
        recommendations: [
          'Quantify achievements with specific metrics (conversion rates, revenue growth)',
          'Highlight experience with marketing tools and platforms',
          'Showcase campaign results and ROI figures',
          'Include examples of successful strategies or campaigns',
          'Demonstrate knowledge of digital marketing channels'
        ]
      },
      'Manufacturing': {
        title: 'Manufacturing Industry Recommendations',
        recommendations: [
          'Highlight experience with specific manufacturing processes',
          'Mention knowledge of quality control standards (ISO, Six Sigma)',
          'Emphasize safety record and compliance knowledge',
          'Include experience with manufacturing software (ERP, MES)',
          'Quantify improvements in efficiency or cost reduction'
        ]
      },
      'Education': {
        title: 'Education Industry Recommendations',
        recommendations: [
          'Highlight teaching certifications and qualifications',
          'Emphasize student outcomes and achievements',
          'Include experience with educational technologies',
          'Mention curriculum development experience',
          'Showcase classroom management skills'
        ]
      },
      'Data Science': {
        title: 'Data Science Industry Recommendations',
        recommendations: [
          'Highlight specific data science projects with measurable outcomes',
          'Mention experience with data visualization tools',
          'Showcase knowledge of machine learning algorithms',
          'Include experience with big data technologies',
          'Demonstrate statistical analysis skills'
        ]
      },
      'Design': {
        title: 'Design Industry Recommendations',
        recommendations: [
          'Include a link to your portfolio',
          'Highlight experience with design software (Adobe Suite, Figma, etc.)',
          'Showcase successful design projects and their impact',
          'Mention user research and testing experience',
          'Emphasize understanding of design principles'
        ]
      },
      'Human Resources': {
        title: 'Human Resources Industry Recommendations',
        recommendations: [
          'Highlight experience with HR software and HRIS systems',
          'Emphasize knowledge of employment laws and regulations',
          'Include metrics on recruitment efficiency or employee retention',
          'Mention experience with employee development programs',
          'Showcase conflict resolution and mediation skills'
        ]
      },
      'General': {
        title: 'General Industry Recommendations',
        recommendations: [
          'Tailor your resume to match the specific job description',
          'Quantify achievements with specific metrics when possible',
          'Use action verbs to begin bullet points',
          'Include relevant keywords from the job description',
          'Focus on accomplishments rather than just responsibilities'
        ]
      }
    };
    
    return recommendations[industry] || recommendations['General'];
  };
  
  const industryRecommendations = getIndustryRecommendations(industry);

  return (
    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
      <h3 className="text-2xl font-bold mb-6 text-deep-blue">Detailed Feedback</h3>
      
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
          All Feedback
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
      </div>
      
      <div className="space-y-8">
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
                <h4 className="text-lg font-semibold mb-2 text-deep-blue">Overall Assessment</h4>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{feedback}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Skills Match */}
        {(activeTab === 'all' || activeTab === 'skills') && (
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
        {(activeTab === 'all' || activeTab === 'improvements') && (
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
                  <ul className="space-y-2">
                    {improvementAreas.map((area, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-amber-200 text-amber-800 text-xs font-medium mr-2 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{area}</span>
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
        {(activeTab === 'all' || activeTab === 'industry') && (
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 transition-all duration-300 hover:shadow-md">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center mb-3">
                  <h4 className="text-lg font-semibold text-blue-700">{industryRecommendations.title}</h4>
                  <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {industry}
                  </span>
                </div>
                <ul className="space-y-2">
                  {industryRecommendations.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-200 text-blue-800 text-xs font-medium mr-2 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap gap-3 justify-end">
        <button 
          onClick={() => navigator.clipboard.writeText(`Overall Assessment:\n${feedback}\n\nMatching Skills:\n${skillsMatch.join('\n')}\n\nAreas for Improvement:\n${improvementAreas.join('\n')}\n\n${industryRecommendations.title}:\n${industryRecommendations.recommendations.join('\n')}`)}
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