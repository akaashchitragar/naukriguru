'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import { ApiClient } from '@/lib/api';
import { useToast, ToastType } from './Toast';
import { handleAsyncOperation } from '@/lib/error-utils';

const apiClient = new ApiClient();

interface Resume {
  id: string;
  file_name: string;
  file_url: string;
  created_at: any;
}

export default function ResumeList() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedResumes, setSelectedResumes] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);
  const [isMultiDelete, setIsMultiDelete] = useState(false);

  useEffect(() => {
    async function fetchResumes() {
      if (user) {
        await handleAsyncOperation(
          async () => {
            const userResumes = await apiClient.getUserResumes();
            setResumes(userResumes);
            return { userResumes };
          },
          {
            setLoading,
            showToast,
            errorMessage: 'Failed to load resumes'
          }
        );
      }
    }

    fetchResumes();
  }, [user, showToast]);

  const confirmDelete = (resumeId?: string) => {
    if (resumeId) {
      // Single resume delete
      setResumeToDelete(resumeId);
      setIsMultiDelete(false);
    } else {
      // Bulk delete
      setIsMultiDelete(true);
    }
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setResumeToDelete(null);
    setIsMultiDelete(false);
  };

  const handleDeleteResume = async (resumeId: string) => {
    setShowDeleteConfirm(false);
    
    await handleAsyncOperation(
      async () => {
        const success = await apiClient.deleteResume(resumeId);
        if (success) {
          setResumes(prevResumes => prevResumes.filter(resume => resume.id !== resumeId));
          // Also remove from selected if it was selected
          setSelectedResumes(prev => prev.filter(id => id !== resumeId));
        }
        return success;
      },
      {
        showToast,
        successMessage: 'Resume deleted successfully',
        errorMessage: 'Failed to delete resume'
      }
    );
  };

  const handleBulkDelete = async () => {
    if (selectedResumes.length === 0) return;
    
    setShowDeleteConfirm(false);
    setIsDeleting(true);
    
    try {
      let successCount = 0;
      
      for (const resumeId of selectedResumes) {
        try {
          const success = await apiClient.deleteResume(resumeId);
          if (success) successCount++;
        } catch (error) {
          console.error(`Failed to delete resume ${resumeId}:`, error);
        }
      }
      
      if (successCount > 0) {
        setResumes(prevResumes => 
          prevResumes.filter(resume => !selectedResumes.includes(resume.id))
        );
        
        showToast(
          ToastType.SUCCESS, 
          `Successfully deleted ${successCount} ${successCount === 1 ? 'resume' : 'resumes'}`
        );
        
        setSelectedResumes([]);
      }
    } catch (error) {
      showToast(ToastType.ERROR, 'Failed to delete selected resumes');
    } finally {
      setIsDeleting(false);
    }
  };

  const performDelete = () => {
    if (isMultiDelete) {
      handleBulkDelete();
    } else if (resumeToDelete) {
      handleDeleteResume(resumeToDelete);
    }
  };

  const toggleSelectResume = (resumeId: string) => {
    setSelectedResumes(prev => {
      if (prev.includes(resumeId)) {
        return prev.filter(id => id !== resumeId);
      } else {
        return [...prev, resumeId];
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectedResumes.length === resumes.length) {
      setSelectedResumes([]);
    } else {
      setSelectedResumes(resumes.map(resume => resume.id));
    }
  };

  const handleAnalyzeResume = (resumeId: string) => {
    // Navigate to analysis page
    window.location.href = `/dashboard/analyze?resume=${resumeId}`;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        await handleAsyncOperation(
          async () => {
            const result = await apiClient.uploadResume(file);
            if (result) {
              setResumes(prev => [result, ...prev]);
            }
            return result;
          },
          {
            showToast,
            successMessage: `Resume "${file.name}" uploaded successfully`,
            errorMessage: `Failed to upload resume "${file.name}"`
          }
        );
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Format date helper function
  const formatDate = (dateInput: any): string => {
    if (!dateInput) return 'Unknown date';
    
    try {
      // Handle Firestore timestamp
      if (dateInput.seconds) {
        return new Date(dateInput.seconds * 1000).toLocaleDateString();
      }
      
      // Handle regular Date object or timestamp
      return new Date(dateInput).toLocaleDateString();
    } catch (error) {
      return 'Unknown date';
    }
  };

  const handleBulkDeleteClick = () => {
    confirmDelete();
  };

  return (
    <div className="container mx-auto pb-10">
      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-sm text-gray-500 mb-4">
              {selectedResumes.length > 1 
                ? `Are you sure you want to delete these ${selectedResumes.length} resumes? This action cannot be undone.`
                : 'Are you sure you want to delete this resume? This action cannot be undone.'}
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={performDelete}
                disabled={isDeleting}
                className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Resumes</h1>
      
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">
          {resumes.length > 0
            ? `You have uploaded ${resumes.length} ${resumes.length === 1 ? 'resume' : 'resumes'}.`
            : 'Upload your first resume to get started.'}
        </p>
        <div className="flex space-x-3">
          <button
            onClick={handleUploadClick}
            disabled={uploading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-deep-blue hover:bg-deep-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-orange"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            {uploading ? 'Uploading...' : 'Upload Resume'}
          </button>
          <button
            onClick={() => confirmDelete()}
            disabled={isDeleting || selectedResumes.length === 0}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
              selectedResumes.length > 0 
                ? 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                : 'text-gray-400 bg-gray-200 cursor-not-allowed'
            } focus:outline-none focus:ring-2 focus:ring-offset-2`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
        />
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <svg className="animate-spin h-8 w-8 text-deep-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : (
        <>
          {resumes.length > 0 && (
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="select-all"
                  checked={selectedResumes.length === resumes.length && resumes.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 text-deep-blue focus:ring-accent-orange border-gray-300 rounded"
                />
                <label htmlFor="select-all" className="ml-2 text-sm text-gray-700">
                  Select All ({resumes.length})
                </label>
              </div>
            </div>
          )}
          
          {resumes.length > 0 ? (
            <div className="overflow-hidden border border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="w-12 px-4 py-3"></th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resume
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uploaded
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {resumes.map((resume) => (
                    <tr key={resume.id} className={selectedResumes.includes(resume.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedResumes.includes(resume.id)}
                          onChange={() => toggleSelectResume(resume.id)}
                          className="w-4 h-4 text-deep-blue focus:ring-accent-orange border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-deep-blue/10 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-deep-blue"
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
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 truncate max-w-[250px]">
                              {resume.file_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(resume.created_at)}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <a
                            href={resume.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition-colors"
                          >
                            View
                          </a>
                          <button 
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                            onClick={() => confirmDelete(resume.id)}
                            aria-label="Delete resume"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-10 text-center border border-gray-200 shadow-sm">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No resumes yet</h3>
              <p className="text-sm text-gray-500 mb-6">Upload your resume to get started with the analysis and tracking.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
} 