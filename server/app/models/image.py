from pydantic import BaseModel

class ImageUploadResponse(BaseModel):
    url: str
    public_id: str

class GenerateImageRequest(BaseModel):
    prompt: str
