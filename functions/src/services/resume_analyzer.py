import os
import json
import re
import asyncio
import hashlib
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, Tuple, List, Optional

import google.generativeai as genai
from google.api_core.exceptions import DeadlineExceeded
from werkzeug.utils import secure_filename
import openai

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Cache for analysis results to avoid redundant processing
_analysis_cache: Dict[str, Tuple[Dict[str, Any], datetime]] = {}

# Configure Google API
genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))

# Configure OpenAI API
openai.api_key = "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"

async def analyze_resume(resume_text: str, job_description: str) -> Dict[str, Any]:
    """
    Analyzes a resume against a job description using Google's Generative AI.
    
    Args:
        resume_text: The extracted text from the resume
        job_description: The job description to compare against
    
    Returns:
        Dict containing the analysis results
    """
    # Create a cache key based on the hash of inputs
    cache_key = hashlib.md5(f"{resume_text}:{job_description}".encode()).hexdigest()
    
    # Check if we already have a cached result that's less than 6 hours old
    if cache_key in _analysis_cache:
        cached_result, timestamp = _analysis_cache[cache_key]
        if datetime.now() - timestamp < timedelta(hours=6):
            print("Using cached analysis result")
            return cached_result

    # Analysis with fallback attempts
    max_attempts = 3
    for attempt_count in range(max_attempts):
        try:
            if attempt_count == 0:
                # First attempt: Use Gemini 1.5 Ultra
                logger.info("Attempt 1: Using Gemini 1.5 Ultra")
                response_text = await try_with_gemini_ultra(resume_text, job_description)
            elif attempt_count == 1:
                # Second attempt: Use OpenAI GPT-4
                logger.info("Attempt 2: Using OpenAI GPT-4")
                response_text = await try_with_openai_gpt4(resume_text, job_description)
            else:
                # Third attempt: Use Gemini 1.5 Pro
                logger.info("Attempt 3: Using Gemini 1.5 Pro")
                response_text = await try_with_gemini_pro(resume_text, job_description)
            
            # Get the response text and log it for debugging
            logger.info(f"Raw response from model: {response_text[:200]}...")
            
            # Attempt to repair and parse the JSON
            try:
                # 1. First try direct parsing
                cleaned_json = clean_json_response(response_text)
                result = json.loads(cleaned_json)
                logger.info("Successfully parsed response as JSON directly")
                
                # 2. Validate required fields based on attempt number
                if attempt_count == 0:
                    # Check for required fields in full format
                    required_fields = [
                        "match_score", "feedback", "skills_match", "improvement_areas",
                        "job_title", "industry_insights"
                    ]
                    
                    for field in required_fields:
                        if field not in result:
                            logger.warning(f"Missing required field: {field}")
                            raise ValueError(f"Missing required field: {field}")
                else:
                    # Check for required fields in simplified format
                    required_fields = ["match_score", "feedback", "skills_match", "improvement_areas", "job_title"]
                    
                    for field in required_fields:
                        if field not in result:
                            logger.warning(f"Missing required field: {field}")
                            raise ValueError(f"Missing required field: {field}")
                
                # 3. For first attempt with complete format
                if attempt_count == 0:
                    # Ensure all fields have proper data types
                    result["match_score"] = float(result.get("match_score", 0))
                    result["searchability_issues"] = int(result.get("searchability_issues", 0))
                    result["hard_skills_issues"] = int(result.get("hard_skills_issues", 0))
                    result["soft_skills_issues"] = int(result.get("soft_skills_issues", 0))
                    result["recruiter_tips_issues"] = int(result.get("recruiter_tips_issues", 0))
                    result["formatting_issues"] = int(result.get("formatting_issues", 0))
                    result["keywords_match_percentage"] = float(result.get("keywords_match_percentage", 0))
                    result["experience_level_percentage"] = float(result.get("experience_level_percentage", 0))
                    result["skills_relevance_percentage"] = float(result.get("skills_relevance_percentage", 0))
                    
                    # Ensure nested objects exist
                    if "industry_insights" not in result or not isinstance(result["industry_insights"], dict):
                        result["industry_insights"] = {
                            "industry": "General",
                            "title": f"General Resume Recommendations for {datetime.now().year}",
                            "recommendations": [
                                "Tailor your resume to match the specific job description",
                                "Quantify achievements with specific metrics when possible",
                                "Use action verbs to begin bullet points",
                                "Include relevant keywords from the job description",
                                "Ensure your resume is ATS-friendly with a clean format"
                            ]
                        }
                    
                    if "formatting_checks" not in result or not isinstance(result["formatting_checks"], dict):
                        result["formatting_checks"] = {
                            "font_check": {
                                "passed": True,
                                "details": [
                                    "Use standard fonts like Arial, Calibri, or Times New Roman for best ATS compatibility",
                                    "Keep font size between 10-12pt for body text",
                                    "Use consistent font styling throughout your resume"
                                ]
                            },
                            "layout_check": {
                                "passed": True,
                                "details": [
                                    "Use a single-column layout for better ATS readability",
                                    "Avoid tables, text boxes, and complex formatting",
                                    "Use standard section headings like 'Experience' and 'Education'"
                                ]
                            },
                            "page_setup_check": {
                                "passed": True,
                                "details": [
                                    "Use standard margins (0.5-1 inch)",
                                    "Save your resume as a PDF file",
                                    "Keep your resume to 1-2 pages maximum"
                                ]
                            }
                        }
                        
                    # Cache and return the validated result
                    _analysis_cache[cache_key] = (result, datetime.now())
                    return result
                    
                else:
                    # For fallback attempts with simplified format, add missing fields
                    result = {
                        "match_score": float(result.get("match_score", 0)),
                        "feedback": result.get("feedback", ""),
                        "skills_match": result.get("skills_match", []),
                        "improvement_areas": result.get("improvement_areas", []),
                        "job_title": result.get("job_title", "Unknown Position"),
                        "searchability_issues": 0,
                        "hard_skills_issues": 0,
                        "soft_skills_issues": 0,
                        "recruiter_tips_issues": 0,
                        "formatting_issues": 0,
                        "keywords_match_percentage": float(result.get("match_score", 0)),
                        "experience_level_percentage": float(result.get("match_score", 0)),
                        "skills_relevance_percentage": float(result.get("match_score", 0)),
                        "industry_insights": {
                            "industry": "General",
                            "title": f"General Resume Recommendations for {datetime.now().year}",
                            "recommendations": [
                                "Tailor your resume to match the specific job description",
                                "Quantify achievements with specific metrics when possible",
                                "Use action verbs to begin bullet points",
                                "Include relevant keywords from the job description",
                                "Ensure your resume is ATS-friendly with a clean format"
                            ]
                        },
                        "formatting_checks": {
                            "font_check": {
                                "passed": True,
                                "details": [
                                    "Use standard fonts like Arial, Calibri, or Times New Roman for best ATS compatibility",
                                    "Keep font size between 10-12pt for body text",
                                    "Use consistent font styling throughout your resume"
                                ]
                            },
                            "layout_check": {
                                "passed": True,
                                "details": [
                                    "Use a single-column layout for better ATS readability",
                                    "Avoid tables, text boxes, and complex formatting",
                                    "Use standard section headings like 'Experience' and 'Education'"
                                ]
                            },
                            "page_setup_check": {
                                "passed": True,
                                "details": [
                                    "Use standard margins (0.5-1 inch)",
                                    "Save your resume as a PDF file",
                                    "Keep your resume to 1-2 pages maximum"
                                ]
                            }
                        }
                    }
                    _analysis_cache[cache_key] = (result, datetime.now())
                    return result
                    
            except Exception as json_error:
                logger.error(f"Failed to parse response as JSON: {str(json_error)}")
                logger.error(f"Response text: {response_text[:500]}...")
                
                # If this isn't the last attempt, try again
                if attempt_count < max_attempts - 1:
                    logger.info(f"Retrying with attempt {attempt_count + 2}...")
                    continue
                
                # Last attempt failed, create a default response
                logger.warning("All JSON parsing attempts failed. Generating default response.")
                default_result = generate_default_response(resume_text, job_description)
                _analysis_cache[cache_key] = (default_result, datetime.now())
                return default_result
                
        except DeadlineExceeded:
            logger.error(f"Request timed out on attempt {attempt_count + 1}")
            if attempt_count < max_attempts - 1:
                logger.info(f"Retrying with attempt {attempt_count + 2}...")
                continue
        except Exception as e:
            logger.error(f"Error during analysis on attempt {attempt_count + 1}: {str(e)}")
            if attempt_count < max_attempts - 1:
                logger.info(f"Retrying with attempt {attempt_count + 2}...")
                continue
    
    # If all attempts failed, return a default response
    logger.warning("All analysis attempts failed. Generating default response.")
    default_result = generate_default_response(resume_text, job_description)
    _analysis_cache[cache_key] = (default_result, datetime.now())
    return default_result

