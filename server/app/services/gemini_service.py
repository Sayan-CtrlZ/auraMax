import json
import base64
from fastapi import HTTPException, status
from google import genai
from google.genai import types
from app.core.config import settings

# Initialize Gemini Client
try:
    gemini_client = genai.Client(api_key=settings.GEMINI_API_KEY)
except Exception as e:
    gemini_client = None
    print(f"Failed to initialize Gemini client: {e}")

def analyze_image(image_base64: str, prompt: str) -> dict:
    """
    Sends the base64 image along with the prompt to Gemini (gemini-3.6-flash).
    """
    if not gemini_client:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Gemini client is not configured properly."
        )

    if "," in image_base64:
        image_base64 = image_base64.split(",")[1]

    # Decode base64 to bytes
    image_bytes = base64.b64decode(image_base64)

    try:
        response = gemini_client.models.generate_content(
            model='gemini-3.6-flash',
            contents=[
                types.Part.from_bytes(data=image_bytes, mime_type='image/jpeg'),
                prompt
            ],
            config=types.GenerateContentConfig(
                temperature=0.0,
                response_mime_type="application/json"
            )
        )
        response_text = response.text
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Gemini Vision API call failed: {str(e)}"
        )

    try:
        return json.loads(response_text)
    except json.JSONDecodeError as e:
        if "```json" in response_text:
            cleaned_text = response_text.split("```json")[1].split("```")[0].strip()
            return json.loads(cleaned_text)
        
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "message": "Failed to parse Gemini JSON response",
                "error": str(e),
                "raw_response": response_text
            }
        )


