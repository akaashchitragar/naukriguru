# Naukri Guru - Setup Guide

This guide will help you set up and run the Naukri Guru prototype locally.

## Prerequisites

- Node.js 18.x or higher
- Python 3.9 or higher
- pnpm package manager

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
- On Windows:
```bash
venv\Scripts\activate
```
- On macOS/Linux:
```bash
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Run the backend server:
```bash
uvicorn main:app --reload
```

The backend server will start at http://localhost:8000

### 2. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

The frontend will be available at http://localhost:3000

## Using the Application

1. Open your browser and go to http://localhost:3000
2. Upload your resume (PDF format)
3. Enter a job description
4. Click "Analyze Resume" to get the analysis results

## Project Structure

```
├── frontend/               # Next.js frontend
│   ├── app/                # Next.js app router
│   ├── components/         # React components
│   ├── lib/                # Utility functions
│   └── styles/             # Global styles
├── backend/                # FastAPI backend
│   ├── services/           # Business logic
│   └── main.py             # Main application
```

## API Endpoints

- `GET /`: Welcome message
- `POST /analyze`: Analyze a resume against a job description
  - Parameters:
    - `resume`: PDF file
    - `job_description`: String

## Troubleshooting

- If you encounter CORS issues, make sure both frontend and backend are running
- If the PDF parsing fails, ensure the PDF is not password-protected
- If the Gemini API fails, check your API key in the `.env` file 