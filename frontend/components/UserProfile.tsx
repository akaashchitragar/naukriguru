'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { ApiClient } from '@/lib/api';

const apiClient = new ApiClient();

interface Resume {
  id: string;
  file_name: string;
  file_url: string;
  created_at: any;
}

interface Analysis {
  id: string;
  resume_id: string;
  job_description: string;
  match_score: number;
  created_at: any;
}

export default function UserProfile() {
  const { user, logout } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      if (user) {
        setLoading(true);
        try {
          const userResumes = await apiClient.getUserResumes();
          const userAnalyses = await apiClient.getUserAnalyses();
          
          setResumes(userResumes);
          setAnalyses(userAnalyses);
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchUserData();
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Loading your data...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Recent Analyses */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-indigo-700">
              Recent Analyses
            </h3>
            {analyses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Resume
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Match Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analyses.map((analysis) => {
                      const resume = resumes.find(r => r.id === analysis.resume_id);
                      return (
                        <tr key={analysis.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(analysis.created_at?.seconds * 1000).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {resume?.file_name || 'Unknown'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              analysis.match_score >= 80
                                ? 'bg-green-100 text-green-800'
                                : analysis.match_score >= 60
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {analysis.match_score}%
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button className="text-indigo-600 hover:text-indigo-900">
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 italic">No analyses found.</p>
            )}
          </div>

          {/* Uploaded Resumes */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-indigo-700">
              My Resumes
            </h3>
            {resumes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resumes.map((resume) => (
                  <div
                    key={resume.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center mb-2">
                      <svg
                        className="w-8 h-8 text-indigo-500 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="truncate font-medium">
                        {resume.file_name}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">
                      Uploaded on{' '}
                      {new Date(resume.created_at?.seconds * 1000).toLocaleDateString()}
                    </p>
                    <div className="flex space-x-2">
                      <a
                        href={resume.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-600 hover:text-indigo-800"
                      >
                        View
                      </a>
                      <button className="text-sm text-red-600 hover:text-red-800">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No resumes uploaded yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 