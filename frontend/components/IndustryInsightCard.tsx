'use client';

import React from 'react';
import HeadingCard from './ui/HeadingCard';

// Icons for industry categories
import { 
  BriefcaseIcon, 
  CodeBracketIcon, 
  CurrencyDollarIcon, 
  BuildingOfficeIcon,
  AcademicCapIcon 
} from './icons';

interface IndustryInsightCardProps {
  title: string;
  industry: string;
  jobTitle?: string;
  currentYear?: number;
  className?: string;
}

// Map of industry names to appropriate icons
const INDUSTRY_ICONS: Record<string, React.ReactNode> = {
  'Software Development': <CodeBracketIcon className="w-6 h-6 text-blue-600" />,
  'Finance': <CurrencyDollarIcon className="w-6 h-6 text-green-600" />,
  'Sales': <BriefcaseIcon className="w-6 h-6 text-blue-600" />,
  'Marketing': <BuildingOfficeIcon className="w-6 h-6 text-purple-600" />,
  'Education': <AcademicCapIcon className="w-6 h-6 text-amber-600" />,
  'Account Management': <BriefcaseIcon className="w-6 h-6 text-blue-600" />,
  // Default icon will be used for other industries
};

/**
 * IndustryInsightCard - Specialized component for displaying industry insights
 * with appropriate icons and styling
 */
export default function IndustryInsightCard({
  title,
  industry,
  jobTitle,
  currentYear,
  className = ''
}: IndustryInsightCardProps) {
  // Determine the icon based on the industry
  const getIndustryIcon = () => {
    // First, check for exact matches
    if (INDUSTRY_ICONS[industry]) {
      return INDUSTRY_ICONS[industry];
    }
    
    // Then, check for partial matches
    const matchingKey = Object.keys(INDUSTRY_ICONS).find(key => 
      industry.toLowerCase().includes(key.toLowerCase())
    );
    
    if (matchingKey) {
      return INDUSTRY_ICONS[matchingKey];
    }
    
    // Default icon if no match found
    return <BriefcaseIcon className="w-6 h-6 text-gray-600" />;
  };
  
  // Prepare badges for the HeadingCard
  const prepareBadges = () => {
    const badges = [];
    
    // Add industry badge
    badges.push({
      label: industry,
      color: 'blue' as const
    });
    
    // Add job title badge if present
    if (jobTitle) {
      badges.push({
        label: jobTitle,
        color: 'purple' as const
      });
    }
    
    return badges;
  };
  
  return (
    <HeadingCard
      title={title}
      year={currentYear}
      badges={prepareBadges()}
      className={className}
    />
  );
} 