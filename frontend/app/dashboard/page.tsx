'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { ApiClient } from '@/lib/api';
import { useToast } from '@/components/Toast';
import { handleAsyncOperation } from '@/lib/error-utils';

const apiClient = new ApiClient();

interface DashboardStats {
  totalResumes: number;
  totalAnalyses: number;
  averageScore: number;
  recentAnalyses: any[];
}

export default function Dashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalResumes: 0,
    totalAnalyses: 0,
    averageScore: 0,
    recentAnalyses: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      if (user) {
        await handleAsyncOperation(
          async () => {
            const [userResumes, userAnalyses] = await Promise.all([
              apiClient.getUserResumes(),
              apiClient.getUserAnalyses(5) // Get only 5 most recent analyses
            ]);
            
            // Calculate average score
            const scores = userAnalyses.map(analysis => analysis.match_score);
            const averageScore = scores.length > 0 
              ? scores.reduce((a, b) => a + b, 0) / scores.length 
              : 0;
            
            setStats({
              totalResumes: userResumes.length,
              totalAnalyses: userAnalyses.length,
              averageScore: Math.round(averageScore),
              recentAnalyses: userAnalyses.slice(0, 5),
            });
            
            return { userResumes, userAnalyses };
          },
          {
            setLoading,
            showToast,
            errorMessage: 'Failed to load dashboard data'
          }
        );
      }
    }

    fetchDashboardData();
  }, [user, showToast]);

  const quickActions = [
    {
      title: 'Analyze Resume',
      description: 'Upload a resume and match it with a job description',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-orange" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      ),
      href: '/dashboard/analyze',
    },
    {
      title: 'View History',
      description: 'See your past resume analyses and results',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-orange" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
      href: '/dashboard/history',
    },
    {
      title: 'Update Profile',
      description: 'Manage your account settings and preferences',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-orange" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      ),
      href: '/dashboard/profile',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-orange"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-deep-blue">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Resumes</p>
              <p className="text-3xl font-bold text-deep-blue">{stats.totalResumes}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-deep-blue" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Analyses</p>
              <p className="text-3xl font-bold text-deep-blue">{stats.totalAnalyses}</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-orange" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Score</p>
              <p className="text-3xl font-bold text-deep-blue">{stats.averageScore}%</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-deep-blue mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {quickActions.map((action, index) => (
            <Link 
              key={index} 
              href={action.href}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                {action.icon}
                <h3 className="mt-4 font-semibold text-deep-blue">{action.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Recent Analyses */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold text-deep-blue">Recent Analyses</h2>
          <Link href="/dashboard/history" className="text-accent-orange hover:underline text-sm">
            View All
          </Link>
        </div>
        
        {stats.recentAnalyses.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                    Score
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentAnalyses.map((analysis, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {analysis.created_at && analysis.created_at.seconds 
                        ? new Date(analysis.created_at.seconds * 1000).toLocaleDateString() 
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {analysis.resume_name || 'Resume'}
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
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">No analyses yet. Start by analyzing a resume!</p>
            <Link 
              href="/dashboard/analyze" 
              className="mt-4 inline-block px-4 py-2 bg-accent-orange text-white rounded-md hover:bg-accent-orange/90 transition-colors"
            >
              Analyze Resume
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 