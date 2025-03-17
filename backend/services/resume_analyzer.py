import json
import re
import os
import hashlib
import asyncio
import functools
from datetime import datetime, timedelta
from typing import Dict, Any, Tuple, List
import google.generativeai as genai  # type: ignore
import json5  # For more robust JSON parsing

# Configure Gemini API key from environment variable
gemini_api_key = os.environ.get("GEMINI_API_KEY")
if gemini_api_key:
    genai.configure(api_key=gemini_api_key)
else:
    raise ValueError("GEMINI_API_KEY environment variable is not set")

# Global cache for analysis results
# Key: hash of resume + job description
# Value: (analysis_result, timestamp)
_analysis_cache: Dict[str, Tuple[Dict[str, Any], datetime]] = {}
_cache_ttl = timedelta(hours=24)  # Cache results for 24 hours

def _generate_cache_key(resume_text: str, job_description: str) -> str:
    """Generate a unique cache key based on resume text and job description"""
    combined = f"{resume_text}|{job_description}"
    return hashlib.md5(combined.encode()).hexdigest()

def sanitize_json_string(json_str: str) -> str:
    """
    Sanitize a JSON string to fix common issues
    
    Args:
        json_str: String that may contain JSON
        
    Returns:
        Sanitized JSON string
    """
    # Make a copy of the input
    result = json_str
    
    # Remove any non-JSON prefix or suffix text
    json_start = result.find('{')
    if json_start > 0:
        result = result[json_start:]
    
    # Handle escaped newlines within string values
    # Use a safer approach that doesn't rely on variable-width lookbehind
    result = re.sub(r'(?<=")[^"]*\n[^"]*(?=")', lambda m: m.group(0).replace('\n', ' '), result)
    
    # Fix escaped quotes that should be double escaped
    result = re.sub(r'([^\\])\\([^\\"])', r'\1\\\\\2', result)
    
    # Replace literal \n, \t with actual newlines and tabs
    result = result.replace('\\n', '\n').replace('\\t', '\t')
    
    # Fix common JSON syntax issues
    # Fix missing quotes around property names
    result = re.sub(r'([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:', r'\1"\2":', result)
    
    # Fix single quotes used for strings instead of double quotes
    # First escape any existing double quotes inside single-quoted strings
    result = re.sub(r"'([^']*?\"[^']*?)'", lambda m: "'" + m.group(1).replace('"', '\\"') + "'", result)
    # Then replace single quotes with double quotes
    result = re.sub(r"'([^']*?)'", r'"\1"', result)
    
    # Fix Python's True/False/None to JSON true/false/null
    result = re.sub(r':\s*True\b', r': true', result)
    result = re.sub(r':\s*False\b', r': false', result)
    result = re.sub(r':\s*None\b', r': null', result)
    
    # Fix trailing commas in arrays and objects
    result = re.sub(r',\s*(\}|\])', r'\1', result)
    
    # Fix missing commas between properties
    result = re.sub(r'(\}|\]|"|true|false|null|\d)\s*("|\{|\[)', r'\1,\2', result)
    
    # Fix double commas
    result = re.sub(r',\s*,', r',', result)
    
    # Try to make sure all opening braces have closing braces
    if result.count('{') > result.count('}'):
        result += '}' * (result.count('{') - result.count('}'))
        
    if result.count('[') > result.count(']'):
        result += ']' * (result.count('[') - result.count(']'))
    
    return result

