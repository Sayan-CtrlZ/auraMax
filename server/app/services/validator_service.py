import json
import asyncio
from app.services.groq_service import generate_text

async def validate_products(query: str, raw_products: list[dict], context: dict, max_results: int = 4) -> list[dict]:
    """
    Takes a search query and a list of raw products from search APIs.
    Bypasses expensive LLM validation for speed and simply returns the top matches directly.
    """
    if not raw_products:
        return []
        
    # Skip LLM validation to prevent massive API rate limits and drastically speed up the pipeline
    return raw_products[:max_results]
