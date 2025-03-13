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
        You are an expert resume analyzer. Analyze this resume against the job description.
        
        RESUME:
        {resume_text}
        
        JOB DESCRIPTION:
        {job_description}
        
        Respond with ONLY a JSON object in this exact format:
        {{
            "match_score": <number 0-100>,
            "feedback": "<concise feedback, max 200 words>",
            "skills_match": ["<skill1>", "<skill2>", ...],
            "improvement_areas": ["<suggestion1>", "<suggestion2>", ...]
        }}
        """

        # Generate the response with timeout
        response = await asyncio.wait_for(
            model.generate_content_async(prompt),
            timeout=15  # 15 second timeout
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
                }

        # Ensure all required fields are present
        required_fields = [
            "match_score",
            "feedback",
            "skills_match",
            "improvement_areas",
        ]
        for field in required_fields:
            if field not in result:
                if field == "match_score":
                    result[field] = 0
                elif field == "feedback":
                    result[field] = "No specific feedback available."
                else:
                    result[field] = []
        
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
        }
    except Exception as e:
        print(f"Error analyzing resume: {str(e)}")
        return {
            "match_score": 0,
            "feedback": f"Error analyzing resume: {str(e)}",
            "skills_match": [],
            "improvement_areas": ["An error occurred during analysis."],
        }
