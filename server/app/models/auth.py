from pydantic import BaseModel, EmailStr

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: str

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "usr_9f83a2bc8d",
                "email": "user@example.com",
                "full_name": "Jane Doe"
            }
        }
