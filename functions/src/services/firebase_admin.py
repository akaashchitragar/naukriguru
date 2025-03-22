import os
import firebase_admin
from firebase_admin import credentials, firestore, storage
from dotenv import load_dotenv # type: ignore

# Load environment variables
load_dotenv()

# Path to service account key file
service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY_PATH")

# Initialize Firebase Admin
try:
    # Initialize the app with a service account
    cred = credentials.Certificate(service_account_path)
    firebase_admin.initialize_app(cred, {"storageBucket": "naukri-guru.firebasestorage.app"})

    # Get Firestore client
    db = firestore.client()

    # Get Storage bucket
    bucket = storage.bucket()

    print("Firebase Admin SDK initialized successfully")
except Exception as e:
    print(f"Error initializing Firebase Admin SDK: {str(e)}")
    # Initialize with None values for graceful failure
    db = None
    bucket = None


def save_analysis_result(user_id, resume_id, analysis_result):
    """
    Save analysis result to Firestore

    Args:
        user_id: User ID
        resume_id: Resume ID
        analysis_result: Analysis result dictionary

    Returns:
        str: Document ID of the saved analysis
    """
    if not db:
        raise Exception("Firebase Firestore not initialized")

    # Create a reference to the analyses collection
    analyses_ref = db.collection("analyses")

    # Add the analysis result
    doc_ref = analyses_ref.add(
        {
            "user_id": user_id,
            "resume_id": resume_id,
            "result": analysis_result,
            "created_at": firestore.SERVER_TIMESTAMP,
        }
    )

    return doc_ref[1].id


def save_resume_file(user_id, file_name, file_content):
    """
    Save resume file to Firebase Storage

    Args:
        user_id: User ID
        file_name: Original file name
        file_content: File content bytes

    Returns:
        str: Public URL of the uploaded file
    """
    if not bucket:
        raise Exception("Firebase Storage not initialized")

    # Create a unique path for the file
    file_path = f"resumes/{user_id}/{file_name}"

    # Upload the file
    blob = bucket.blob(file_path)
    blob.upload_from_string(file_content, content_type="application/pdf")

    # Make the file publicly accessible
    blob.make_public()

    return blob.public_url
