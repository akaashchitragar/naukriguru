'use client';

import React from 'react';

interface HeadingCardProps {
  icon?: React.ReactNode;
  title: string;
  year?: number | string;
  badges?: Array<{
    label: string;
    color?: 'blue' | 'purple' | 'green' | 'default';
  }>;
  className?: string;
}

/**
 * HeadingCard - A component for displaying important section headings with badges
 * Handles long titles gracefully and works well across different screen sizes
 */
export default function HeadingCard({ 
  icon, 
  title, 
  year, 
  badges = [],
  className = ''
}: HeadingCardProps) {
  // Determine color classes for badges
  const getBadgeClasses = (color?: 'blue' | 'purple' | 'green' | 'default') => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-800 print:bg-blue-50 print:border print:border-blue-200';
      case 'purple':
        return 'bg-purple-100 text-purple-800 print:bg-purple-50 print:border print:border-purple-200';
      case 'green':
        return 'bg-green-100 text-green-800 print:bg-green-50 print:border print:border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 print:bg-gray-50 print:border print:border-gray-200';
    }
  };

  // Generate print-friendly class additions
  const headingCardClasses = `flex items-center print:shadow-none print:border-gray-300 print:bg-white ${className}`;

  return (
    <div className={headingCardClasses}>
      {icon && <div className="flex-shrink-0 mr-3 print:text-black">{icon}</div>}
      
      <div className="flex flex-col w-full">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {/* Title without truncation to ensure full visibility */}
          <h3 
            className="text-lg font-semibold text-blue-700 break-normal print:text-black"
          >
            {title}
          </h3>
          
          {/* Move badges below on narrower screens or when title is long */}
          <div className="flex flex-wrap gap-2 items-center">
            {/* Year badge with highlight */}
            {year && (
              <div className="flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full print:bg-transparent print:border print:border-green-800">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-3.5 w-3.5 mr-1 print:hidden" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 10V3L4 14h7v7l9-11h-7z" 
                  />
                </svg>
                <span>{year} {typeof year === 'number' && year >= 2000 ? 'Latest' : ''}</span>
              </div>
            )}
            
            {/* Additional badges */}
            {badges.map((badge, index) => (
              <span 
                key={index}
                className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap overflow-hidden text-ellipsis max-w-[160px] print:max-w-none print:overflow-visible print:whitespace-normal ${getBadgeClasses(badge.color)}`}
                title={badge.label} // Show full label on hover if truncated
              >
                {badge.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 