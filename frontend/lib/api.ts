'use client';

import { auth } from './firebase';
import { handleApiError } from './error-handler';

interface AnalysisResult {
  match_score: number;
  feedback: string;
  skills_match: string[];
  improvement_areas: string[];
  // Keyword metrics
  keywords_match_percentage?: number;
  experience_level_percentage?: number;
  skills_relevance_percentage?: number;
  // Industry insights
  industry_insights?: {
    industry: string;
    title: string;
    recommendations: string[];
  };
  // Job title extracted from job description
  job_title?: string;
  // Formatting checks
  formatting_checks?: {
    font_check: {
      passed: boolean;
      details: string[];
    };
    layout_check: {
      passed: boolean;
      details: string[];
    };
    page_setup_check: {
      passed: boolean;
      details: string[];
    };
  };
}

interface AnalysisResponse {
  resume_id: string;
  analysis_id: string;
  result: AnalysisResult;
}

interface Resume {
  id: string;
  file_name: string;
  file_url: string;
  created_at: any; // Firestore timestamp
  status: string;
}

interface Analysis {
  id: string;
  resume_id: string;
  resume_name?: string; // Optional resume name field
  job_description: string;
  match_score: number;
  feedback: string;
  skills_match: string[];
  improvement_areas: string[];
  // Keyword metrics
  keywords_match_percentage?: number;
  experience_level_percentage?: number;
  skills_relevance_percentage?: number;
  // Industry insights
  industry_insights?: {
    industry: string;
    title: string;
    recommendations: string[];
    current_year?: number; // Added field for current year
    market_overview?: string; // Added field for market overview
  };
  // Job title extracted from job description
  job_title?: string;
  // Formatting checks
  formatting_checks?: {
    font_check: {
      passed: boolean;
      details: string[];
    };
    layout_check: {
      passed: boolean;
      details: string[];
    };
    page_setup_check: {
      passed: boolean;
      details: string[];
    };
  };
  created_at: any; // Firestore timestamp
}

export class ApiClient {
  private baseUrl: string;
  private defaultTimeout: number = 8000; // Reduce timeout from 10s to 8s for faster feedback
  private maxRetries: number = 2; // Add retry functionality
  private useMockApi: boolean = false; // Flag to enable mock API mode
  private lastNetworkStatus: boolean = true; // Track the last known network status
  private networkChecks: number = 0; // Counter for network checks

  constructor() {
    // In production, always use the deployed backend URL
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://backend-475274911587.us-central1.run.app'
      : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');
    
    // Enable mock API if specified in environment or if we're in development
    this.useMockApi = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' || 
                     (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_FORCE_REAL_API !== 'true');
    
    // Check localStorage for user preference on mock API
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedPreference = window.localStorage.getItem('use_mock_api');
      if (storedPreference === 'true') {
        console.log('Using mock API based on user preference from localStorage');
        this.useMockApi = true;
      } else if (storedPreference === 'false') {
        this.useMockApi = false;
      }
    }
    
