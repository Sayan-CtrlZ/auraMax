import httpx
from app.models.auth import UserResponse
from app.core.config import settings
from app.db.firebase import auth

def signup(email: str, password: str, full_name: str) -> UserResponse:
    """
    Registers a new user in Firebase Auth using the Admin SDK.
    Stores the full_name in the user's display_name.
    """
    try:
        user = auth.create_user(
            email=email,
            password=password,
            display_name=full_name
        )
        return UserResponse(
            id=user.uid,
            email=user.email,
            full_name=user.display_name or full_name
        )
    except Exception as e:
        raise Exception(f"Registration failed: {str(e)}")


def login(email: str, password: str) -> tuple[str, UserResponse]:
    """
    Authenticates a user against Firebase using the Identity Toolkit REST API.
    Returns a tuple containing: (id_token: str, user_details: UserResponse)
    """
    if not settings.FIREBASE_WEB_API_KEY:
        raise Exception("FIREBASE_WEB_API_KEY is not set. Cannot perform REST login.")
        
    try:
        url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={settings.FIREBASE_WEB_API_KEY}"
        payload = {
            "email": email,
            "password": password,
            "returnSecureToken": True
        }
        
        # This is a blocking HTTP call, which is fine for this service module 
        # (FastAPI endpoints run in threadpool if not async)
        with httpx.Client() as client:
            response = client.post(url, json=payload)
            response.raise_for_status()
            data = response.json()
            
            id_token = data.get("idToken")
            local_id = data.get("localId")
            
            # Fetch user details using admin SDK
            user_record = auth.get_user(local_id)
            
            user_response = UserResponse(
                id=user_record.uid,
                email=user_record.email,
                full_name=user_record.display_name or "Aura User"
            )
            
            return id_token, user_response
    except httpx.HTTPStatusError as e:
        error_message = e.response.json().get("error", {}).get("message", "Unknown Error")
        raise Exception(f"Login failed: {error_message}")
    except Exception as e:
        raise Exception(f"Login failed: {str(e)}")


def logout(token: str) -> None:
    """
    In Firebase, logout is typically handled client-side.
    Revoking refresh tokens server-side logs the user out from all devices.
    """
    try:
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token.get("uid")
        if uid:
            auth.revoke_refresh_tokens(uid)
    except Exception as e:
        raise Exception(f"Logout failed: {str(e)}")