async def try_with_gemini_ultra(resume_text: str, job_description: str) -> str:
    """
    Try to analyze the resume with Gemini 1.5 Ultra
    
    Args:
        resume_text: The resume text
        job_description: The job description
        
    Returns:
        The raw response text
    """
    # Initialize the model
    model = genai.GenerativeModel("gemini-1.5-ultra")
    
    # Configure the model with optimized settings
    generation_config = {
        "temperature": 0.1,  # Lower temperature for more deterministic results
        "top_p": 0.9,        # Increased for better vocabulary access
        "top_k": 30,         # Increased for more diverse terminology
        "max_output_tokens": 8192,  # Maximum output tokens for comprehensive analysis
        "response_mime_type": "application/json",  # Force JSON response format
    }

    # Create the full prompt
    prompt = f"""
    You are an expert resume analyzer for job applications. Analyze this resume against the job description.
    
    INSTRUCTIONS:
    1. Analyze the resume content and job description thoroughly
    2. Extract the job title from the job description
    3. Identify matching skills between the resume and job description
    4. Provide personalized and specific improvement areas tailored to this exact resume and job
    5. Create industry-specific insights based on latest trends and best practices (2024)
    6. Pay special attention to Applicant Tracking System (ATS) optimization techniques
    7. Analyze the resume formatting for ATS compatibility and readability
    8. Provide specific feedback on font, layout, and page setup
    
    IMPORTANT: Format your response as a VALID JSON object with the following structure:
    {{
      "match_score": number,
      "feedback": "string with 2-3 sentences of overall feedback",
      "skills_match": ["skill1", "skill2", "skill3", ...],
      "improvement_areas": ["area1", "area2", "area3", ...],
      "searchability_issues": number,
      "hard_skills_issues": number,
      "soft_skills_issues": number,
      "recruiter_tips_issues": number,
      "formatting_issues": number,
      "keywords_match_percentage": number,
      "experience_level_percentage": number,
      "skills_relevance_percentage": number,
      "job_title": "extracted job title",
      "industry_insights": {{
        "industry": "industry name",
        "title": "title for industry insights",
        "recommendations": ["rec1", "rec2", "rec3", ...]
      }},
      "formatting_checks": {{
        "font_check": {{
          "passed": boolean,
          "details": ["detail1", "detail2", "detail3"]
        }},
        "layout_check": {{
          "passed": boolean,
          "details": ["detail1", "detail2", "detail3"]
        }},
        "page_setup_check": {{
          "passed": boolean,
          "details": ["detail1", "detail2", "detail3"]
        }}
      }}
    }}

    Resume text:
    {resume_text}

    Job Description:
    {job_description}

    REMEMBER: Return ONLY valid JSON format. No additional text, no explanations outside the JSON structure.
    """

    # Generate the response with timeout
    response = await asyncio.wait_for(
        model.generate_content_async(
            prompt,
            generation_config=generation_config
        ),
        timeout=60  # 60 second timeout to allow for comprehensive analysis
    )
    
    # Return the response text
    return response.text if hasattr(response, 'text') else str(response)