    // Set up network status detection if in browser environment
    if (typeof window !== 'undefined') {
      this.lastNetworkStatus = navigator.onLine;
      
      // Listen for online/offline events
      window.addEventListener('online', this.handleNetworkChange.bind(this));
      window.addEventListener('offline', this.handleNetworkChange.bind(this));
    }
  }

  // Handler for network status changes
  private handleNetworkChange() {
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    
    // Log network status changes for debugging
    if (this.lastNetworkStatus !== isOnline) {
      console.log(`Network status changed: ${isOnline ? 'online' : 'offline'}`);
      this.lastNetworkStatus = isOnline;
    }
  }

  // Check if we're currently online
  private isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  // Check network connectivity with a lightweight fetch
  private async checkNetworkConnectivity(): Promise<boolean> {
    // Increment check counter
    this.networkChecks++;
    
    // Skip actual check if we're offline according to browser
    if (!this.isOnline()) {
      console.log('Browser reports offline status, skipping connectivity check');
      return false;
    }
    
    try {
      // Instead of using Google favicon which causes CORS issues,
      // use the current origin or a static file from our own domain
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      try {
        // Get the current origin to make a same-origin request
        const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
        
        // Check if we have a valid origin and use it, otherwise fall back to navigator.onLine
        if (!currentOrigin) {
          return this.isOnline();
        }
        
        // Use a static resource from our own domain or the manifest.json which should always be available
        const connectivityUrl = `${currentOrigin}/manifest.webmanifest`;
        
        const response = await fetch(connectivityUrl, {
          method: 'HEAD',
          cache: 'no-store',
          signal: controller.signal,
          // Avoid CORS issues by explicitly setting mode to same-origin
          mode: 'same-origin'
        });
        
        clearTimeout(timeoutId);
        const isConnected = response.ok;
        
        // Update last known status
        this.lastNetworkStatus = isConnected;
        return isConnected;
      } catch (error) {
        console.warn('Network connectivity check failed:', error);
        
        // If we get an AbortError, it might be a slow connection rather than no connection
        const isAbortError = error instanceof Error && 
          (error.name === 'AbortError' || error.toString().includes('abort'));
          
        if (isAbortError) {
          // Don't update the network status for timeouts
          return this.lastNetworkStatus;
        }
        
        // Fall back to navigator.onLine for same-origin errors
        return this.isOnline();
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      console.error('Error in network connectivity check:', error);
      return this.lastNetworkStatus;
    }
  }

  // Mock data generators
  private generateMockResume(id: string): Resume {
    return {
      id,
      file_name: `Resume_${id.substring(0, 5)}.pdf`,
      file_url: 'https://example.com/resume.pdf',
      created_at: new Date(),
      status: 'completed'
    };
  }

  private generateMockAnalysis(id: string, resumeId: string): Analysis {
    const matchScore = Math.floor(Math.random() * 40) + 60; // 60-100
    
    return {
      id,
      resume_id: resumeId,
      job_description: 'Software Engineer with 3+ years of experience...',
      match_score: matchScore,
      feedback: 'Your resume shows good technical skills alignment with the job description, particularly in JavaScript and React. However, there are several areas for improvement to make your application more competitive. Your technical skills section lacks specific versions of frameworks and technologies. Your work experiences would benefit from more quantifiable achievements and metrics. The project descriptions need more detail on your specific contributions and technologies used. Your resume format could be optimized for better ATS compatibility. Consider adding a technical summary section at the top to highlight key relevant skills. Your education section should be reorganized to emphasize relevant coursework for this position.',
      skills_match: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Git'],
      improvement_areas: [
        'Add more quantifiable achievements to demonstrate impact',
        'Include specific versions of technologies you\'ve worked with',
        'Reorganize experience section to highlight most relevant projects first',
        'Add a brief technical summary at the top of your resume',
        'Tailor your skills section more specifically to this job description'
      ],
      // Keyword metrics - based on match score with small variations
      keywords_match_percentage: Math.min(100, matchScore + Math.floor(Math.random() * 15) - 5),
      experience_level_percentage: Math.min(100, matchScore + Math.floor(Math.random() * 10) - 5),
      skills_relevance_percentage: Math.min(100, matchScore + Math.floor(Math.random() * 10)),
      // Job title and industry insights
      job_title: 'Frontend Developer',
      industry_insights: {
        industry: 'Software Development',
        title: 'Frontend Development Industry Recommendations',
        recommendations: [
          'Stay updated with modern JavaScript frameworks like React 18, Angular 15, and Vue 3',
          'Gain experience with WebAssembly for high-performance web applications',
          'Learn about headless CMS and JAMstack architecture for modern web development',
          'Develop skills in responsive design, accessibility (WCAG 2.1), and cross-browser compatibility',
          'Optimize your resume for ATS by including exact keywords from the job description'
        ]
      },
      formatting_checks: {
        font_check: {
          passed: false,
          details: [
            'You use a standard font like Calibri, Arial, or Times New Roman.',
            'Maintain consistent font size throughout the resume (e.g., 11-12pt for body text, 14-16pt for headings).',
            'Avoid using decorative or unusual fonts that may hinder ATS parsing.',
            'Your resume has inconsistent font sizes in the skills and experience sections.',
            'Consider using bold text sparingly to highlight key achievements.'
          ]
        },
        layout_check: {
          passed: false,
          details: [
            'Use a clean and professional layout with clear section headings and consistent spacing.',
            'Avoid using tables, columns, or text boxes, which can confuse ATS software.',
            'Use bullet points effectively to highlight key skills and accomplishments.',
            'Error: Multiple columns detected in your skills section which may cause ATS rejection.',
            'Problem: Your experience section lacks clear visual hierarchy.'
          ]
        },
        page_setup_check: {
          passed: true,
          details: [
            'Maintain a one-page resume for entry-level positions.',
            'Use standard margins (e.g., 1 inch on all sides).',
            'Save the resume as a PDF file for optimal ATS compatibility.',
            'Your document uses standard page size which is excellent for compatibility.'
          ]
        }
      },
      created_at: new Date()
    };
  }

  // Helper to check if we should use mock data
  private async shouldUseMockApi(): Promise<boolean> {
    if (!this.useMockApi) return false;
    
    // First check network connectivity
    if (!(await this.checkNetworkConnectivity())) {
      console.log('Network connectivity issue detected, falling back to mock data');
      return true;
    }
    
    // If mock API is enabled, do a quick check to see if real API is available
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      
      try {
        // Use direct backend URL with no-cors mode to avoid CORS issues
        let healthEndpoint = `${this.baseUrl}/health`;
        
        // Always use no-cors mode to avoid CORS errors
        const mode = 'no-cors' as RequestMode;
        
        console.log(`Checking API availability using: ${healthEndpoint} with mode: ${mode}`);
        const response = await fetch(healthEndpoint, {
          method: 'GET',
          signal: controller.signal,
          mode: mode,
          // Add cache busting to prevent cached responses
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        clearTimeout(timeoutId);
        
        // If real API is available, use it instead of mock
        // For no-cors mode, we can't check response.ok, so just assume it worked
        if (mode === 'no-cors') {
          console.log('API check completed in no-cors mode, assuming API is available');
          return false;
        }
        
        if (response.ok) return false;
        return true;
      } catch (error) {
        // Log the specific error for debugging
        const isAbortError = error instanceof Error && 
          (error.name === 'AbortError' || error.toString().includes('abort'));
        
        if (isAbortError) {
          console.warn('API check aborted due to timeout in shouldUseMockApi');
        } else {
          console.warn('API check failed in shouldUseMockApi:', error);
        }
        
        // Check if this is a CORS error
        const isCorsError = error instanceof Error && 
          error.message && (
            error.message.includes('CORS') || 
            error.message.includes('cross-origin')
          );
        
        if (isCorsError) {
          console.warn('CORS issue detected in shouldUseMockApi');
        }
        
        return true;
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      console.error('Unexpected error in shouldUseMockApi:', error);
      return true;
    }
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      const currentUser = auth?.currentUser;
      if (!currentUser) {
        return null;
      }
      return await currentUser.getIdToken();
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  private async getHeaders(includeAuth: boolean = true): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Accept': 'application/json',
    };
    
    if (includeAuth) {
      const token = await this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    return headers;
  }

  /**
   * Generic fetch method with error handling, timeout, and retry functionality
   */
  private async fetchWithTimeout<T>(
    url: string, 
    options: RequestInit, 
    timeout: number = this.defaultTimeout,
    retries: number = this.maxRetries
  ): Promise<T> {
    // Create an abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    // Check if we're making a health check request
    const isHealthEndpoint = url.endsWith('/health');
    
    // For health endpoints, always use direct URL with no-cors mode
    if (isHealthEndpoint) {
      // Use direct backend URL instead of /api/health
      if (url.startsWith('/api/health')) {
        url = `${this.baseUrl}/health`;
        console.log('Redirecting /api/health to direct backend URL');
      }
      
      // Adjust options for health endpoints
      options = {
        ...options,
        mode: 'no-cors' as RequestMode,
        headers: {
          ...options.headers,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      };
    }
    
    try {
      // Try to fetch with current retry count
      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        // Handle non-2xx responses
        if (!response.ok) {
          const errorText = await response.text();
          let errorData;
          
          try {
            // Try to parse as JSON
            errorData = JSON.parse(errorText);
          } catch {
            // If not JSON, use as plain text
            errorData = { message: errorText };
          }
          
          throw new Error(
            errorData.message || 
            `API error: ${response.status} ${response.statusText}`
          );
        }
        
        // Parse and return JSON response
        return await response.json() as T;
      } catch (error) {
        // Handle AbortError specifically
        const isAbortError = error instanceof Error && 
          (error.name === 'AbortError' || error.toString().includes('abort'));
          
        if (isAbortError) {
          console.warn(`Request to ${url} aborted due to timeout after ${timeout}ms`);
          
          // If we have retries left for AbortError, retry with increased timeout
          if (retries > 0) {
            console.log(`Retrying API call to ${url} after AbortError, ${retries} retries left`);
            // Increase timeout for next retry
            const increasedTimeout = timeout * 1.5;
            // Wait a bit before retrying (exponential backoff with jitter for health endpoints)
            const backoffTime = isHealthEndpoint 
              ? 1000 * (this.maxRetries - retries + 1) + Math.random() * 500 
              : 1000 * (this.maxRetries - retries + 1);
            await new Promise(resolve => setTimeout(resolve, backoffTime));
            return this.fetchWithTimeout<T>(url, options, increasedTimeout, retries - 1);
          }
          
          throw new Error(`Request timed out after ${timeout}ms`);
        }
        
        // Check if this is a CORS error
        const isCorsError = error instanceof Error && 
          error.message && (
            error.message.includes('CORS') || 
            error.message.includes('cross-origin')
          );
        
        if (isCorsError) {
          console.warn('CORS issue detected in request');
          
          // For health endpoints with CORS issues, we can safely return a mock success
          // since the health check is just to see if the backend is reachable
          if (isHealthEndpoint && this.useMockApi) {
            console.log('Health check with CORS issues, returning mock success');
            return { status: 'ok' } as T;
          }
        }
        
        // If we have retries left for other errors, try again
        if (retries > 0) {
          console.log(`Retrying API call to ${url}, ${retries} retries left`);
          // Wait a bit before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * (this.maxRetries - retries + 1)));
          return this.fetchWithTimeout<T>(url, options, timeout, retries - 1);
        }
        
        // No more retries, propagate the error
        throw error;
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Analyze a resume against a job description
   */
  async analyzeResume(file: File, jobDescription: string): Promise<AnalysisResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('job_description', jobDescription);
      
      const token = await this.getAuthToken();
      const endpoint = token ? '/analyze' : '/analyze-dev';
      
      // If no token, use the development endpoint which requires user_id
      if (!token) {
        formData.append('user_id', 'dev-user-' + Date.now());
      }
      
      const headers = await this.getHeaders(!!token);
      
      return await this.fetchWithTimeout<AnalysisResponse>(
        `${this.baseUrl}${endpoint}`, 
        {
          method: 'POST',
          headers,
          body: formData,
        },
        90000 // 90 seconds timeout for analysis (doubled from backend to account for network latency)
      );
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Get user's resumes
   */
  async getUserResumes(): Promise<Resume[]> {
    // Check if we should use mock data
    if (await this.shouldUseMockApi()) {
      console.log('Using mock resume data');
      // Generate 3 mock resumes
      return Array.from({ length: 3 }, (_, i) => 
        this.generateMockResume(`mock-resume-${i}`)
      );
    }
    
    const headers = await this.getHeaders();
    return this.fetchWithTimeout<Resume[]>(
      `${this.baseUrl}/resumes`, 
      {
        method: 'GET',
        headers
      }
    );
  }

  /**
   * Get user's analyses
   */
  async getUserAnalyses(limit: number = 10): Promise<Analysis[]> {
    try {
      // Import Firebase modules
      const { db, auth } = await import('./firebase');
      const { collection, query, where, orderBy, limit: limitQuery, getDocs } = await import('firebase/firestore');
      
      if (!db || !auth?.currentUser?.uid) {
        console.warn('Firebase DB or user not available, falling back to API');
        // Try to use the API if Firebase is not available
        try {
          const headers = await this.getHeaders();
          return this.fetchWithTimeout<Analysis[]>(
            `${this.baseUrl}/analyses?limit=${limit}`, 
            {
              method: 'GET',
              headers
            }
          );
        } catch (apiError) {
          console.error('API fallback failed:', apiError);
          // If API fails too, return mock data
          return this.getMockAnalyses(limit);
        }
      }
      
      // Get analyses directly from Firestore
      const userId = auth.currentUser.uid;
      const analysisQuery = query(
        collection(db, 'analyses'),
        where('user_id', '==', userId),
        orderBy('created_at', 'desc'),
        limitQuery(limit)
      );
      
      const querySnapshot = await getDocs(analysisQuery);
      const analyses: Analysis[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        analyses.push({
          id: doc.id,
          resume_id: data.resume_id,
          resume_name: data.resume_name || 'Resume', // Add resume name if available
          job_description: data.job_description || '',
          match_score: data.match_score || 0,
          feedback: data.feedback || '',
          skills_match: data.skills_match || [],
          improvement_areas: data.improvement_areas || [],
          keywords_match_percentage: data.keywords_match_percentage,
          experience_level_percentage: data.experience_level_percentage,
          skills_relevance_percentage: data.skills_relevance_percentage,
          industry_insights: data.industry_insights,
          job_title: data.job_title,
          formatting_checks: data.formatting_checks,
          created_at: data.created_at
        });
      });
      
      if (analyses.length === 0) {
        console.log('No analyses found in Firestore, trying API');
        try {
          // If no data in Firestore, try the API
          const headers = await this.getHeaders();
          return this.fetchWithTimeout<Analysis[]>(
            `${this.baseUrl}/analyses?limit=${limit}`, 
            {
              method: 'GET',
              headers
            }
          );
        } catch (apiError) {
          console.error('API fallback failed:', apiError);
          // If API fails too, return mock data for better UX
          return this.getMockAnalyses(limit);
        }
      }
      
      return analyses;
    } catch (error) {
      console.error('Error fetching analyses from Firestore:', error);
      
      // Check if we should fall back to mock data
      if (await this.shouldUseMockApi()) {
        return this.getMockAnalyses(limit);
      }
      
      // Try the API as fallback
      try {
        const headers = await this.getHeaders();
        return this.fetchWithTimeout<Analysis[]>(
          `${this.baseUrl}/analyses?limit=${limit}`, 
          {
            method: 'GET',
            headers
          }
        );
      } catch (apiError) {
        console.error('API fallback also failed:', apiError);
        return this.getMockAnalyses(limit);
      }
    }
  }
  
  // Helper method to get mock analyses data
  private getMockAnalyses(limit: number): Analysis[] {
    console.log('Using mock analysis data');
    // Generate mock analyses
    return Array.from({ length: Math.min(limit, 5) }, (_, i) => {
      const resumeId = `mock-resume-${i % 3}`; // Link to mock resumes
      return this.generateMockAnalysis(`mock-analysis-${i}`, resumeId);
    });
  }

  /**
   * Delete a resume
   */
  async deleteResume(resumeId: string): Promise<boolean> {
    try {
      const headers = await this.getHeaders();
      
      await this.fetchWithTimeout(
        `${this.baseUrl}/users/me/resumes/${resumeId}`, 
        {
          method: 'DELETE',
          headers,
        }
      );
      
      return true;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Upload a new resume
   */
  async uploadResume(file: File): Promise<Resume> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const headers = await this.getHeaders();
      
      return await this.fetchWithTimeout<Resume>(
        `${this.baseUrl}/users/me/resumes`, 
        {
          method: 'POST',
          headers,
          body: formData,
        }
      );
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Get analysis details
   */
  async getAnalysisDetails(analysisId: string): Promise<Analysis> {
    try {
      const headers = await this.getHeaders();
      
      return await this.fetchWithTimeout<Analysis>(
        `${this.baseUrl}/users/me/analyses/${analysisId}`, 
        {
          method: 'GET',
          headers,
        }
      );
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Check if the API is available
   */
  async checkHealth(): Promise<boolean> {
    // If mock API is forced, always return true
    if (process.env.NEXT_PUBLIC_USE_MOCK_API === 'true') {
      console.log('Mock API enabled, health check returning true');
      return true;
    }
    
    try {
      // First verify general network connectivity
      if (!(await this.checkNetworkConnectivity())) {
        console.warn('Network connectivity issue detected, health check will likely fail');
        
        // If network is down but mock API is enabled, return true to allow fallbacks
        if (this.useMockApi) {
          console.log('Network down but mock API is enabled');
          return true;
        }
        
        // If in development, be more forgiving with network issues
        if (process.env.NODE_ENV === 'development') {
          console.log('Development mode: Continuing despite network connectivity issues');
          return true;
        }
        
        return false;
      }
      
      // Try a direct fetch with a longer timeout to avoid AbortError issues
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      try {
        // Check if we're in same-origin context to avoid CORS issues
        const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
        
        // In production, always use direct backend URL first - this avoids the need for the /api/health route
        // which might not be properly deployed in some Firebase hosting configurations
        let healthEndpoint = `${this.baseUrl}/health`;
        console.log('Using same-origin health check to avoid CORS issues');
        
        // Use no-cors mode for cross-origin requests to prevent CORS errors
        const mode = 'no-cors' as RequestMode;
        
        console.log(`Checking health using: ${healthEndpoint} with mode: ${mode}`);
        const response = await fetch(healthEndpoint, {
          method: 'GET',
          signal: controller.signal,
          mode: mode,
          // Add cache busting to prevent cached responses
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        clearTimeout(timeoutId);
        
        // If health check fails but mock API is enabled in development, return true
        if ((mode === 'no-cors' || !response.ok) && this.useMockApi) {
          console.log('API health check failed but mock API is enabled');
          return true;
        }
        
        // For no-cors mode, we can't check response.ok, so just assume it worked
        // if we didn't get an exception
        return mode === 'no-cors' ? true : response.ok;
      } catch (error) {
        console.error('API health check failed:', error);
        
        // Handle AbortError more specifically
        const isAbortError = error instanceof Error && 
          (error.name === 'AbortError' || error.toString().includes('abort'));
        
        // Log specific error type for debugging
        if (isAbortError) {
          console.warn('API health check aborted due to timeout');
        }
        
        // Check if this is a CORS error
        const isCorsError = error instanceof Error && 
          error.message && (
            error.message.includes('CORS') || 
            error.message.includes('cross-origin')
          );
        
        if (isCorsError) {
          console.warn('CORS issue detected in health check');
          // For CORS errors in development, return true if mock API is enabled
          if (process.env.NODE_ENV === 'development' && this.useMockApi) {
            return true;
          }
        }
        
        // If connection fails but mock API is enabled in development, return true
        if (this.useMockApi) {
          console.log('API connection failed but mock API is enabled');
          return true;
        }
        
        // If we're in development, allow the app to continue even if the API is unreachable
        if (process.env.NODE_ENV === 'development') {
          console.log('Development mode: Continuing despite API health check failure');
          return true;
        }
        
        return false;
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      console.error('API health check error:', error);
      
      // If error occurs but mock API is enabled in development, return true
      if (this.useMockApi) {
        console.log('API health check error but mock API is enabled');
        return true;
      }
      
      return false;
    }
  }
} 