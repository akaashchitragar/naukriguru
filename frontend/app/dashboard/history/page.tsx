'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { ApiClient } from '@/lib/api';
import { useToast } from '@/components/Toast';
import { handleAsyncOperation } from '@/lib/error-utils';

const apiClient = new ApiClient();

interface Analysis {
  id: string;
  resume_id: string;
  resume_name?: string;
  job_description: string;
  match_score: number;
  created_at: any;
}

export default function HistoryPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    async function fetchAnalyses() {
      if (user) {
        await handleAsyncOperation(
          async () => {
            const userAnalyses = await apiClient.getUserAnalyses(50); // Get up to 50 analyses
            setAnalyses(userAnalyses);
            return userAnalyses;
          },
          {
            setLoading,
            showToast,
            errorMessage: 'Failed to load analysis history'
          }
        );
      }
    }

    fetchAnalyses();
  }, [user, showToast]);

  // Filter and sort analyses
  const filteredAnalyses = analyses
    .filter(analysis => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        (analysis.resume_name && analysis.resume_name.toLowerCase().includes(searchLower)) ||
        analysis.job_description.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = a.created_at?.seconds || 0;
        const dateB = b.created_at?.seconds || 0;
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        return sortOrder === 'asc' 
          ? a.match_score - b.match_score 
          : b.match_score - a.match_score;
      }
    });

  const toggleSort = (field: 'date' | 'score') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-orange"></div>
          <p className="mt-2 text-gray-600">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-deep-blue">Analysis History</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 w-full">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between mb-4 space-y-4 md:space-y-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search analyses..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => toggleSort('date')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md ${
                sortBy === 'date' ? 'bg-deep-blue text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <span>Date</span>
              {sortBy === 'date' && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  {sortOrder === 'asc' ? (
                    <path
                      fillRule="evenodd"
                      d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  ) : (
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  )}
                </svg>
              )}
            </button>
            
            <button
              onClick={() => toggleSort('score')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md ${
                sortBy === 'score' ? 'bg-deep-blue text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <span>Score</span>
              {sortBy === 'score' && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  {sortOrder === 'asc' ? (
                    <path
                      fillRule="evenodd"
                      d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  ) : (
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  )}
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Analysis List */}
        {filteredAnalyses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resume
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAnalyses.map((analysis) => (
                  <tr key={analysis.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {analysis.created_at && analysis.created_at.seconds 
                        ? new Date(analysis.created_at.seconds * 1000).toLocaleDateString() 
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {analysis.resume_name || 'Resume'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {analysis.job_description.substring(0, 50)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        analysis.match_score >= 70 
                          ? 'bg-green-100 text-green-800' 
                          : analysis.match_score >= 40 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {analysis.match_score}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Link href={`/dashboard/history/${analysis.id}`} className="text-accent-orange hover:underline">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No analyses found. {searchTerm ? 'Try a different search term.' : 'Start by analyzing a resume!'}</p>
            {!searchTerm && (
              <Link 
                href="/dashboard/analyze" 
                className="mt-4 inline-block px-4 py-2 bg-accent-orange text-white rounded-md hover:bg-accent-orange/90 transition-colors"
              >
                Analyze Resume
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 