def repair_json_internal(json_str: str) -> str:
    """
    Internal implementation of JSON repair to fix broken JSON without external dependencies
    
    Args:
        json_str: The broken JSON string to repair
    
    Returns:
        Repaired JSON string
    """
    def strip_comments_and_whitespace(text):
        # Remove comments and normalize whitespace
        text = re.sub(r'//.*?$|/\*.*?\*/', '', text, flags=re.MULTILINE|re.DOTALL)
        return re.sub(r'\s+', ' ', text).strip()
    
    # Basic cleanup
    json_str = strip_comments_and_whitespace(json_str)
    
    # Try to find the start of the JSON object
    start_idx = json_str.find('{')
    if start_idx == -1:
        # No JSON object found, try array
        start_idx = json_str.find('[')
    
    if start_idx != -1:
        json_str = json_str[start_idx:]
    
    # Balance braces and brackets
    def balance_tokens(text, open_token, close_token):
        stack = []
        result = []
        
        for char in text:
            if char == open_token:
                stack.append(char)
                result.append(char)
            elif char == close_token:
                if stack and stack[-1] == open_token:
                    stack.pop()
                    result.append(char)
                # Skip extra close tokens
            else:
                result.append(char)
        
        # Add missing close tokens
        result.extend([close_token] * len(stack))
        return ''.join(result)
    
    # Balance braces first, then brackets
    json_str = balance_tokens(json_str, '{', '}')
    json_str = balance_tokens(json_str, '[', ']')
    
    # Fix property names without quotes
    def fix_property_names(match):
        return f'{match.group(1)}"{match.group(2)}":'
    
    json_str = re.sub(r'([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:', fix_property_names, json_str)
    
    # Fix trailing commas
    json_str = re.sub(r',(\s*[\]}])', r'\1', json_str)
    
    # Fix Python values to JSON values
    replacements = [
        (r':\s*True\b', r': true'),
        (r':\s*False\b', r': false'),
        (r':\s*None\b', r': null'),
        (r'\'([^\']*?)\'', r'"\1"'),  # Replace single quotes with double quotes
    ]
    
    for pattern, replacement in replacements:
        json_str = re.sub(pattern, replacement, json_str)
    
    # Last resort fixes
    json_str = re.sub(r',\s*,', ',', json_str)  # Remove duplicate commas
    json_str = re.sub(r'(\w+):', r'"\1":', json_str)  # Quote all remaining unquoted keys
    
    return json_str

def fix_json_recursively(json_str: str) -> Dict[str, Any]:
    """
    Attempt to fix and parse malformed JSON recursively
    
    Args:
        json_str: A string that may contain JSON
        
    Returns:
        Dict containing the parsed JSON or a fallback response
    """
    try:
        # Try to parse it directly first
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"Initial JSON error: {str(e)}")
        
        # Apply first-level fixes
        try:
            # Sanitize the JSON string
            sanitized = sanitize_json_string(json_str)
            
            # Try parsing the sanitized JSON
            return json.loads(sanitized)
        except json.JSONDecodeError as e:
            print(f"After sanitization error: {str(e)}")
            
            # Second-level fixes
            try:
                # Try to identify and fix common structural issues
                fixed_json = sanitized
                
                # Fix missing commas between array elements or object properties
                fixed_json = re.sub(r'(\d+|true|false|null|"[^"]*")\s+(\{|\[|")', r'\1,\2', fixed_json)
                
                # Fix trailing commas in arrays and objects
                fixed_json = re.sub(r',\s*(\}|\])', r'\1', fixed_json)
                
                # Add missing quotes around property names
                fixed_json = re.sub(r'([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:', r'\1"\2":', fixed_json)
                
                # Fix boolean values (Python's True/False to JSON true/false)
                fixed_json = re.sub(r':\s*True\b', r': true', fixed_json)
                fixed_json = re.sub(r':\s*False\b', r': false', fixed_json)
                
                # Fix None to null
                fixed_json = re.sub(r':\s*None\b', r': null', fixed_json)
                
                # Fix double commas
                fixed_json = re.sub(r',\s*,', r',', fixed_json)
                
                # Try to balance brackets if needed
                if fixed_json.count('{') > fixed_json.count('}'):
                    fixed_json += '}' * (fixed_json.count('{') - fixed_json.count('}'))
                elif fixed_json.count('[') > fixed_json.count(']'):
                    fixed_json += ']' * (fixed_json.count('[') - fixed_json.count(']'))
                
                print(f"Attempting to parse fixed JSON (length: {len(fixed_json)})")
                return json.loads(fixed_json)
                
            except json.JSONDecodeError as e:
                print(f"After structural fixes error: {str(e)}")
                
                # Last resort: Try our internal JSON repair
                try:
                    # Try to find any valid JSON object or array using our internal repair
                    print("Attempting to repair JSON with internal repair function")
                    repaired = repair_json_internal(sanitized)
                    return json.loads(repaired)
                    
                except json.JSONDecodeError as repair_error:
                    print(f"Internal JSON repair failed: {str(repair_error)}")
                    
                    # If all else fails, create a fallback response
                    return create_fallback_response("Could not parse malformed JSON from AI response")
                    
    except Exception as general_error:
        print(f"Unexpected error in JSON fixing: {str(general_error)}")
        return create_fallback_response(f"General error during JSON parsing: {str(general_error)}")

