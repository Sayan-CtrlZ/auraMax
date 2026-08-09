from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.models.auth import LoginRequest, SignupRequest, UserResponse
from app.services import auth_service
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])
security = HTTPBearer()

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def signup(body: SignupRequest):
    """
    Creates a new user profile inside Supabase Auth.
    """
    try:
        return auth_service.signup(
            email=str(body.email),
            password=body.password,
            full_name=body.full_name
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/login")
def login(body: LoginRequest):
    """
    Authenticates user credentials against Supabase.
    Returns access token and user identity information.
    """
    try:
        token, user_details = auth_service.login(
            email=str(body.email),
            password=body.password
        )
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": user_details
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/logout")
def logout(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    current_user = Depends(get_current_user)
):
    """
    Terminates the user's Supabase session. Requires JWT Bearer auth.
    """
    try:
        auth_service.logout(credentials.credentials)
        return {"message": "Successfully logged out of Supabase session."}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
