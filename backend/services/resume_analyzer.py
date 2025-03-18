import os
import json
import google.generativeai as genai  # type: ignore
from typing import Dict, Any, List
import hashlib
import functools
import asyncio
from datetime import datetime, timedelta

# Simple in-memory cache for analysis results
_analysis_cache = {}
_cache_ttl = timedelta(hours=24)  # Cache results for 24 hours

def _generate_cache_key(resume_text: str, job_description: str) -> str:
    """Generate a unique cache key based on resume text and job description"""
    combined = f"{resume_text}|{job_description}"
    return hashlib.md5(combined.encode()).hexdigest()

async def analyze_resume_with_gemini(
    resume_text: str, job_description: str
) -> Dict[str, Any]:
    """
    Analyze a resume against a job description using Google Gemini AI

    Args:
        resume_text: Extracted text from the resume
        job_description: Job description text

    Returns:
        Dict containing analysis results
    """
    # Check cache first
    cache_key = _generate_cache_key(resume_text, job_description)
    if cache_key in _analysis_cache:
        cached_result, timestamp = _analysis_cache[cache_key]
        if datetime.now() - timestamp < _cache_ttl:
            print("Using cached analysis result")
            return cached_result

    # Truncate long texts to reduce token usage
    max_resume_length = 8000  # Approximately 2000 tokens
    max_job_desc_length = 2000  # Approximately 500 tokens
    
    if len(resume_text) > max_resume_length:
        resume_text = resume_text[:max_resume_length] + "..."
    
    if len(job_description) > max_job_desc_length:
        job_description = job_description[:max_job_desc_length] + "..."
    
    try:
        # Configure the model with optimized settings
        generation_config = {
            "temperature": 0.1,  # Lower temperature for more deterministic results
            "top_p": 0.7,
            "top_k": 20,
            "max_output_tokens": 1024,  # Reduced token limit for faster response
        }
        
        model = genai.GenerativeModel(
            model_name="gemini-1.5-pro",
            generation_config=generation_config
        )

        # Create a more structured and efficient prompt
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
        
        RESUME:
        {resume_text}
        
        JOB DESCRIPTION:
        {job_description}
        
        Respond with ONLY a JSON object in this exact format:
        {{
            "match_score": <number 0-100>,
            "feedback": "<begin with a 2-sentence introduction summary followed by 4-6 specific detailed points as complete sentences>",
            "skills_match": ["<skill1>", "<skill2>", ...],
            "improvement_areas": ["<specific suggestion1>", "<specific suggestion2>", ...],
            "searchability_issues": <number of issues 0-15>,
            "hard_skills_issues": <number of issues 0-15>,
            "soft_skills_issues": <number of issues 0-15>,
            "recruiter_tips_issues": <number of issues 0-15>,
            "formatting_issues": <number of issues 0-15>,
            "keywords_match_percentage": <number 0-100>,
            "experience_level_percentage": <number 0-100>,
            "skills_relevance_percentage": <number 0-100>,
            "job_title": "<extracted job title>",
            "industry_insights": {{
                "industry": "<industry name>",
                "title": "<industry title>",
                "recommendations": [
                    "<actionable industry recommendation 1>",
                    "<actionable industry recommendation 2>",
                    "<actionable industry recommendation 3>",
                    "<actionable industry recommendation 4>",
                    "<actionable industry recommendation 5 with focus on ATS>"
                ]
            }},
            "formatting_checks": {{
                "font_check": {{
                    "passed": <boolean true/false>,
                    "details": [
                        "<specific font check observation 1>",
                        "<specific font check observation 2>",
                        "<specific font check observation 3>"
                    ]
                }},
                "layout_check": {{
                    "passed": <boolean true/false>,
                    "details": [
                        "<specific layout check observation 1>",
                        "<specific layout check observation 2>",
                        "<specific layout check observation 3>"
                    ]
                }},
                "page_setup_check": {{
                    "passed": <boolean true/false>,
                    "details": [
                        "<specific page setup check observation 1>",
                        "<specific page setup check observation 2>",
                        "<specific page setup check observation 3>"
                    ]
                }}
            }}
        }}
        
        IMPORTANT NOTES:
        - Format the feedback as a short 2-sentence intro paragraph followed by 4-6 detailed bullet points
        - Do NOT use asterisks (*) or any symbols at the beginning of points
        - Ensure all improvement areas are specific, actionable, and tailored to this exact resume
        - Industry insights must include up-to-date information and trends from 2024
        - Include 2-3 ATS-specific optimization tips in the recommendations
        - All feedback should be constructive, specific, and directly relevant to the job
        - Personalize all feedback to the candidate's experience level and role
        - Provide detailed formatting checks focused on ATS compatibility and recruiter readability
        """

        # Generate the response with timeout
        response = await asyncio.wait_for(
            model.generate_content_async(prompt),
            timeout=45  # Increase to 45 second timeout to allow for web searches and detailed analysis
        )
        response_text = response.text

        # Extract JSON from response
        try:
            # Try to parse the response as JSON directly
            result = json.loads(response_text)
        except json.JSONDecodeError:
            # If direct parsing fails, try to extract JSON from the text
            import re

            json_match = re.search(
                r"```json\s*(.*?)\s*```|```\s*(.*?)\s*```|{\s*\"match_score\".*}",
                response_text,
                re.DOTALL
            )
            if json_match:
                json_str = json_match.group(1) or json_match.group(2) or json_match.group(0)
                result = json.loads(json_str)
            else:
                # Fallback to a default structure
                result = {
                    "match_score": 0,
                    "feedback": "Failed to analyze resume. Please try again.",
                    "skills_match": [],
                    "improvement_areas": ["Unable to process the resume properly."],
                    # Default values for issue metrics
                    "searchability_issues": 0,
                    "hard_skills_issues": 0,
                    "soft_skills_issues": 0,
                    "recruiter_tips_issues": 0,
                    "formatting_issues": 0,
                    # Default values for keyword metrics
                    "keywords_match_percentage": 0,
                    "experience_level_percentage": 0,
                    "skills_relevance_percentage": 0,
                    # Default values for job title and industry insights
                    "job_title": "Unknown Position",
                    "industry_insights": {
                        "industry": "General",
                        "title": "General Resume Recommendations",
                        "recommendations": [
                            "Tailor your resume to match the specific job description",
                            "Quantify achievements with specific metrics when possible",
                            "Use action verbs to begin bullet points",
                            "Include relevant keywords from the job description",
                            "Ensure your resume is ATS-friendly with a clean format"
                        ]
                    },
                    # Default formatting checks
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

        # Ensure all required fields are present
        required_fields = [
            "match_score",
            "feedback",
            "skills_match",
            "improvement_areas",
            # Issue metrics fields
            "searchability_issues",
            "hard_skills_issues",
            "soft_skills_issues",
            "recruiter_tips_issues",
            "formatting_issues",
            # Keyword metrics fields
            "keywords_match_percentage",
            "experience_level_percentage",
            "skills_relevance_percentage",
            # Job title and industry insights
            "job_title",
            "industry_insights",
            # Formatting checks
            "formatting_checks"
        ]
        for field in required_fields:
            if field not in result:
                if field == "match_score":
                    result[field] = 0
                elif field == "feedback":
                    result[field] = "No specific feedback available."
                elif field in ["skills_match", "improvement_areas"]:
                    result[field] = []
                elif field == "formatting_checks":
                    result[field] = {
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
                else:
                    # Default to 0 for all numeric metrics
                    result[field] = 0
        
        # Limit the size of arrays to improve response time
        if len(result.get("skills_match", [])) > 10:
            result["skills_match"] = result["skills_match"][:10]
            
        if len(result.get("improvement_areas", [])) > 5:
            result["improvement_areas"] = result["improvement_areas"][:5]

        # Cache the result
        _analysis_cache[cache_key] = (result, datetime.now())
        
        return result

    except asyncio.TimeoutError:
        print("Analysis timed out")
        return {
            "match_score": 0,
            "feedback": "Analysis timed out. Please try again with a shorter resume or job description.",
            "skills_match": [],
            "improvement_areas": ["Try simplifying your resume or job description."],
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
    except Exception as e:
        print(f"Error analyzing resume: {str(e)}")
        return {
            "match_score": 0,
            "feedback": f"Error analyzing resume: {str(e)}",
            "skills_match": [],
            "improvement_areas": ["An error occurred during analysis."],
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
