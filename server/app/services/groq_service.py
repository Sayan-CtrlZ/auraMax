import json
from fastapi import HTTPException, status
from groq import Groq
from app.core.config import settings

groq_client = None
if settings.GROQ_API_KEY:
    try:
        groq_client = Groq(api_key=settings.GROQ_API_KEY)
    except Exception as e:
        print(f"Failed to initialize Groq client: {e}")

def generate_text(prompt: str) -> dict:
    """
    Sends a text prompt to Llama 3 via Groq for JSON extraction.
    """
    if not groq_client:
        print("Groq client not initialized")
        return {}

    try:
        completion = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant. Always output your response in valid JSON format."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.0,
            response_format={"type": "json_object"}
        )
        response_text = completion.choices[0].message.content
        
        try:
            return json.loads(response_text)
        except json.JSONDecodeError:
            if "```json" in response_text:
                cleaned_text = response_text.split("```json")[1].split("```")[0].strip()
                return json.loads(cleaned_text)
            return json.loads(response_text)
            
    except Exception as e:
        print(f"Groq generate_text error: {e}")
        return {}
