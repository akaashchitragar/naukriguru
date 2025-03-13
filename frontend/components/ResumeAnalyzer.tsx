'use client';

import { useState, useCallback } from 'react';
import { ApiClient } from '@/lib/api';
import ScoreDisplay from './ScoreDisplay';
import FeedbackSection from './FeedbackSection';
import { useAuth } from '@/lib/auth';
import { useDropzone } from 'react-dropzone';
import { useToast, ToastType } from './Toast';
import { handleAsyncOperation } from '@/lib/error-utils';

const apiClient = new ApiClient();

export default function ResumeAnalyzer() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
      
      // Simulate upload progress for better UX
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
      
      showToast(ToastType.SUCCESS, 'Resume uploaded successfully');
    } else {
      setFile(null);
      setError('Please upload a PDF file');
      showToast(ToastType.ERROR, 'Please upload a PDF file');
    }
  }, [showToast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please upload a resume');
      showToast(ToastType.ERROR, 'Please upload a resume');
      return;
    }
    
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      showToast(ToastType.ERROR, 'Please enter a job description');
      return;
    }
    
    // Simulate analysis stages for better UX
    const stages = [
      'Parsing resume...',
      'Extracting skills...',
      'Analyzing job description...',
      'Matching skills...',
      'Generating feedback...',
      'Finalizing results...'
    ];
    
    let stageIndex = 0;
    const stageInterval = setInterval(() => {
      setAnalysisStage(stages[stageIndex]);
      stageIndex++;
      if (stageIndex >= stages.length) {
        clearInterval(stageInterval);
      }
    }, 1500);
    
    await handleAsyncOperation(
      async () => {
        const response = await apiClient.analyzeResume(file, jobDescription);
        setResult(response.result);
        return response;
      },
      {
        setLoading: setIsLoading,
        showToast,
        successMessage: 'Resume analyzed successfully!',
        errorMessage: 'Failed to analyze resume',
        onSuccess: () => {
          clearInterval(stageInterval);
          setError(null);
        },
        onError: (errorResponse) => {
          clearInterval(stageInterval);
          setError(errorResponse.message);
        }
      }
    );
    
    setAnalysisStage('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-deep-blue">Resume Analyzer</h2>
      
      {!user && (
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">You are not signed in. Your analysis will not be saved.</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Resume (PDF)
          </label>
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
              isDragActive 
                ? 'border-accent-orange bg-orange-50' 
                : file 
                  ? 'border-green-400 bg-green-50' 
                  : 'border-gray-300 hover:border-soft-purple hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            
            {file ? (
              <div className="space-y-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
                <button 
                  type="button" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Remove file
                </button>
              </div>
            ) : isDragActive ? (
              <div className="space-y-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-accent-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                <p className="text-sm font-medium text-gray-900">Drop your resume here</p>
              </div>
            ) : (
              <div className="space-y-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm font-medium text-gray-900">Drag & drop your resume here, or click to browse</p>
                <p className="text-xs text-gray-500">Only PDF files are supported</p>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description
          </label>
          <div className="relative">
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-blue focus:border-deep-blue transition-all"
              placeholder="Paste the job description here..."
            />
            {jobDescription && (
              <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                {jobDescription.length} characters
              </div>
            )}
          </div>
          <div className="mt-2 flex justify-between">
            <button
              type="button"
              onClick={() => navigator.clipboard.readText().then(text => setJobDescription(text))}
              className="text-xs text-deep-blue hover:text-soft-purple"
            >
              Paste from clipboard
            </button>
            <button
              type="button"
              onClick={() => setJobDescription('')}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          </div>
        </div>
        
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all transform hover:scale-[1.02] ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-accent-orange hover:bg-accent-orange/90 shadow-md hover:shadow-lg'
          }`}
        >
          {isLoading ? 'Analyzing...' : 'Analyze Resume'}
        </button>
      </form>
      
      {isLoading && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-accent-orange rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-500">{Math.round(uploadProgress)}%</span>
              </div>
            </div>
            <p className="mt-4 text-lg font-medium text-deep-blue">{analysisStage || 'Analyzing your resume...'}</p>
            <p className="mt-2 text-sm text-gray-500">This may take a moment</p>
          </div>
        </div>
      )}
      
      {result && !isLoading && (
        <div className="mt-8 space-y-8 p-6 bg-gray-50 rounded-lg border border-gray-200 animate-fadeIn">
          <ScoreDisplay score={result.match_score} />
          <FeedbackSection 
            feedback={result.feedback} 
            skillsMatch={result.skills_match} 
            improvementAreas={result.improvement_areas} 
          />
          <div className="flex justify-center space-x-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                setResult(null);
                setFile(null);
                setJobDescription('');
              }}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Start New Analysis
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-deep-blue text-white rounded-md hover:bg-deep-blue/90"
            >
              Print Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 