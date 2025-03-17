'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { ApiClient } from '@/lib/api';
import ScoreDisplay from './ScoreDisplay';
import FeedbackSection from './FeedbackSection';
import { useAuth } from '@/lib/auth';
import { useDropzone } from 'react-dropzone';
import { useToast, ToastType } from './Toast';
import { handleAsyncOperation } from '@/lib/error-utils';
import { motion, AnimatePresence } from 'framer-motion';

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

// Enum for the different steps of the analyzer flow
enum AnalyzerStep {
  UPLOAD_RESUME = 0,
  ENTER_JOB_DESCRIPTION = 1,
  ANALYZING = 2,
  RESULTS = 3,
}

export default function ResumeAnalyzer() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState('');
  
  // Step state
  const [currentStep, setCurrentStep] = useState<AnalyzerStep>(AnalyzerStep.UPLOAD_RESUME);

  // Use effect for progress animation
  useEffect(() => {
    let animationFrame: number;
    let startTime: number;
    const duration = 800; // animation duration in ms
    
    const animateProgress = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smoother animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      // Calculate the current display value based on difference between current and target
      const currentValue = displayProgress + (uploadProgress - displayProgress) * easedProgress;
      
      setDisplayProgress(Math.round(currentValue));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animateProgress);
      }
    };
    
    // Only animate if the progress has changed and is different from display
    if (uploadProgress !== displayProgress) {
      startTime = 0;
      animationFrame = requestAnimationFrame(animateProgress);
    }
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [uploadProgress, displayProgress]);

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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
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
    
    // Move to analyzing step
    setCurrentStep(AnalyzerStep.ANALYZING);
    
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
        // Move to results
        setCurrentStep(AnalyzerStep.RESULTS);
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
          // Go back to the job description step
          setCurrentStep(AnalyzerStep.ENTER_JOB_DESCRIPTION);
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

  const handleNextStep = () => {
    if (currentStep === AnalyzerStep.UPLOAD_RESUME) {
      if (!file) {
        setError('Please upload a resume');
        showToast(ToastType.ERROR, 'Please upload a resume');
        return;
      }
      setCurrentStep(AnalyzerStep.ENTER_JOB_DESCRIPTION);
    } else if (currentStep === AnalyzerStep.ENTER_JOB_DESCRIPTION) {
      handleSubmit();
    }
  };

  const handlePrevStep = () => {
    if (currentStep === AnalyzerStep.ENTER_JOB_DESCRIPTION) {
      setCurrentStep(AnalyzerStep.UPLOAD_RESUME);
    }
  };

  const startNewAnalysis = () => {
    setResult(null);
    setFile(null);
    setJobDescription('');
    setCurrentStep(AnalyzerStep.UPLOAD_RESUME);
  };

  return (
    <div className="w-full mx-auto min-h-[calc(100vh-64px)]">
      <style dangerouslySetInnerHTML={{ __html: printStyles }} />
      
      {/* Results Section (Full-screen when result is available) */}
      {currentStep === AnalyzerStep.RESULTS && result && (
        <div className="w-full h-full">
          <div className="flex flex-col lg:flex-row h-full">
            {/* Sidebar with ScoreDisplay */}
            <div className="lg:w-1/3 p-4 print-section">
              <div className="sticky top-20">
                <ScoreDisplay 
                  score={result.match_score} 
                  searchabilityIssues={result.searchability_issues}
                  hardSkillsIssues={result.hard_skills_issues}
                  softSkillsIssues={result.soft_skills_issues}
                  recruiterTipsIssues={result.recruiter_tips_issues}
                  formattingIssues={result.formatting_issues}
                  keywordsMatchPercentage={result.keywords_match_percentage}
                  experienceLevelPercentage={result.experience_level_percentage}
                  skillsRelevancePercentage={result.skills_relevance_percentage}
                  onRescan={startNewAnalysis}
                />
              </div>
            </div>
            
            {/* Main content with feedback */}
            <div className="lg:w-2/3 p-4 print-section">
              <div className="rounded-xl">
                <FeedbackSection 
                  feedback={result.feedback} 
                  skillsMatch={result.skills_match} 
                  improvementAreas={result.improvement_areas}
                  overallAssessment={result.overall_assessment}
                  industryInsights={result.industry_insights}
                  jobTitle={result.job_title}
                  onPrint={handlePrint}
                  formattingChecks={result.formatting_checks}
                  atsTips={result.ats_tips}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Multi-step form (in-page, directly in the layout) */}
      {currentStep !== AnalyzerStep.RESULTS && (
        <div className="flex justify-center items-center pt-10">
          <div className="w-full max-w-2xl">
            {/* Progress indicators */}
            <div className="bg-deep-blue px-6 py-4 text-white rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <div className={`h-2 w-8 rounded-full ${currentStep >= AnalyzerStep.UPLOAD_RESUME ? 'bg-accent-orange' : 'bg-gray-400'}`}></div>
                  <div className={`h-2 w-8 rounded-full ${currentStep >= AnalyzerStep.ENTER_JOB_DESCRIPTION ? 'bg-accent-orange' : 'bg-gray-400'}`}></div>
                  <div className={`h-2 w-8 rounded-full ${currentStep >= AnalyzerStep.ANALYZING ? 'bg-accent-orange' : 'bg-gray-400'}`}></div>
                </div>
                <div className="text-sm font-medium">
                  Step {currentStep + 1} of 3
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-b-2xl shadow-md">
              {/* Step 1: Upload Resume */}
              {currentStep === AnalyzerStep.UPLOAD_RESUME && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-deep-blue">Upload Your Resume</h3>
                  <div>
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
                          <p className="text-sm font-medium text-gray-900">Upload or paste your CV</p>
                          <p className="text-xs text-gray-500">Drag & drop your resume here, or click to browse</p>
                          <p className="text-xs text-gray-500">Only PDF files are supported</p>
                        </div>
                      )}
                    </div>
                    
                    {error && (
                      <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
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
                  </div>
                </div>
              )}
              
              {/* Step 2: Enter Job Description */}
              {currentStep === AnalyzerStep.ENTER_JOB_DESCRIPTION && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-deep-blue">Enter Job Description</h3>
                  <div>
                    <div className="relative">
                      <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        rows={8}
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
                    
                    {error && (
                      <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
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
                  </div>
                </div>
              )}
              
              {/* Step 3: Analyzing */}
              {currentStep === AnalyzerStep.ANALYZING && (
                <div className="py-10 flex flex-col items-center justify-center">
                  <div className="relative mb-6">
                    <svg className="w-24 h-24" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="none" 
                        strokeWidth="8" 
                        stroke="#e5e7eb" 
                      />
                      {/* Progress circle - strokeDasharray and strokeDashoffset control the progress */}
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="none" 
                        strokeWidth="8" 
                        stroke="#ff9f43" 
                        strokeLinecap="round" 
                        strokeDasharray="283" 
                        strokeDashoffset={283 - (283 * displayProgress) / 100}
                        transform="rotate(-90 50 50)"
                        className="transition-all duration-300 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-semibold text-deep-blue transition-all duration-300">
                        {displayProgress}%
                      </span>
                    </div>
                  </div>
                  <p className="text-xl font-medium text-deep-blue mb-3">{analysisStage || 'Analyzing your resume...'}</p>
                  <p className="text-sm text-gray-500 text-center max-w-md">
                    Our AI is comparing your resume with the job description to provide personalized feedback.
                  </p>
                </div>
              )}
              
              {/* Navigation buttons */}
              {currentStep !== AnalyzerStep.ANALYZING && (
                <div className="mt-8 flex justify-between">
                  {currentStep > AnalyzerStep.UPLOAD_RESUME && (
                    <button
                      onClick={handlePrevStep}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Back
                    </button>
                  )}
                  <div className={currentStep === AnalyzerStep.UPLOAD_RESUME ? "flex-grow" : ""}></div> {/* Spacer */}
                  <button
                    onClick={handleNextStep}
                    className="px-6 py-2 bg-accent-orange hover:bg-accent-orange/90 text-white font-medium rounded-md shadow-sm hover:shadow transition-all"
                  >
                    {currentStep === AnalyzerStep.ENTER_JOB_DESCRIPTION ? 'Analyze' : 'Next'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 