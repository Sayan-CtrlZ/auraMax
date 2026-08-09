from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.db.firebase import auth

# Use HTTPBearer with auto_error=False so we can raise 401 instead of 403 on missing token
security = HTTPBearer(auto_error=False)

class CurrentUser:
    def __init__(self, uid: str, email: str):
        self.id = uid
        self.email = email

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header with Bearer token is missing"
        )
    
    token = credentials.credentials
    
    try:
        # Verify Firebase JWT token
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token.get("uid")
        email = decoded_token.get("email", "")
        
        if not uid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token payload"
            )
            
        return CurrentUser(uid=uid, email=email)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}"
        )
