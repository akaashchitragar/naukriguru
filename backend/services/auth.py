from firebase_admin import auth
from fastapi import HTTPException, Depends, Header
from typing import Optional, Dict, Any


async def verify_token(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    """
    Verify Firebase ID token from Authorization header

    Args:
        authorization: Authorization header containing the token

    Returns:
        Dict containing user information

    Raises:
        HTTPException: If token is invalid or missing
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header is missing")

    try:
        # Extract token from Authorization header (Bearer token)
        if not authorization.startswith("Bearer "):
            raise HTTPException(
                status_code=401,
                detail="Invalid authorization format. Use 'Bearer {token}'",
            )

        token = authorization.split("Bearer ")[1]

        # Verify the token
        decoded_token = auth.verify_id_token(token)

        # Return user information
        return {
            "user_id": decoded_token["uid"],
            "email": decoded_token.get("email"),
            "name": decoded_token.get("name"),
            "picture": decoded_token.get("picture"),
        }

    except Exception as e:
        raise HTTPException(
            status_code=401, detail=f"Invalid authentication token: {str(e)}"
        )


def get_current_user(
    user_info: Dict[str, Any] = Depends(verify_token),
) -> Dict[str, Any]:
    """
    Dependency to get current authenticated user

    Args:
        user_info: User information from verified token

    Returns:
        Dict containing user information
    """
    return user_info
