'use client';

import { useState, useCallback } from 'react';
import { ApiClient } from '@/lib/api';
import ScoreDisplay from './ScoreDisplay';
import FeedbackSection from './FeedbackSection';
import { useAuth } from '@/lib/auth';
import { useDropzone } from 'react-dropzone';
import { useToast, ToastType } from './Toast';
import { handleAsyncOperation } from '@/lib/error-utils';

// Add print styles
const printStyles = `
  @media print {
    body * {
      visibility: hidden;
    }
    .print-section, .print-section * {
      visibility: visible;
    }
    .print-section {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      padding: 20px;
    }
    .no-print {
      display: none !important;
    }
    
    /* Hide everything except the print section when printing */
    body.printing * {
      visibility: hidden;
    }
    body.printing .print-section, 
    body.printing .print-section * {
      visibility: visible;
    }
  }
`;

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
      
      // Reset upload progress to 0 but don't simulate progress here
      setUploadProgress(0);
      
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
    
    // Start with a low progress value
    setUploadProgress(10);
    
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
      
      // Increment progress with each stage change
      setUploadProgress(prev => Math.min(prev + 15, 90));
      
      stageIndex++;
      if (stageIndex >= stages.length) {
        clearInterval(stageInterval);
      }
    }, 1500);
    
    await handleAsyncOperation(
      async () => {
        const response = await apiClient.analyzeResume(file, jobDescription);
        setResult(response.result);
        // Set to 100% only when complete
        setUploadProgress(100);
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

  const handlePrint = () => {
    // Add a class to the body before printing
    document.body.classList.add('printing');
    
    // Print the document
    window.print();
    
    // Remove the class after printing
    setTimeout(() => {
      document.body.classList.remove('printing');
    }, 500);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <style dangerouslySetInnerHTML={{ __html: printStyles }} />
      
      {/* Header with illustration */}
      <div className="relative mb-8 bg-gradient-to-r from-deep-blue to-[#1a3a5f] rounded-2xl overflow-hidden shadow-xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-accent-orange blur-3xl"></div>
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#4cc9f0] blur-3xl"></div>
        </div>
        
        <div className="relative z-10 px-8 py-12 text-white">
          <h2 className="text-4xl font-bold mb-3">Resume Analyzer</h2>
          <p className="text-gray-300 max-w-2xl">
            Our AI-powered tool analyzes your resume against job descriptions to provide personalized feedback and improvement suggestions.
          </p>
        </div>
      </div>
      
      {!user && (
        <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-md shadow-sm">
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-semibold mb-6 text-deep-blue">Upload & Analyze</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
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
          
          {/* How it works section */}
          {!result && !isLoading && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-lg font-semibold mb-4 text-deep-blue">How it works</h4>
              <ol className="space-y-3">
                <li className="flex items-start">
                  <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-deep-blue text-white text-xs font-medium mr-2">1</span>
                  <span className="text-gray-600">Upload your resume in PDF format</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-deep-blue text-white text-xs font-medium mr-2">2</span>
                  <span className="text-gray-600">Paste the job description you're applying for</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-deep-blue text-white text-xs font-medium mr-2">3</span>
                  <span className="text-gray-600">Get a detailed analysis with personalized recommendations</span>
                </li>
              </ol>
            </div>
          )}
        </div>
        
        {/* Results Section */}
        <div>
          {isLoading && (
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 h-full flex flex-col items-center justify-center">
              <div className="relative mb-4">
                <div className="w-20 h-20 border-4 border-gray-200 border-t-accent-orange rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-500">{Math.round(uploadProgress)}%</span>
                </div>
              </div>
              <p className="text-xl font-medium text-deep-blue mb-2">{analysisStage || 'Analyzing your resume...'}</p>
              <p className="text-sm text-gray-500 text-center max-w-md">
                Our AI is comparing your resume with the job description to provide personalized feedback.
              </p>
            </div>
          )}
          
          {result && !isLoading && (
            <div className="space-y-6">
              <div className="print-section">
                <ScoreDisplay score={result.match_score} />
                <div className="mt-6">
                  <FeedbackSection 
                    feedback={result.feedback} 
                    skillsMatch={result.skills_match} 
                    improvementAreas={result.improvement_areas} 
                  />
                </div>
              </div>
              
              <div className="flex justify-center space-x-4 pt-4 no-print">
                <button
                  onClick={() => {
                    setResult(null);
                    setFile(null);
                    setJobDescription('');
                  }}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 shadow-sm"
                >
                  Start New Analysis
                </button>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-deep-blue text-white rounded-md hover:bg-deep-blue/90 shadow-sm"
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print Results
                  </span>
                </button>
              </div>
            </div>
          )}
          
          {!result && !isLoading && (
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 h-full flex flex-col items-center justify-center text-center">
              <div className="mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-deep-blue">No Analysis Yet</h3>
              <p className="text-gray-500 max-w-md">
                Upload your resume and paste a job description to get a detailed analysis and personalized recommendations.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Tips Section */}
      {!result && !isLoading && (
        <div className="mt-12 bg-gradient-to-r from-[#f8f9fa] to-[#e9ecef] rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-4 text-deep-blue">Resume Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center mb-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-medium text-gray-800">Tailor Your Resume</h4>
              </div>
              <p className="text-sm text-gray-600">
                Customize your resume for each job application by matching keywords from the job description.
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center mb-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="font-medium text-gray-800">Quantify Achievements</h4>
              </div>
              <p className="text-sm text-gray-600">
                Use numbers and percentages to demonstrate your impact (e.g., "Increased sales by 20%").
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center mb-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h4 className="font-medium text-gray-800">Keep It Concise</h4>
              </div>
              <p className="text-sm text-gray-600">
                Limit your resume to 1-2 pages and focus on relevant experience for the position.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 