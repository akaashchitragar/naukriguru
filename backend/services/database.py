from typing import Dict, Any, Optional, List
from datetime import datetime
from firebase_admin import firestore
from .firebase_admin import db


class FirestoreDB:
    @staticmethod
    def create_user(user_id: str, data: Dict[str, Any]) -> bool:
        """
        Create a new user document in Firestore
        """
        try:
            user_ref = db.collection("users").document(user_id)
            user_ref.set(
                {
                    **data,
                    "created_at": firestore.SERVER_TIMESTAMP,
                    "updated_at": firestore.SERVER_TIMESTAMP,
                }
            )
            return True
        except Exception as e:
            print(f"Error creating user: {str(e)}")
            return False

    @staticmethod
    def create_resume(user_id: str, data: Dict[str, Any]) -> Optional[str]:
        """
        Create a new resume document in Firestore
        """
        try:
            resume_ref = db.collection("resumes").document()
            resume_data = {
                "user_id": user_id,
                "file_url": data.get("file_url"),
                "file_name": data.get("file_name"),
                "created_at": firestore.SERVER_TIMESTAMP,
                "updated_at": firestore.SERVER_TIMESTAMP,
                "status": "active",
            }
            resume_ref.set(resume_data)
            return resume_ref.id
        except Exception as e:
            print(f"Error creating resume: {str(e)}")
            return None

    @staticmethod
    def create_analysis(
        user_id: str, resume_id: str, data: Dict[str, Any]
    ) -> Optional[str]:
        """
        Create a new analysis document in Firestore
        """
        try:
            analysis_ref = db.collection("analyses").document()
            analysis_data = {
                "user_id": user_id,
                "resume_id": resume_id,
                "job_description": data.get("job_description"),
                "match_score": data.get("match_score"),
                "feedback": data.get("feedback"),
                "skills_match": data.get("skills_match", []),
                "improvement_areas": data.get("improvement_areas", []),
                "created_at": firestore.SERVER_TIMESTAMP,
            }
            analysis_ref.set(analysis_data)
            return analysis_ref.id
        except Exception as e:
            print(f"Error creating analysis: {str(e)}")
            return None

    @staticmethod
    def get_user_analyses(user_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Get all analyses for a user
        """
        try:
            analyses = []
            query = (
                db.collection("analyses")
                .where("user_id", "==", user_id)
                .order_by("created_at", direction=firestore.Query.DESCENDING)
                .limit(limit)
            )

            docs = query.stream()
            for doc in docs:
                analysis = doc.to_dict()
                analysis["id"] = doc.id
                analyses.append(analysis)

            return analyses
        except Exception as e:
            print(f"Error getting user analyses: {str(e)}")
            return []

    @staticmethod
    def get_user_resumes(user_id: str) -> List[Dict[str, Any]]:
        """
        Get all resumes for a user
        """
        try:
            resumes = []
            query = (
                db.collection("resumes")
                .where("user_id", "==", user_id)
                .where("status", "==", "active")
                .order_by("created_at", direction=firestore.Query.DESCENDING)
            )

            docs = query.stream()
            for doc in docs:
                resume = doc.to_dict()
                resume["id"] = doc.id
                resumes.append(resume)

            return resumes
        except Exception as e:
            print(f"Error getting user resumes: {str(e)}")
            return []

    @staticmethod
    def delete_resume(user_id: str, resume_id: str) -> bool:
        """
        Delete a resume (soft delete by updating status)
        """
        try:
            # Get the resume document
            resume_ref = db.collection("resumes").document(resume_id)
            resume = resume_ref.get()
            
            # Check if resume exists and belongs to the user
            if not resume.exists:
                print(f"Resume {resume_id} not found")
                return False
                
            resume_data = resume.to_dict()
            if resume_data.get("user_id") != user_id:
                print(f"Resume {resume_id} does not belong to user {user_id}")
                return False
            
            # Soft delete by updating status
            resume_ref.update({
                "status": "deleted",
                "updated_at": firestore.SERVER_TIMESTAMP
            })
            
            return True
        except Exception as e:
            print(f"Error deleting resume: {str(e)}")
            return False
