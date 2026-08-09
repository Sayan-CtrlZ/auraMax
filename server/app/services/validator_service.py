import json
import asyncio
from app.services.bedrock_service import generate_text

async def validate_products(query: str, raw_products: list[dict], context: dict, max_results: int = 4) -> list[dict]:
    """
    Takes a search query, a list of raw products from search APIs, and the user's context.
    Passes them to AWS Bedrock to filter out irrelevant or bad products, returning only the top matches.
    """
    if not raw_products:
        return []
        
    budget = context.get("budget", "Any")
    
    prompt = f"""You are an expert personal shopper and product validator.
The user is looking for a product matching this query: "{query}"
The user's budget context is: "{budget}"

Here are the raw search results we found online:
{json.dumps(raw_products, indent=2)}

Your job is to act as a quality filter. Review each product:
1. Does it genuinely match the requested item query?
2. Is it within a reasonable price range for the user's budget?
3. Does the title look like a legitimate product (not a random accessory or sponsored spam)?

Return the top {max_results} best matches. DO NOT change the original names, links, thumbnails, or prices. Just select the best objects and return them exactly as they are.

Return ONLY a valid JSON object with a single key "products" containing the array of matches. Do not wrap it in markdown code blocks or add any explanations outside the JSON.

JSON Schema:
{{
  "products": [
    {{
      "name": "Original Product Name",
      "price": "₹1,200",
      "source": "Amazon India",
      "link": "https://...",
      "thumbnail": "https://..."
    }}
  ]
}}
"""

    try:
        response_dict = await asyncio.to_thread(generate_text, prompt)
        validated_products = response_dict.get("products", [])
        
        # Ensure it's a list
        if not isinstance(validated_products, list):
            validated_products = []
            
        return validated_products[:max_results]
    except Exception as e:
        print(f"Validation failed: {e}")
        # Fallback to the first few raw products if Groq fails
        return raw_products[:max_results]
