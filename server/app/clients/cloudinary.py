import cloudinary
from app.core.config import settings

# Configure Cloudinary globally
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)

# Export the configured cloudinary module to use its utilities (e.g., cloudinary.uploader)
cloudinary_instance = cloudinary
