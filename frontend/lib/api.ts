import { auth } from './firebase';

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
    const headers: HeadersInit = {};
    
    if (includeAuth) {
      const token = await this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    return headers;
  }

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
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error analyzing resume:', error);
      throw error;
    }
  }

  async getUserResumes(): Promise<Resume[]> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}/users/me/resumes`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.resumes;
    } catch (error) {
      console.error('Error fetching user resumes:', error);
      return [];
    }
  }

  async getUserAnalyses(limit: number = 10): Promise<Analysis[]> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}/users/me/analyses?limit=${limit}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.analyses;
    } catch (error) {
      console.error('Error fetching user analyses:', error);
      return [];
    }
  }
} 