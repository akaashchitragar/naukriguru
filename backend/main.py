import os
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv  # type: ignore
import google.generativeai as genai  # type: ignore
from services.pdf_parser import extract_text_from_pdf
from services.resume_analyzer import analyze_resume_with_gemini
from services.firebase_admin import save_resume_file
from services.database import FirestoreDB
from services.auth import get_current_user
from typing import Dict, Any, Optional
import uvicorn

# Load environment variables
load_dotenv()

# Configure Google Gemini API
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY environment variable is not set")

genai.configure(api_key=GOOGLE_API_KEY)

# Create FastAPI app
app = FastAPI(
    title="Naukri Guru API",
    description="API for Naukri Guru resume analysis service",
    version="0.1.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://192.168.29.115:3000", "http://192.168.29.115:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def welcome():
    return {"message": "Welcome to Naukri Guru API"}


@app.post("/analyze")
async def analyze_resume_endpoint(
    file: UploadFile = File(...),
    job_description: str = Form(...),
    user_info: Dict[str, Any] = Depends(get_current_user),
):
    try:
        user_id = user_info["user_id"]

        # Read and save the PDF file
        file_content = await file.read()
        file_url = save_resume_file(user_id, file.filename, file_content)

        # Create resume record
        resume_data = {"file_url": file_url, "file_name": file.filename}
        resume_id = FirestoreDB.create_resume(user_id, resume_data)

        if not resume_id:
            raise HTTPException(status_code=500, detail="Failed to save resume")

        # Extract text from PDF
        resume_text = extract_text_from_pdf(file_content)

        # Analyze resume
        analysis_result = await analyze_resume_with_gemini(resume_text, job_description)

        # Save analysis result
        analysis_data = {"job_description": job_description, **analysis_result}
        analysis_id = FirestoreDB.create_analysis(user_id, resume_id, analysis_data)

        if not analysis_id:
            raise HTTPException(status_code=500, detail="Failed to save analysis")

        return {
            "resume_id": resume_id,
            "analysis_id": analysis_id,
            "result": analysis_result,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/users/me/analyses")
async def get_my_analyses(
    limit: int = 10, user_info: Dict[str, Any] = Depends(get_current_user)
):
    try:
        user_id = user_info["user_id"]
        analyses = FirestoreDB.get_user_analyses(user_id, limit)
        return {"analyses": analyses}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/users/me/resumes")
async def get_my_resumes(user_info: Dict[str, Any] = Depends(get_current_user)):
    try:
        user_id = user_info["user_id"]
        resumes = FirestoreDB.get_user_resumes(user_id)
        return {"resumes": resumes}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# For development/testing - will be removed in production
@app.post("/analyze-dev")
async def analyze_resume_dev(
    file: UploadFile = File(...),
    job_description: str = Form(...),
    user_id: str = Form(...),
):
    """Development endpoint without authentication for testing"""
    try:
        # Read and save the PDF file
        file_content = await file.read()
        file_url = save_resume_file(user_id, file.filename, file_content)

        # Create resume record
        resume_data = {"file_url": file_url, "file_name": file.filename}
        resume_id = FirestoreDB.create_resume(user_id, resume_data)

        if not resume_id:
            raise HTTPException(status_code=500, detail="Failed to save resume")

        # Extract text from PDF
        resume_text = extract_text_from_pdf(file_content)

        # Analyze resume
        analysis_result = await analyze_resume_with_gemini(resume_text, job_description)

        # Save analysis result
        analysis_data = {"job_description": job_description, **analysis_result}
        analysis_id = FirestoreDB.create_analysis(user_id, resume_id, analysis_data)

        if not analysis_id:
            raise HTTPException(status_code=500, detail="Failed to save analysis")

        return {
            "resume_id": resume_id,
            "analysis_id": analysis_id,
            "result": analysis_result,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
