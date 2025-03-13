import { auth } from './firebase';
import { handleApiError } from './error-handler';

interface AnalysisResult {
  match_score: number;
  feedback: string;
  skills_match: string[];
  improvement_areas: string[];
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
  job_description: string;
  match_score: number;
  feedback: string;
  skills_match: string[];
  improvement_areas: string[];
  created_at: any; // Firestore timestamp
}

export class ApiClient {
  private baseUrl: string;
  private defaultTimeout: number = 10000; // Reduce timeout from 30s to 10s for faster feedback

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      const currentUser = auth.currentUser;
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
   * Generic fetch method with error handling and timeout
   */
  private async fetchWithTimeout<T>(
    url: string, 
    options: RequestInit, 
    timeout: number = this.defaultTimeout
  ): Promise<T> {
    // Create an abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
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
        
        const error = new Error(errorData.message || 'API request failed');
        Object.assign(error, {
          status: response.status,
          statusText: response.statusText,
          data: errorData,
        });
        
        throw error;
      }
      
      // Check if response is empty
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json() as T;
      }
      
      return {} as T;
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      // Handle timeout
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please try again.');
      }
      
      throw error;
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
        60000 // 60 seconds timeout for analysis
      );
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Get user's resumes
   */
  async getUserResumes(): Promise<Resume[]> {
    try {
      const headers = await this.getHeaders();
      
      const data = await this.fetchWithTimeout<{ resumes: Resume[] }>(
        `${this.baseUrl}/users/me/resumes`, 
        {
          method: 'GET',
          headers,
        }
      );
      
      return data.resumes;
    } catch (error) {
      console.error('Error fetching user resumes:', error);
      handleApiError(error); // Just log the error, don't store the response
      // Return empty array instead of throwing for better UX
      return [];
    }
  }

  /**
   * Get user's analyses
   */
  async getUserAnalyses(limit: number = 10): Promise<Analysis[]> {
    try {
      const headers = await this.getHeaders();
      
      const data = await this.fetchWithTimeout<{ analyses: Analysis[] }>(
        `${this.baseUrl}/users/me/analyses?limit=${limit}`, 
        {
          method: 'GET',
          headers,
        }
      );
      
      return data.analyses;
    } catch (error) {
      console.error('Error fetching user analyses:', error);
      handleApiError(error); // Just log the error, don't store the response
      // Return empty array instead of throwing for better UX
      return [];
    }
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
} 