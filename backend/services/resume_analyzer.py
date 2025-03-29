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
        # Only use cached results if they are very recent (1 hour)
        # This ensures industry insights are always current
        if datetime.now() - timestamp < timedelta(hours=1):
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

        # Get current year for industry insights
        current_year = datetime.now().year

        # Create a more structured and efficient prompt
        prompt = f"""
        You are an expert resume analyzer for job applications. Analyze this resume against the job description.
        
        INSTRUCTIONS:
        1. Analyze the resume content and job description thoroughly
        2. Extract the job title from the job description
        3. Identify matching skills between the resume and job description
        4. Provide personalized and specific improvement areas tailored to this exact resume and job
        5. Create industry-specific insights based on LATEST industry trends and best practices for {current_year}
        6. Include specific job market trends and hiring patterns that are current for {current_year}
        7. Pay special attention to Applicant Tracking System (ATS) optimization techniques
        8. Analyze the resume formatting for ATS compatibility and readability
        9. Provide specific feedback on font, layout, and page setup
        10. Conduct brief web research if needed to ensure industry insights are current
        
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
                "title": "<industry title for {current_year}>",
                "current_year": {current_year},
                "market_overview": "<1-2 sentence current market overview for this industry in {current_year}>",
                "recommendations": [
                    "<actionable industry recommendation 1 with {current_year} trends>",
                    "<actionable industry recommendation 2 with {current_year} trends>",
                    "<actionable industry recommendation 3 with {current_year} trends>",
                    "<actionable industry recommendation 4 with {current_year} trends>",
                    "<actionable industry recommendation 5 with focus on ATS and {current_year} trends>"
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
        - Industry insights MUST include up-to-date information and trends from {current_year}
        - Use your internet search capability if needed to verify latest industry trends for {current_year}
        - Include 2-3 ATS-specific optimization tips in the recommendations that reflect {current_year} trends
        - All feedback should be constructive, specific, and directly relevant to the job
        - Personalize all feedback to the candidate's experience level and role
        - Provide detailed formatting checks focused on ATS compatibility and recruiter readability
        - Make sure all industry insights reflect the latest hiring patterns and job market conditions
        """

        # Generate the response with timeout
        response = await asyncio.wait_for(
            model.generate_content_async(prompt),
            timeout=50  # Increase to 50 second timeout to allow for web searches and detailed analysis
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
                try:
                    # Try again with cleaned JSON string
                    json_str = json_str.strip()
                    result = json.loads(json_str)
                except json.JSONDecodeError as e:
                    print(f"JSON decode error: {str(e)}")
                    # Fallback to a default structure
                    current_year = datetime.now().year
                    result = create_default_analysis_result(current_year)
            else:
                # Fallback to a default structure
                current_year = datetime.now().year
                result = create_default_analysis_result(current_year)

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
                elif field in ["keywords_match_percentage", "experience_level_percentage", "skills_relevance_percentage"]:
                    result[field] = 0  # Ensure percentage fields have default values
                elif field == "job_title":
                    result[field] = "Unknown Position"
                elif field == "industry_insights":
                    current_year = datetime.now().year
                    result[field] = {
                        "industry": "General",
                        "title": f"General Resume Recommendations for {current_year}",
                        "current_year": current_year,
                        "market_overview": f"The job market in {current_year} emphasizes digital skills and adaptability across all industries.",
                        "recommendations": [
                            f"Tailor your resume to match job descriptions",
                            f"Quantify achievements with specific metrics",
                            f"Use relevant keywords for ATS systems",
                            f"Ensure your resume has a clean, professional format",
                            f"Highlight your most relevant skills first"
                        ]
                    }
                elif field == "formatting_checks":
                    result[field] = create_default_formatting_checks()
                else:
                    # Default to 0 for all numeric metrics
                    result[field] = 0
        
        # Validate numeric fields to ensure they are integers or can be converted to integers
        numeric_fields = [
            "match_score", 
            "keywords_match_percentage", 
            "experience_level_percentage", 
            "skills_relevance_percentage",
            "searchability_issues",
            "hard_skills_issues",
            "soft_skills_issues",
            "recruiter_tips_issues",
            "formatting_issues"
        ]
        
        for field in numeric_fields:
            try:
                # Try to convert the value to an integer if it's not already
                if not isinstance(result[field], (int, float)):
                    result[field] = int(float(str(result[field]).strip()))
            except (ValueError, TypeError):
                # If conversion fails, set a default value
                result[field] = 0
                
        # Ensure nested fields exist and have proper values
        if "industry_insights" in result and isinstance(result["industry_insights"], dict):
            if "recommendations" not in result["industry_insights"] or not isinstance(result["industry_insights"]["recommendations"], list):
                result["industry_insights"]["recommendations"] = []
                
        # Ensure formatting_checks structure is valid
        if "formatting_checks" in result:
            for check_type in ["font_check", "layout_check", "page_setup_check"]:
                if check_type not in result["formatting_checks"] or not isinstance(result["formatting_checks"][check_type], dict):
                    result["formatting_checks"][check_type] = {"passed": True, "details": []}
                if "details" not in result["formatting_checks"][check_type] or not isinstance(result["formatting_checks"][check_type]["details"], list):
                    result["formatting_checks"][check_type]["details"] = []
                if "passed" not in result["formatting_checks"][check_type]:
                    result["formatting_checks"][check_type]["passed"] = True

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

# Helper function to create default formatting checks
def create_default_formatting_checks():
    return {
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

# Helper function to create a default analysis result
def create_default_analysis_result(current_year):
    return {
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
            "title": f"General Resume Recommendations for {current_year}",
            "current_year": current_year,
            "market_overview": f"The job market in {current_year} emphasizes digital skills and adaptability across all industries. Companies are prioritizing candidates with demonstrated technical proficiency and soft skills.",
            "recommendations": [
                f"Tailor your resume to match the specific job description, focusing on {current_year}'s most demanded skills",
                f"Quantify achievements with specific metrics - a key differentiator in {current_year}'s competitive job market",
                f"Use action verbs to begin bullet points for greater impact with modern ATS systems",
                f"Include relevant keywords from the job description to pass the initial {current_year} ATS screening",
                f"Ensure your resume is ATS-friendly with a clean format, crucial for job applications in {current_year}"
            ]
        },
        # Default formatting checks
        "formatting_checks": create_default_formatting_checks()
    }
