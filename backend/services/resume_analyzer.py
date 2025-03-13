import os
import json
import google.generativeai as genai  # type: ignore
from typing import Dict, Any, List


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
    try:
        # Configure the model
        generation_config = {
            "temperature": 0.2,
            "top_p": 0.8,
            "top_k": 40,
            "max_output_tokens": 2048,
        }
        
        model = genai.GenerativeModel(
            model_name="gemini-1.5-pro",
            generation_config=generation_config
        )

        # Create the prompt
        prompt = f"""
        You are an expert resume analyzer and career coach.
        Analyze the following resume against the job description.
        
        RESUME:
        {resume_text}
        
        JOB DESCRIPTION:
        {job_description}
        
        Provide a detailed analysis in JSON format with the following structure:
        {{
            "match_score": (a number between 0-100 representing overall match),
            "feedback": (detailed feedback about the resume's match with the job),
            "skills_match": [list of skills from the resume that match the job requirements],
            "improvement_areas": [specific suggestions to improve the resume for this job]
        }}
        
        Return ONLY the JSON object with no additional text.
        """

        # Generate the response
        response = await model.generate_content_async(prompt)
        response_text = response.text

        # Extract JSON from response
        try:
            # Try to parse the response as JSON directly
            result = json.loads(response_text)
        except json.JSONDecodeError:
            # If direct parsing fails, try to extract JSON from the text
            import re

            json_match = re.search(
                r"```json\s*(.*?)\s*```", response_text, re.DOTALL
            )
            if json_match:
                result = json.loads(json_match.group(1))
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

        return result

    except Exception as e:
        print(f"Error analyzing resume: {str(e)}")
        return {
            "match_score": 0,
            "feedback": f"Error analyzing resume: {str(e)}",
            "skills_match": [],
            "improvement_areas": ["An error occurred during analysis."],
        }
