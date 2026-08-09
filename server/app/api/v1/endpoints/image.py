from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from app.models.image import ImageUploadResponse, GenerateImageRequest
from app.services import image_service
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/image", tags=["Image Services"])

@router.post("/upload", response_model=ImageUploadResponse)
def upload_image(
    file: UploadFile = File(...),
    current_user = Depends(get_current_user)
):
    """
    Uploads a user photo to Cloudinary. Requires authorization.
    """
    try:
        return image_service.upload_image(file)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/generate")
def generate_image(
    body: GenerateImageRequest,
    current_user = Depends(get_current_user)
):
    """
    Generates lookbook images via Hugging Face FLUX.1-schnell model. Requires authorization.
    """
    try:
        base64_img = image_service.generate_image(body.prompt)
        return {
            "image_base64": base64_img
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