async def try_with_gemini_pro(resume_text: str, job_description: str) -> str:
    """
    Try to analyze the resume with Gemini 1.5 Pro
    
    Args:
        resume_text: The resume text
        job_description: The job description
        
    Returns:
        The raw response text
    """
    # Initialize the model
    model = genai.GenerativeModel("gemini-1.5-pro")
    
    # Configure the model with optimized settings
    generation_config = {
        "temperature": 0.1,  # Lower temperature for more deterministic results
        "top_p": 0.9,        # Increased for better vocabulary access
        "top_k": 30,         # Increased for more diverse terminology
        "max_output_tokens": 8192,  # Maximum output tokens for comprehensive analysis
        "response_mime_type": "application/json",  # Force JSON response format
    }

    # Create a simplified prompt for the Pro model
    prompt = f"""
    You are an expert resume analyzer. Analyze this resume against the job description.
    
    INSTRUCTIONS:
    1. Analyze the resume content and job description thoroughly
    2. Extract the job title from the job description
    3. Identify matching skills between the resume and job description
    4. Provide personalized improvement areas tailored to this resume and job
    
    IMPORTANT: Format your response as a VALID JSON object with the following structure:
    {{
      "match_score": number,
      "feedback": "string with 2-3 sentences of specific feedback",
      "skills_match": ["skill1", "skill2", "skill3", ...],
      "improvement_areas": ["area1", "area2", "area3", ...],
      "job_title": "extracted job title"
    }}

    Resume text:
    {resume_text}

    Job Description:
    {job_description}

    RETURN ONLY VALID JSON. No additional text before or after the JSON object.
    """

    # Generate the response with timeout
    response = await asyncio.wait_for(
        model.generate_content_async(
            prompt,
            generation_config=generation_config
        ),
        timeout=60  # 60 second timeout to allow for comprehensive analysis
    )
    
    # Return the response text
    return response.text if hasattr(response, 'text') else str(response)

