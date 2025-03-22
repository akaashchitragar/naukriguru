'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { ApiClient } from '@/lib/api';
import ScoreDisplay from './ScoreDisplay';
import FeedbackSection from './FeedbackSection';
import CoreMetrics from './CoreMetrics';
import { useAuth } from '@/lib/auth';
import { useDropzone } from 'react-dropzone';
import { useToast, ToastType } from './Toast';
import { handleAsyncOperation } from '@/lib/error-utils';
import { motion, AnimatePresence } from 'framer-motion';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

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
    
    /* Show the print-only content when printing */
    body.printing .print-only {
      display: block !important;
      visibility: visible !important;
    }
    
    /* Print layout improvements */
    body.printing .print-section {
      padding: 40px;
      font-family: 'Arial', sans-serif;
      line-height: 1.5;
      color: #333;
    }
    
    /* Print header */
    body.printing .print-header {
      margin-bottom: 40px;
      border-bottom: 2px solid #2563eb;
      padding-bottom: 20px;
      text-align: center;
    }
    
    body.printing .print-header h2 {
      color: #1e40af;
      font-size: 28pt;
      margin-bottom: 12px;
      font-weight: 700;
    }
    
    body.printing .print-header .metadata {
      font-size: 12pt;
      color: #4b5563;
      display: flex;
      justify-content: center;
      gap: 20px;
    }
    
    body.printing .print-header .metadata-item {
      display: flex;
      align-items: center;
    }

    body.printing .print-header .metadata-icon {
      margin-right: 6px;
    }
    
    /* Print section headers */
    body.printing .print-section-header {
      font-size: 18pt;
      font-weight: bold;
      margin-top: 32px;
      margin-bottom: 16px;
      color: #1e40af;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 10px;
      page-break-after: avoid;
      display: flex;
      align-items: center;
    }

    body.printing .print-section-header-icon {
      margin-right: 10px;
      width: 24px;
      height: 24px;
    }
    
    /* Print section content */
    body.printing .print-section-content {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }
    
    /* Status indicators for print */
    body.printing .status-passed {
      color: #15803d !important;
      font-weight: bold;
    }
    
    body.printing .status-failed {
      color: #b91c1c !important;
      font-weight: bold;
    }
    
    body.printing .status-needs-improvement {
      color: #b45309 !important;
      font-weight: bold;
    }
    
    /* Score display styles */
    body.printing .score-display {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
      background-color: #f8fafc !important;
      padding: 25px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
    }
    
    body.printing .score-value {
      font-size: 42pt;
      font-weight: bold;
      margin-right: 30px;
      padding: 12px;
      background-color: white !important;
      border-radius: 50%;
      height: 120px;
      width: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 4px solid;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    body.printing .score-value-green {
      color: #15803d;
      border-color: #86efac;
    }
    
    body.printing .score-value-yellow {
      color: #b45309;
      border-color: #fde68a;
    }
    
    body.printing .score-value-red {
      color: #b91c1c;
      border-color: #fca5a5;
    }
    
    body.printing .score-details {
      flex: 1;
    }
    
    body.printing .score-details h4 {
      font-size: 22pt;
      font-weight: bold;
      margin-bottom: 10px;
    }

    body.printing .score-details p {
      font-size: 12pt;
      line-height: 1.6;
    }

    body.printing .score-message-green {
      color: #15803d;
    }
    
    body.printing .score-message-yellow {
      color: #b45309;
    }
    
    body.printing .score-message-red {
      color: #b91c1c;
    }
    
    /* Progress bars for print */
    body.printing .print-bar {
      border: 1px solid #e5e7eb;
      height: 14px !important;
      border-radius: 7px;
      overflow: hidden;
      background-color: #f9fafb !important;
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
    }
    
    body.printing .print-bar > div {
      height: 12px !important;
      border-radius: 7px;
    }

    /* Metrics section styles */
    body.printing .metrics-container {
      display: flex;
      flex-wrap: wrap;
      margin: 0 -15px;
    }
    
    body.printing .metrics-column {
      width: 100%;
      padding: 0 15px;
      margin-bottom: 20px;
    }
    
    body.printing .metric-item {
      margin-bottom: 20px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px;
      background-color: #ffffff !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    body.printing .metric-name {
      font-weight: bold;
      color: #4b5563;
      margin-bottom: 8px;
      font-size: 14pt;
    }

    body.printing .metric-description {
      font-size: 10pt;
      color: #6b7280;
      margin-bottom: 12px;
    }

    body.printing .metric-value {
      font-weight: bold;
      font-size: 14pt;
      margin-left: 10px;
    }

    body.printing .metric-value-green {
      color: #15803d;
    }
    
    body.printing .metric-value-yellow {
      color: #b45309;
    }
    
    body.printing .metric-value-red {
      color: #b91c1c;
    }
    
    /* Content card styles */
    body.printing .content-card {
      background-color: #ffffff !important;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    /* Assessment card styles */
    body.printing .assessment-card {
      background-color: #f0f9ff !important;
      border: 1px solid #bae6fd;
      border-left: 4px solid #0284c7;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 24px;
    }

    /* Industry insights card */
    body.printing .insights-card {
      background-color: #f0f9ff !important;
      border: 1px solid #bae6fd;
      border-left: 4px solid #0284c7;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 24px;
    }

    body.printing .insights-card h4 {
      color: #0c4a6e;
      font-size: 16pt;
      margin-bottom: 10px;
      font-weight: bold;
    }

    body.printing .insights-subtitle {
      color: #64748b;
      margin-bottom: 16px;
      font-size: 11pt;
    }

    /* Skills pills */
    body.printing .skills-container {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 16px;
    }
    
    body.printing .skill-pill {
      background-color: #f0fdf4 !important;
      border: 1px solid #86efac;
      border-radius: 20px;
      padding: 6px 14px;
      font-size: 11pt;
      color: #15803d !important;
      display: inline-block;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }
    
    /* List styles */
    body.printing .improvement-list,
    body.printing .formatting-list {
      padding-left: 0;
      list-style-type: none;
    }
    
    body.printing .improvement-list li,
    body.printing .formatting-list li {
      margin-bottom: 16px;
      padding: 12px 16px;
      position: relative;
      background-color: #ffffff !important;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }
    
    body.printing .improvement-list li::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background-color: #f59e0b !important;
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
    }
    
    body.printing .formatting-list li.passed:before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background-color: #22c55e !important;
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
    }
    
    body.printing .formatting-list li.needs-improvement:before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background-color: #f59e0b !important;
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
    }
    
    body.printing .formatting-list li.failed:before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background-color: #ef4444 !important;
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
    }

    /* Ensure progress bar colors print correctly */
    body.printing .bg-green-500 {
      background-color: #22c55e !important;
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }
    
    body.printing .bg-yellow-500 {
      background-color: #f59e0b !important;
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }
    
    body.printing .bg-red-500 {
      background-color: #ef4444 !important;
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }
    
    body.printing .bg-blue-400 {
      background-color: #60a5fa !important;
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }
    
    body.printing .bg-green-400 {
      background-color: #4ade80 !important;
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }
    
    body.printing .bg-yellow-400 {
      background-color: #facc15 !important;
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }
    
    body.printing .bg-red-400 {
      background-color: #f87171 !important;
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }
    
    /* Remove backgrounds in print except where explicitly set */
    body.printing * {
      background-color: white !important;
    }
    
    /* Typography improvements */
    body.printing p, 
    body.printing li, 
    body.printing span {
      font-size: 11pt;
      line-height: 1.6;
    }
    
    body.printing h4 {
      font-size: 16pt;
      margin-bottom: 12px;
      color: #1e40af;
      font-weight: bold;
    }
    
    body.printing h5 {
      font-size: 14pt;
      color: #374151;
      margin-bottom: 10px;
      font-weight: 600;
    }
    
    /* Footer styles */
    body.printing .print-footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      font-size: 10pt;
      color: #6b7280;
      display: flex;
      justify-content: space-between;
    }
    
    body.printing .print-footer-logo {
      font-weight: bold;
      color: #2563eb;
      font-size: 11pt;
    }
    
    /* Fix page layout */
    @page {
      margin: 1cm;
      size: A4;
    }
    
    /* Page breaks */
    body.printing .page-break-before {
      page-break-before: always;
    }
  }