def create_fallback_response(error_message: str) -> Dict[str, Any]:
    """Create a fallback response when JSON parsing fails"""
    return {
        "match_score": 0,
        "feedback": f"Error: {error_message}. Please try again with a simpler resume or job description.",
        "skills_match": [],
        "improvement_areas": [
            "Unable to analyze your resume properly. Please try again with a cleaner PDF format.",
            "Consider using standard resume templates that are ATS-friendly.",
            "Simplify complex formatting like tables, columns, and text boxes which may interfere with analysis.",
            "Ensure your resume follows a clear structure with standard section headings.",
            "Try reducing the overall length of your resume if it exceeds 2-3 pages."
        ],
        # Default values for issue metrics
        "searchability_issues": 5,
        "hard_skills_issues": 3,
        "soft_skills_issues": 2,
        "recruiter_tips_issues": 4,
        "formatting_issues": 3,
        # Default values for keyword metrics
        "keywords_match_percentage": 10,
        "experience_level_percentage": 0,
        "skills_relevance_percentage": 5,
        # Default values for job title and industry insights
        "job_title": "Unknown Position",
        # Default ATS tips
        "ats_tips": [
            "Use standard fonts like Arial, Calibri, or Times New Roman for better ATS parsing",
            "Avoid tables, columns, and text boxes which can confuse ATS software",
            "Include exact keywords from the job description to improve your match score",
            "Use standard section headings like 'Experience', 'Education', and 'Skills'",
            "Save your resume as a text-based PDF for optimal compatibility"
        ],
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
                "passed": False,
                "details": [
                    "Use standard fonts like Arial, Calibri, or Times New Roman for best ATS compatibility",
                    "Keep font size between 10-12pt for body text",
                    "Use consistent font styling throughout your resume"
                ]
            },
            "layout_check": {
                "passed": False,
                "details": [
                    "Use a single-column layout for better ATS readability",
                    "Avoid tables, text boxes, and complex formatting",
                    "Use standard section headings like 'Experience' and 'Education'"
                ]
            },
            "page_setup_check": {
                "passed": False,
                "details": [
                    "Use standard margins (0.5-1 inch)",
                    "Save your resume as a PDF file",
                    "Keep your resume to 1-2 pages maximum"
                ]
            }
        },
        # Adding overall assessment section with multiple points
        "overall_assessment": [
            "Your resume contains formatting that may be challenging for ATS systems to parse correctly.",
            "The file format or content structure caused issues during automated analysis.",
            "Key sections may be missing or not clearly identified in your resume.",
            "Consider using a standard chronological or functional resume format.",
            "Ensure your contact information is clearly visible at the top of your resume."
        ]
    }

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
        9. Create a comprehensive overall assessment with 5 key observations about the resume
        
        RESUME:
        {resume_text}
        
        JOB DESCRIPTION:
        {job_description}
        
        THE RESPONSE MUST BE A VALID JSON OBJECT WITH NO SYNTAX ERRORS. 
        USE PROPER JSON FORMATTING WITH QUOTED KEYS, COMMAS BETWEEN KEY-VALUE PAIRS, AND TRUE/FALSE INSTEAD OF True/False.
        
        Respond with ONLY a JSON object in this exact format - DO NOT include markdown formatting like ```json:
        {{
            "match_score": <number 0-100>,
            "feedback": "<begin with a 2-sentence introduction summary followed by 4-6 specific detailed points as complete sentences>",
            "skills_match": ["<skill1>", "<skill2>", ...],
            "improvement_areas": ["<specific suggestion1>", "<specific suggestion2>", ...],
            "overall_assessment": [
                "<key observation 1 about the resume>",
                "<key observation 2 about the resume>",
                "<key observation 3 about the resume>",
                "<key observation 4 about the resume>",
                "<key observation 5 about the resume>"
            ],
            "searchability_issues": <number of issues 0-15>,
            "hard_skills_issues": <number of issues 0-15>,
            "soft_skills_issues": <number of issues 0-15>,
            "recruiter_tips_issues": <number of issues 0-15>,
            "formatting_issues": <number of issues 0-15>,
            "keywords_match_percentage": <number 0-100>,
            "experience_level_percentage": <number 0-100>,
            "skills_relevance_percentage": <number 0-100>,
            "job_title": "<extracted job title>",
            "ats_tips": [
                "<specific ATS optimization tip 1>",
                "<specific ATS optimization tip 2>",
                "<specific ATS optimization tip 3>",
                "<specific ATS optimization tip 4>",
                "<specific ATS optimization tip 5>"
            ],
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
        """

        # Generate the response with timeout
        response = await asyncio.wait_for(
            model.generate_content_async(prompt),
            timeout=45  # Increase to 45 second timeout to allow for web searches and detailed analysis
        )
        response_text = response.text

        # Extract JSON from response using our improved parser
        try:
            # First remove any markdown code block markers or non-JSON text
            cleaned_text = re.sub(r'```(json)?|```', '', response_text).strip()
            
            # Try to find where the JSON object starts
            json_start = cleaned_text.find('{')
            if json_start != -1:
                # Extract only the JSON part
                potential_json = cleaned_text[json_start:]
                # Find the last closing brace
                brace_count = 0
                json_end = -1
                for i, char in enumerate(potential_json):
                    if char == '{':
                        brace_count += 1
                    elif char == '}':
                        brace_count -= 1
                        if brace_count == 0:
                            json_end = i
                            break
                
                if json_end != -1:
                    json_str = potential_json[:json_end+1]
                    print(f"Extracted JSON: {json_str[:100]}...")  # Print first 100 chars for debugging
                    
                    # Try with json5 parser first - more forgiving of formatting errors
                    try:
                        result = json5.loads(json_str)
                    except Exception as json5_error:
                        print(f"JSON5 parsing error: {str(json5_error)}")
                        
                        # Fall back to our sanitization methods if json5 fails
                        sanitized = sanitize_json_string(json_str)
                        try:
                            result = json.loads(sanitized)
                        except json.JSONDecodeError:
                            # Last resort, use the recursive fix
                            result = fix_json_recursively(sanitized)
                else:
                    # Couldn't find proper JSON structure - try with json5
                    try:
                        result = json5.loads(cleaned_text)
                    except Exception:
                        # If json5 fails, fall back to recursive fix
                        result = fix_json_recursively(cleaned_text)
            else:
                # No opening brace found - try with json5
                try:
                    result = json5.loads(cleaned_text)
                except Exception:
                    # If json5 fails, fall back to our original approach
                    result = fix_json_recursively(cleaned_text)
                
        except Exception as parse_error:
            print(f"JSON parsing error: {str(parse_error)}")
            # Log full response for debugging
            print(f"Response text length: {len(response_text)}")
            print(f"Response text (first 1000 chars): {response_text[:1000]}...")
            
            # Last attempt with json5 on the entire text
            try:
                result = json5.loads(response_text)
            except Exception:
                result = create_fallback_response(f"Failed to parse AI response: {str(parse_error)}")

        # Ensure all required fields are present
        required_fields = [
            "match_score",
            "feedback",
            "skills_match",
            "improvement_areas",
            "overall_assessment",
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
            "ats_tips",
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
                elif field == "overall_assessment":
                    result[field] = [
                        "Your resume could benefit from better alignment with the target job description.",
                        "The format and structure of your resume may need improvement for ATS compatibility.",
                        "Your experience section could be enhanced with more quantifiable achievements.",
                        "Consider adding more relevant keywords from the job description.",
                        "The overall presentation could be improved for better readability by recruiters."
                    ]
                elif field == "ats_tips":
                    result[field] = [
                        "Use standard fonts like Arial, Calibri, or Times New Roman for better ATS parsing",
                        "Avoid tables, columns, and text boxes which can confuse ATS software",
                        "Include exact keywords from the job description to improve your match score",
                        "Use standard section headings like 'Experience', 'Education', and 'Skills'",
                        "Save your resume as a text-based PDF for optimal compatibility"
                    ]
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
        return create_fallback_response("Analysis timed out")
    except Exception as e:
        print(f"Error analyzing resume: {str(e)}")
        return create_fallback_response(str(e))
