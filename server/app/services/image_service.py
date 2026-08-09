import base64
from io import BytesIO
from fastapi import UploadFile, HTTPException, status
import cloudinary.uploader
# Importing cloudinary_instance executes config check side effect
from app.clients.cloudinary import cloudinary_instance
from app.clients.huggingface import hf_client
from app.models.image import ImageUploadResponse

def upload_image(file: UploadFile) -> ImageUploadResponse:
    """
    Reads an uploaded file and uploads it to Cloudinary.
    Returns the secure URL and public ID of the uploaded asset.
    """
    try:
        # Pass the upload file handle directly to Cloudinary's uploader
        result = cloudinary.uploader.upload(
            file.file,
            folder="auramax_selfies"
        )
        
        secure_url = result.get("secure_url")
        public_id = result.get("public_id")
        
        if not secure_url or not public_id:
            raise Exception("Cloudinary did not return valid upload details.")
            
        return ImageUploadResponse(url=secure_url, public_id=public_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Cloudinary upload failed: {str(e)}"
        )


def generate_image(prompt: str) -> str:
    """
    Calls HuggingFace Inference API to generate an outfit/look image using FLUX.1-schnell.
    Converts the resulting PIL Image into a base64 encoded string and returns it.
    """
    try:
        # Call FLUX.1-schnell model via InferenceClient
        image = hf_client.text_to_image(
            prompt,
            model="black-forest-labs/FLUX.1-schnell"
        )
        
        # Convert PIL Image to BytesIO and encode to base64
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        img_bytes = buffered.getvalue()
        base64_str = base64.b64encode(img_bytes).decode("utf-8")
        
        return base64_str
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Image generation failed via Hugging Face FLUX API: {str(e)}"
        )
