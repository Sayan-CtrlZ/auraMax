from typing import Union
from app.prompts.hair_prompt import build_hair_prompt
from app.services.gemini_service import analyze_image
from app.models.analyze import HairCareResult, HairStylingResult
from app.clients.search import run_parallel_searches
from app.services.validator_service import validate_products
import asyncio

async def analyze_hair(image_base64: str, context: dict) -> Union[HairCareResult, HairStylingResult]:
    """
    Performs hair care or styling analysis.
    For care mode, fetches live products using Serper/SerpAPI and validates via Gemini.
    """
    prompt = build_hair_prompt(
        image_description="Hair and scalp scan for hair type, health index, concerns, and lookbook styling",
        context=context
    )
    
    # Analyze the image in a separate thread
    result_dict = await asyncio.to_thread(analyze_image, image_base64, prompt)
    
    mode = context.get("mode", "care")
    if mode == "care":
        products = result_dict.get("products", [])
        
        async def process_product(prod: dict):
            search_query = prod.pop("search_query", f"haircare product for {prod.get('desc', 'routine')}")
            # Fetch raw products
            raw_products = await run_parallel_searches(search_query)
            # Validate
            validated = await validate_products(search_query, raw_products, context, max_results=3)
            # Assign
            return {
                "desc": prod.get("desc", ""),
                "products": validated
            }
            
        # Run all product searches concurrently
        tasks = [process_product(p) for p in products]
        real_products = await asyncio.gather(*tasks)
        
        result_dict["products"] = list(real_products)
        return HairCareResult(**result_dict)
    else:
        return HairStylingResult(**result_dict)
