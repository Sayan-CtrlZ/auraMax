from huggingface_hub import InferenceClient
from app.core.config import settings

# Initialize Hugging Face Inference API client
hf_client = InferenceClient(token=settings.HUGGINGFACE_API_KEY)