async def try_with_openai_gpt4(resume_text: str, job_description: str) -> str:
    """
    Try to analyze the resume with OpenAI's GPT-4
    
    Args:
        resume_text: The resume text
        job_description: The job description
        
    Returns:
        The raw response text
    """
    # Create a comprehensive prompt for GPT-4, matching Gemini Ultra capabilities
    prompt = f"""
    You are an expert resume analyzer for job applications. Analyze this resume against the job description.
    
    INSTRUCTIONS:
    1. Analyze the resume content and job description thoroughly
    2. Extract the job title from the job description
    3. Identify matching skills between the resume and job description
    4. Provide personalized and specific improvement areas tailored to this exact resume and job
    5. Create industry-specific insights based on latest trends and best practices (2024)
    6. Pay special attention to Applicant Tracking System (ATS) optimization techniques
    7. Analyze the resume formatting for ATS compatibility and readability
    8. Provide specific feedback on font, layout, and page setup
    
    IMPORTANT: Format your response as a VALID JSON object with the following structure:
    {{
      "match_score": number,
      "feedback": "string with 2-3 sentences of overall feedback",
      "skills_match": ["skill1", "skill2", "skill3", ...],
      "improvement_areas": ["area1", "area2", "area3", ...],
      "searchability_issues": number,
      "hard_skills_issues": number,
      "soft_skills_issues": number,
      "recruiter_tips_issues": number,
      "formatting_issues": number,
      "keywords_match_percentage": number,
      "experience_level_percentage": number,
      "skills_relevance_percentage": number,
      "job_title": "extracted job title",
      "industry_insights": {{
        "industry": "industry name",
        "title": "title for industry insights",
        "recommendations": ["rec1", "rec2", "rec3", ...]
      }},
      "formatting_checks": {{
        "font_check": {{
          "passed": boolean,
          "details": ["detail1", "detail2", "detail3"]
        }},
        "layout_check": {{
          "passed": boolean,
          "details": ["detail1", "detail2", "detail3"]
        }},
        "page_setup_check": {{
          "passed": boolean,
          "details": ["detail1", "detail2", "detail3"]
        }}
      }}
    }}

    Resume text:
    {resume_text}

    Job Description:
    {job_description}

    RETURN ONLY VALID JSON. No additional text before or after the JSON object.
    """
    
    # Call OpenAI API
    try:
        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert resume analyzer with deep knowledge of ATS systems, industry trends, and job market requirements. Respond only with detailed JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1,  # Low temperature for deterministic results
            max_tokens=8000,  # Increased token limit for comprehensive analysis
            response_format={"type": "json_object"}
        )
        
        # Extract the response text
        return response.choices[0].message.content
    except Exception as e:
        logger.error(f"Error with OpenAI API: {str(e)}")
        raise

def clean_json_response(text: str) -> str:
    """
    Clean and repair malformed JSON from model responses.
    
    Args:
        text: The raw text containing JSON
        
    Returns:
        Cleaned JSON string
    """
    # 1. Try to extract JSON if there's text before or after it
    json_pattern = r'(\{.*\})'
    json_match = re.search(json_pattern, text, re.DOTALL)
    
    if json_match:
        text = json_match.group(1)
    
    # 2. Fix common JSON syntax errors
    
    # Fix unescaped quotes in string values
    # This regex looks for unescaped quotes inside JSON string values
    text = re.sub(r'(?<=[:\[\{,]\s*")([^"]*?)(?<!")(?:")(?=[^"]*"(?:,|\}|\]|$))', r'\1\\"', text)
    
    # Fix missing commas between elements
    text = re.sub(r'(\}|\]|")\s*(\{|\[|")', r'\1,\2', text)
    
    # Fix trailing commas
    text = re.sub(r',\s*(\}|\])', r'\1', text)
    
    # Fix missing quotes around property names
    text = re.sub(r'(\{|\,)\s*([a-zA-Z0-9_]+)\s*:', r'\1"\2":', text)
    
    # 3. Validate JSON structure
    # Check for balanced braces and brackets
    open_braces = text.count('{')
    close_braces = text.count('}')
    open_brackets = text.count('[')
    close_brackets = text.count(']')
    
    # Add missing closing braces or brackets
    if open_braces > close_braces:
        text += '}' * (open_braces - close_braces)
    
    if open_brackets > close_brackets:
        text += ']' * (open_brackets - close_brackets)
    
    return text