`;

const apiClient = new ApiClient();
const db = getFirestore();

// Enum for the different steps of the analyzer flow
enum AnalyzerStep {
  UPLOAD_RESUME = 0,
  ENTER_JOB_DESCRIPTION = 1,
  ANALYZING = 2,
  RESULTS = 3,
}

// Define storage keys
const STORAGE_KEYS = {
  RESULT: 'resume_analyzer_result',
  CURRENT_STEP: 'resume_analyzer_step',
  JOB_DESCRIPTION: 'resume_analyzer_job_description',
};

// Define types for stage messages
interface StageMessage {
  message: string;
  progress: number;
}

interface FinalStageMessage {
  message: string;
  subtask: string;
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
  const [resultSavedToFirestore, setResultSavedToFirestore] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  
  // Step state
  const [currentStep, setCurrentStep] = useState<AnalyzerStep>(AnalyzerStep.UPLOAD_RESUME);

  // Save state to localStorage when it changes
  useEffect(() => {
    if (result) {
      localStorage.setItem(STORAGE_KEYS.RESULT, JSON.stringify(result));
    }
    
    localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, currentStep.toString());
  }, [result, currentStep]);

  // Load saved state from localStorage on component mount
  useEffect(() => {
    try {
      // Load result data
      const savedResult = localStorage.getItem(STORAGE_KEYS.RESULT);
      if (savedResult) {
        setResult(JSON.parse(savedResult));
      }
      
      // Load current step
      const savedStep = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP);
      if (savedStep) {
        setCurrentStep(parseInt(savedStep, 10));
      }
    } catch (err) {
      console.error('Error loading saved resume analysis data:', err);
    }
  }, []);

  // Save analysis results to Firestore when they become available
  useEffect(() => {
    const saveResultToFirestore = async () => {
      if (
        result && 
        user && 
        currentStep === AnalyzerStep.RESULTS && 
        !resultSavedToFirestore
      ) {
        try {
          // Create a record with the analysis data
          const analysisData = {
            userId: user.uid,
            timestamp: serverTimestamp(),
            matchScore: result.match_score,
            keywordsMatchPercentage: result.keywords_match_percentage,
            experienceLevelPercentage: result.experience_level_percentage,
            skillsRelevancePercentage: result.skills_relevance_percentage,
            feedback: result.feedback,
            skillsMatch: result.skills_match,
            improvementAreas: result.improvement_areas,
            industryInsights: result.industry_insights,
            jobTitle: result.job_title,
            formattingChecks: result.formatting_checks,
            jobDescription: jobDescription
          };
          
          // Add to the analyses collection
          await addDoc(collection(db, 'resumeAnalyses'), analysisData);
          
          // Mark as saved to prevent duplicate saves
          setResultSavedToFirestore(true);
          
          console.log('Resume analysis saved to history');
        } catch (error) {
          console.error('Error saving resume analysis to history:', error);
        }
      }
    };
    
    saveResultToFirestore();
  }, [result, user, currentStep, jobDescription, resultSavedToFirestore]);

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
    
    // Reset the flag when starting a new analysis
    setResultSavedToFirestore(false);
    
    // Start with a small percentage to show immediate feedback
    setUploadProgress(5);
    
    // Enhanced detailed stages for better UX with updated progress values
    const stages: StageMessage[] = [
      { message: 'Uploading resume...', progress: 10 },
      { message: 'Reading document structure...', progress: 20 },
      { message: 'Extracting skills and experience...', progress: 30 },
      { message: 'Processing job description...', progress: 40 },
      { message: 'Identifying key requirements...', progress: 50 },
      { message: 'Matching skills with requirements...', progress: 60 },
      { message: 'Evaluating experience relevance...', progress: 70 },
      { message: 'Generating personalized feedback...', progress: 80 },
      { message: 'Finalizing analysis...', progress: 90 },
      { message: 'Completing analysis...', progress: 100 } // New stage to reach 100%
    ];
    
    // Add more detailed final stage messages with subtasks
    const finalStageMessages: FinalStageMessage[] = [
      { message: 'Calculating match scores...', subtask: 'Measuring keyword relevance' },
      { message: 'Evaluating overall compatibility...', subtask: 'Analyzing experience fit' },
      { message: 'Creating improvement recommendations...', subtask: 'Identifying growth areas' },
      { message: 'Generating market insights...', subtask: 'Comparing with industry standards' },
      { message: 'Finalizing comprehensive report...', subtask: 'Assembling all components' },
      { message: 'Completing analysis...', subtask: 'Preparing final results' }
    ];
    
    let stageIndex = 0;
    let finalStageIndex = 0;
    let finalStageActive = false;
    
    const setStage = (message: string, progress: number) => {
      setAnalysisStage(message);
      setUploadProgress(progress);
    };
    
    // Initial progress update
    setStage(stages[0].message, stages[0].progress);
    
    const stageInterval = setInterval(() => {
      if (stageIndex < stages.length - 1) {
        stageIndex++;
        setStage(stages[stageIndex].message, stages[stageIndex].progress);
        
        // When we reach the final stage, set up for the detailed final stage
        if (stageIndex >= stages.length - 2) { // Change to -2 to allow final 100% stage
          finalStageActive = true;
          setStage('Finalizing analysis...', 90);
        }
      } else if (finalStageActive && stageIndex < stages.length - 1) {
        // After main stages complete, show more granular updates during the "finalizing" phase
        if (finalStageIndex < finalStageMessages.length - 1) {
          setStage(finalStageMessages[finalStageIndex].message, 90);
          finalStageIndex++;
        } else {
          // Move to the final 100% stage
          stageIndex++;
          setStage(stages[stageIndex].message, stages[stageIndex].progress);
          finalStageActive = false;
        }
      }
    }, 1200); // Slightly faster progression
    
    await handleAsyncOperation(
      async () => {
        const response = await apiClient.analyzeResume(file, jobDescription);
        setResult(response.result);
        
        // Ensure we reach 100% before showing results
        clearInterval(stageInterval);
        setUploadProgress(100);
        setAnalysisStage('Analysis complete!');
        
        // Add a small delay to show the 100% state before moving to results
        await new Promise(resolve => setTimeout(resolve, 1500));
        
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
          setUploadProgress(100); // Ensure 100% on success
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
    
    // Force show all tabs for printing by adding a print-all-tabs class
    document.querySelector('.print-section')?.classList.add('print-all-tabs');
    
    // Print the document
    window.print();
    
    // Remove the classes after printing
    setTimeout(() => {
      document.body.classList.remove('printing');
      document.querySelector('.print-section')?.classList.remove('print-all-tabs');
    }, 500);
  };

  const handleNextStep = () => {
    if (currentStep === AnalyzerStep.UPLOAD_RESUME) {
      if (!file) {
        setError('Please upload a resume');
        showToast(ToastType.ERROR, 'Please upload a resume');
        return;
      }
      // Clear job description when moving to job description step
      setJobDescription('');
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
    // Clear results from localStorage
    localStorage.removeItem(STORAGE_KEYS.RESULT);
    localStorage.removeItem(STORAGE_KEYS.JOB_DESCRIPTION);
    // Step will be updated automatically by the state change
    
    setResult(null);
    setFile(null);
    setJobDescription('');
    setCurrentStep(AnalyzerStep.UPLOAD_RESUME);
    setResultSavedToFirestore(false);
  };

  const generatePDF = () => {
    setGeneratingPDF(true);

    const printContent = `
      <html>
        <head>
          <title>Resume Analysis Report</title>
          <style>${printStyles}</style>
        </head>
        <body class="printing">
          <div class="print-section">
            <div class="print-header">
              <h2>Resume Analysis Report</h2>
              <div class="metadata">
                <span class="metadata-item">
                  <span class="metadata-icon">📅</span>
                  ${new Date().toLocaleDateString()}
                </span>
                <span class="metadata-item">
                  <span class="metadata-icon">📄</span>
                  ${file?.name || 'Resume'}
                </span>
              </div>
            </div>
            
            <div class="print-section-content">
              <div class="score-display">
                <div class="score-value ${
                  result?.match_score >= 80
                    ? 'score-value-green'
                    : result?.match_score >= 60
                    ? 'score-value-yellow'
                    : 'score-value-red'
                }">
                  ${result?.match_score}%
              </div>
                <div class="score-details">
                  <h4 class="${
                    result?.match_score >= 80
                      ? 'score-message-green'
                      : result?.match_score >= 60
                      ? 'score-message-yellow'
                      : 'score-message-red'
                  }">
                    ${
                      result?.match_score >= 80
                        ? 'Excellent Match!'
                        : result?.match_score >= 60
                        ? 'Good Match'
                        : 'Needs Improvement'
                    }
                  </h4>
                  <p>
                    ${result?.match_score >= 80 
                      ? 'Your resume aligns very well with this position\'s requirements. You\'re a strong candidate!'
                      : result?.match_score >= 60 
                      ? 'Your resume matches many requirements but there are areas for improvement.'
                      : 'There are significant gaps between your resume and the job requirements.'}
                  </p>
            </div>
          </div>
        </div>

            <div class="print-section-header">
              <span class="print-section-header-icon">📊</span>
              Core Metrics
            </div>
            <div class="print-section-content">
              <div class="metrics-container">
                <div class="metrics-column">
                  <div class="metrics-row" style="display: flex; gap: 15px; margin-bottom: 15px;">
                    <div class="metric-item" style="flex: 1;">
                      <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div class="metric-name" style="display: flex; align-items: center;">
                          <span style="margin-right: 8px; color: #3b82f6; font-size: 16px;">📊</span>
                          Keywords Match
                        </div>
                        <span class="${
                          result?.keywords_match_percentage >= 80
                            ? 'metric-value-green'
                            : result?.keywords_match_percentage >= 60
                            ? 'metric-value-yellow'
                            : 'metric-value-red'
                        } metric-value">${result?.keywords_match_percentage}%</span>
                      </div>
                      <div class="print-bar" style="margin-top: 10px;">
                        <div class="${
                          result?.keywords_match_percentage >= 80
                            ? 'bg-green-500'
                            : result?.keywords_match_percentage >= 60
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }" style="width: ${result?.keywords_match_percentage}%"></div>
                      </div>
                    </div>
                    
                    <div class="metric-item" style="flex: 1;">
                      <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div class="metric-name" style="display: flex; align-items: center;">
                          <span style="margin-right: 8px; color: #6366f1; font-size: 16px;">💼</span>
                          Experience Level
                        </div>
                        <span class="${
                          result?.experience_level_percentage >= 80
                            ? 'metric-value-green'
                            : result?.experience_level_percentage >= 60
                            ? 'metric-value-yellow'
                            : 'metric-value-red'
                        } metric-value">${result?.experience_level_percentage}%</span>
                      </div>
                      <div class="print-bar" style="margin-top: 10px;">
                        <div class="${
                          result?.experience_level_percentage >= 80
                            ? 'bg-green-500'
                            : result?.experience_level_percentage >= 60
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }" style="width: ${result?.experience_level_percentage}%"></div>
                      </div>
                    </div>
                    
                    <div class="metric-item" style="flex: 1;">
                      <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div class="metric-name" style="display: flex; align-items: center;">
                          <span style="margin-right: 8px; color: #a855f7; font-size: 16px;">👥</span>
                          Skills Relevance
                        </div>
                        <span class="${
                          result?.skills_relevance_percentage >= 80
                            ? 'metric-value-green'
                            : result?.skills_relevance_percentage >= 60
                            ? 'metric-value-yellow'
                            : 'metric-value-red'
                        } metric-value">${result?.skills_relevance_percentage}%</span>
                      </div>
                      <div class="print-bar" style="margin-top: 10px;">
                        <div class="${
                          result?.skills_relevance_percentage >= 80
                            ? 'bg-green-500'
                            : result?.skills_relevance_percentage >= 60
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }" style="width: ${result?.skills_relevance_percentage}%"></div>
                      </div>
                    </div>
                  </div>
                  <div style="background-color: #f9fafb; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
                    <div style="display: flex; align-items: flex-start;">
                      <span style="margin-right: 8px; color: #3b82f6;">ℹ️</span>
                      <p>These metrics show how well your resume matches the job description. Higher scores indicate better alignment with what employers are looking for.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="print-section-header">
              <span class="print-section-header-icon">📝</span>
              Overall Assessment
            </div>
            <div class="print-section-content">
              <div class="assessment-card">
                ${result?.feedback.replace(/\n/g, '<br>')}
              </div>
            </div>

            <div class="print-section-header">
              <span class="print-section-header-icon">✅</span>
              Matching Skills
            </div>
            <div class="print-section-content">
              <div class="content-card">
                <p>These skills from your resume match what the employer is looking for:</p>
                <div class="skills-container">
                  ${result?.skills_match
                    .map((skill: string) => `<div class="skill-pill">${skill}</div>`)
                    .join('')}
                </div>
              </div>
            </div>

            <div class="page-break-before"></div>
            
            <div class="print-section-header">
              <span class="print-section-header-icon">🔍</span>
              Areas for Improvement
            </div>
            <div class="print-section-content">
              <div class="content-card">
                <p>Here's how you can improve your resume:</p>
                <ul class="improvement-list">
                  ${result?.improvement_areas
                    .map((area: string) => `<li>${area}</li>`)
                    .join('')}
                </ul>
              </div>
            </div>

            <div class="print-section-header">
              <span class="print-section-header-icon">💡</span>
              Industry Insights
            </div>
            <div class="print-section-content">
              <div class="insights-card">
                <h4>Industry Demand Analysis</h4>
                <div class="insights-subtitle">Based on current job market trends</div>
                ${result?.industry_insights.replace(/\n/g, '<br>')}
              </div>
            </div>

            <div class="print-section-header">
              <span class="print-section-header-icon">🔠</span>
              Formatting Checks
            </div>
            <div class="print-section-content">
              <div class="content-card">
                <ul class="formatting-list">
                  ${result?.formatting_checks
                    .map((check: any) => {
                      const statusClass = 
                        check.status === 'PASSED' 
                          ? 'passed' 
                          : check.status === 'NEEDS_IMPROVEMENT' 
                          ? 'needs-improvement' 
                          : 'failed';
                      
                      const statusText = 
                        check.status === 'PASSED' 
                          ? '<span class="status-passed">PASSED</span>' 
                          : check.status === 'NEEDS_IMPROVEMENT' 
                          ? '<span class="status-needs-improvement">NEEDS IMPROVEMENT</span>' 
                          : '<span class="status-failed">FAILED</span>';
                      
                      return `<li class="${statusClass}"><strong>${check.name}:</strong> ${statusText} - ${check.description}</li>`;
                    })
                    .join('')}
                </ul>
              </div>
            </div>

            <div class="print-footer">
              <span>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</span>
              <span class="print-footer-logo">NaukriGuru</span>
            </div>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      
      printWindow.onload = function() {
        printWindow.focus();
        printWindow.print();
        printWindow.onafterprint = function() {
          printWindow.close();
          setGeneratingPDF(false);
        };
      };
    } else {
      alert('Please allow pop-ups to generate the PDF');
      setGeneratingPDF(false);
    }
  };

  return (
    <div className="w-full mx-auto min-h-[calc(100vh-64px)]">
      <style dangerouslySetInnerHTML={{ __html: printStyles }} />
      
      {/* Multi-step form (in-page, directly in the layout) */}
      {currentStep !== AnalyzerStep.RESULTS && (
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
          <motion.div 
            className="w-full max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Progress indicators */}
            <div className="bg-deep-blue px-6 py-4 text-white rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <div className={`h-2 w-8 rounded-full transition-all duration-500 ${currentStep >= AnalyzerStep.UPLOAD_RESUME ? 'bg-accent-orange' : 'bg-gray-400'}`}></div>
                  <div className={`h-2 w-8 rounded-full transition-all duration-500 ${currentStep >= AnalyzerStep.ENTER_JOB_DESCRIPTION ? 'bg-accent-orange' : 'bg-gray-400'}`}></div>
                  <div className={`h-2 w-8 rounded-full transition-all duration-500 ${currentStep >= AnalyzerStep.ANALYZING ? 'bg-accent-orange' : 'bg-gray-400'}`}></div>
                </div>
                <div className="text-sm font-medium">
                  Step {currentStep + 1} of 3
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-b-2xl shadow-md">
              {/* Step 1: Upload Resume */}
              <AnimatePresence mode="wait">
              {currentStep === AnalyzerStep.UPLOAD_RESUME && (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
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
                            <motion.div
                              initial={{ scale: 0.8 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                            </motion.div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <motion.div 
                                className="bg-green-500 h-2.5 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 0.5 }}
                              ></motion.div>
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
                            <p className="text-sm font-medium text-gray-900">Upload Your Resume</p>
                          <p className="text-xs text-gray-500">Drag & drop your resume here, or click to browse</p>
                          <p className="text-xs text-gray-500">Only PDF files are supported</p>
                        </div>
                      )}
                    </div>
                    
                    {error && (
                        <motion.div 
                          className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                        >
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
                        </motion.div>
                    )}
                  </div>
                  </motion.div>
              )}
              
              {/* Step 2: Enter Job Description */}
              {currentStep === AnalyzerStep.ENTER_JOB_DESCRIPTION && (
                  <motion.div
                    key="job-description"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
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
                        <motion.div 
                          className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                        >
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
                        </motion.div>
                    )}
                  </div>
                  </motion.div>
              )}
              
              {/* Step 3: Analyzing */}
              {currentStep === AnalyzerStep.ANALYZING && (
                  <motion.div 
                    className="py-10 flex flex-col items-center justify-center"
                    key="analyzing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                  {/* Progress circle with percentage */}
                  <div className="relative mb-6">
                    <svg className="w-28 h-28" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="42" 
                        fill="none" 
                        strokeWidth="12" 
                        stroke="#e5e7eb" 
                      />
                      {/* Progress track with subtle animation */}
                      <motion.circle 
                        cx="50" 
                        cy="50" 
                        r="42" 
                        fill="none" 
                        strokeWidth="12" 
                        stroke="#ff9f43" 
                        strokeLinecap="round" 
                        strokeDasharray="283" 
                        strokeDashoffset={283 - (283 * displayProgress) / 100}
                        transform="rotate(-90 50 50)"
                        transition={{ duration: 0.5 }}
                      />
                      
                      {/* At 100%, show a different animation to indicate completion */}
                      {displayProgress === 100 && (
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="48"
                          fill="none"
                          strokeWidth="2"
                          stroke="#22c55e"
                          opacity="0.5"
                          animate={{ 
                            r: [48, 56, 48],
                            opacity: [0.5, 0.8, 0.5]
                          }}
                          transition={{ 
                            duration: 1.5,
                            repeat: 2,
                            ease: "easeInOut"
                          }}
                        />
                      )}
                    </svg>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.span 
                        className="text-2xl font-semibold text-deep-blue"
                        animate={displayProgress >= 90 ? {
                          scale: [1, 1.05, 1],
                        } : {}}
                        transition={{ 
                          duration: 1.5, 
                          repeat: displayProgress >= 90 ? Infinity : 0,
                          repeatType: "reverse" 
                        }}
                      >
                        {displayProgress}%
                      </motion.span>
                    </div>
                  </div>
                  
                  {/* Main message display */}
                  <div className="min-h-[4rem] flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={analysisStage} // This forces a re-render with animation when the stage changes
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="text-center"
                      >
                        <h3 className="text-xl font-medium text-deep-blue mb-2 flex items-center justify-center">
                          {displayProgress === 100 ? (
                            <motion.span
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ 
                                duration: 1, 
                                repeat: 1,
                                repeatType: "reverse" 
                              }}
                              className="text-green-600"
                            >
                              Analysis complete!
                            </motion.span>
                          ) : displayProgress >= 90 ? (
                            <>
                              <motion.span
                                animate={{ scale: [1, 1.03, 1] }}
                                transition={{ 
                                  duration: 2, 
                                  repeat: Infinity,
                                  repeatType: "loop" 
                                }}
                              >
                                {analysisStage}
                              </motion.span>
                              <motion.span
                                animate={{ 
                                  opacity: [0, 1, 0],
                                  x: [0, 3, 0]
                                }}
                                transition={{ 
                                  duration: 1.5, 
                                  repeat: Infinity,
                                  repeatType: "loop" 
                                }}
                                className="ml-1"
                              >
                                <span className="inline-flex">
                                  <span className="ml-0.5">.</span>
                                  <span className="ml-0.5">.</span>
                                  <span className="ml-0.5">.</span>
                                </span>
                              </motion.span>
                            </>
                          ) : (
                            <>{analysisStage}</>
                          )}
                        </h3>
                        
                        {displayProgress >= 90 && (
                          <motion.p 
                            className="text-sm text-gray-600"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            {(() => {
                              // Create a temporary array for the subtasks that's accessible within this scope
                              const subtasks: Record<string, string> = {
                                'Calculating match scores...': 'Measuring keyword relevance',
                                'Evaluating overall compatibility...': 'Analyzing experience fit',
                                'Creating improvement recommendations...': 'Identifying growth areas',
                                'Generating market insights...': 'Comparing with industry standards',
                                'Finalizing comprehensive report...': 'Assembling all components',
                                'Finalizing analysis...': 'Processing complex AI analysis'
                              };
                              return subtasks[analysisStage] || 'Processing complex AI analysis';
                            })()}
                          </motion.p>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  
                  {/* Description text */}
                  <motion.p 
                    className="text-sm text-gray-500 text-center max-w-md mt-4 px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {displayProgress === 100 ? (
                      <>
                        Your resume has been successfully analyzed! Loading your personalized results...
                      </>
                    ) : displayProgress >= 90 ? (
                      <>
                        We're in the final stages of processing your resume with our advanced AI. This may take a moment as we generate comprehensive insights tailored to your profile.
                      </>
                    ) : (
                      <>
                        Our AI is comparing your resume with the job description to provide personalized feedback and actionable insights.
                      </>
                    )}
                  </motion.p>
                  
                  {/* Progress indicator during 90-99% phase */}
                  {displayProgress >= 90 && displayProgress < 100 && (
                    <motion.div 
                      className="mt-8 flex justify-center items-center w-full max-w-xs mx-auto"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="relative w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className="absolute top-0 left-0 h-full bg-accent-orange rounded-full"
                          animate={{ 
                            x: ["-100%", "100%"]
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity,
                            ease: "easeInOut" 
                          }}
                        />
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Completion indicator at 100% */}
                  {displayProgress === 100 && (
                    <motion.div 
                      className="mt-8 flex flex-col items-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.div 
                        className="text-green-600"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: 1 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </motion.div>
                      <p className="text-green-600 font-medium mt-2">Ready to view results!</p>
                    </motion.div>
                  )}
                  </motion.div>
              )}
              </AnimatePresence>
              
              {/* Navigation buttons */}
              {currentStep !== AnalyzerStep.ANALYZING && (
                <div className="mt-8 flex justify-between">
                  {currentStep > AnalyzerStep.UPLOAD_RESUME && (
                    <motion.button
                      onClick={handlePrevStep}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Back
                    </motion.button>
                  )}
                  <div className={currentStep === AnalyzerStep.UPLOAD_RESUME ? "flex-grow" : ""}></div> {/* Spacer */}
                  <motion.button
                    onClick={handleNextStep}
                    className="px-6 py-2 bg-accent-orange hover:bg-accent-orange/90 text-white font-medium rounded-md shadow-sm hover:shadow transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {currentStep === AnalyzerStep.ENTER_JOB_DESCRIPTION ? 'Analyze' : 'Next'}
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
          </div>
      )}
      
      {/* Results Section (Full-screen when result is available) */}
      <AnimatePresence>
        {currentStep === AnalyzerStep.RESULTS && result && (
          <motion.div 
            className="w-full h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col h-full">
              <div className="flex flex-col lg:flex-row h-full">
                {/* Sidebar with ScoreDisplay */}
                <motion.div 
                  className="lg:w-1/3 p-4 print-section"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="sticky top-20">
                    <ScoreDisplay 
                      score={result.match_score} 
                      keywordsMatchPercentage={result.keywords_match_percentage}
                      experienceLevelPercentage={result.experience_level_percentage}
                      skillsRelevancePercentage={result.skills_relevance_percentage}
                      onRescan={startNewAnalysis}
                    />
        </div>
                </motion.div>
                
                {/* Main content with feedback */}
                <motion.div 
                  className="lg:w-2/3 p-4 print-section"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {/* Core Metrics positioned above FeedbackSection */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <CoreMetrics 
                      score={result.match_score}
                      keywordsMatchPercentage={result.keywords_match_percentage}
                      experienceLevelPercentage={result.experience_level_percentage}
                      skillsRelevancePercentage={result.skills_relevance_percentage}
                    />
                  </motion.div>
                  
                  <motion.div 
                    className="rounded-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <FeedbackSection 
                      feedback={result.feedback} 
                      skillsMatch={result.skills_match} 
                      improvementAreas={result.improvement_areas}
                      industryInsights={result.industry_insights}
                      jobTitle={result.job_title}
                      onPrint={handlePrint}
                      formattingChecks={result.formatting_checks}
                      scoreData={{
                        score: result.match_score,
                        keywordsMatchPercentage: result.keywords_match_percentage,
                        experienceLevelPercentage: result.experience_level_percentage,
                        skillsRelevancePercentage: result.skills_relevance_percentage
                      }}
                    />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 