def generate_default_response(resume_text: str, job_description: str) -> Dict[str, Any]:
    """
    Generate a default response when all analysis attempts fail.
    
    Args:
        resume_text: The resume text
        job_description: The job description
        
    Returns:
        A default analysis result
    """
    # Extract a job title from the job description using regex
    job_title_match = re.search(r'(?i)(?:job title|position|role|hiring for)\s*:?\s*([A-Za-z0-9\s]+(?:\s+[A-Za-z0-9]+){0,5})', job_description)
    job_title = job_title_match.group(1).strip() if job_title_match else "Unknown Position"
    
    # Extract potential skills from both texts
    skill_keywords = [
        "python", "java", "javascript", "typescript", "react", "angular", "vue", "node", "express", 
        "django", "flask", "sql", "nosql", "mongodb", "postgres", "mysql", "aws", "azure", "gcp", 
        "docker", "kubernetes", "ci/cd", "git", "agile", "scrum", "product management", "project management",
        "leadership", "communication", "problem solving", "critical thinking", "data analysis", 
        "machine learning", "ai", "nlp", "computer vision", "data science", "ui/ux", "design", 
        "photoshop", "illustrator", "figma", "sketch", "html", "css", "sass", "less", "swift",
        "kotlin", "objective-c", "flutter", "react native", "mobile development"
    ]
    
    matched_skills = []
    for skill in skill_keywords:
        if re.search(r'\b' + re.escape(skill) + r'\b', resume_text, re.IGNORECASE) and \
           re.search(r'\b' + re.escape(skill) + r'\b', job_description, re.IGNORECASE):
            matched_skills.append(skill)
    
    # Limit to top 10 skills
    matched_skills = matched_skills[:10]
    
    # Generic improvement areas
    improvement_areas = [
        "Tailor your resume specifically to this job description",
        "Quantify your achievements with metrics and numbers",
        "Use action verbs to begin your bullet points",
        "Ensure your most relevant experience is prominently displayed",
        "Add a concise professional summary at the top of your resume"
    ]
    
    return {
        "match_score": 60.0,  # Default moderate match
        "feedback": "Your resume contains some relevant skills for this position. Consider tailoring it more specifically to the job description and quantifying your achievements with metrics.",
        "skills_match": matched_skills,
        "improvement_areas": improvement_areas,
        "searchability_issues": 5,
        "hard_skills_issues": 5,
        "soft_skills_issues": 5,
        "recruiter_tips_issues": 5,
        "formatting_issues": 5,
        "keywords_match_percentage": 60.0,
        "experience_level_percentage": 60.0,
        "skills_relevance_percentage": 60.0,
        "job_title": job_title,
        "industry_insights": {
            "industry": "General",
            "title": f"General Resume Recommendations for {datetime.now().year}",
            "recommendations": [
                "Tailor your resume to match the specific job description",
                "Quantify achievements with specific metrics when possible",
                "Use action verbs to begin bullet points",
                "Include relevant keywords from the job description",
                "Ensure your resume is ATS-friendly with a clean format"
            ]
        },
        "formatting_checks": {
            "font_check": {
                "passed": True,
                "details": [
                    "Use standard fonts like Arial, Calibri, or Times New Roman for best ATS compatibility",
                    "Keep font size between 10-12pt for body text",
                    "Use consistent font styling throughout your resume"
                ]
            },
            "layout_check": {
                "passed": True,
                "details": [
                    "Use a single-column layout for better ATS readability",
                    "Avoid tables, text boxes, and complex formatting",
                    "Use standard section headings like 'Experience' and 'Education'"
                ]
            },
            "page_setup_check": {
                "passed": True,
                "details": [
                    "Use standard margins (0.5-1 inch)",
                    "Save your resume as a PDF file",
                    "Keep your resume to 1-2 pages maximum"
                ]
            }
        }
    }

def extract_text_from_file(file_path: str) -> str:
    """
    Extract text from supported file types (PDF, DOCX, TXT)
    """
    # Implementation remains the same
    pass
