from app.prompts.skincare_prompt import build_skincare_prompt
from app.services.bedrock_service import analyze_image
from app.models.analyze import SkincareResult
from app.clients.search import run_parallel_searches
from app.services.validator_service import validate_products
import asyncio

async def analyze_skincare(image_base64: str, context: dict) -> SkincareResult:
    """
    Performs skincare analysis by sending the image and constructed prompt to Gemini,
    fetches live real products using Serper/SerpAPI, validates them through Gemini,
    and returns the final result.
    """
    prompt = build_skincare_prompt(
        image_description="Facial skin scan for analysis of type, concerns, and routine formulation",
        context=context
    )
    
    # Analyze the image using blocking Gemini API in a separate thread to not block event loop
    result_dict = await asyncio.to_thread(analyze_image, image_base64, prompt)
    
    # Loop through routines, fire off searches, and validate
    for time_of_day in ["morning", "evening"]:
        if time_of_day in result_dict.get("routine", {}):
            for step in result_dict["routine"][time_of_day]:
                search_query = step.pop("search_query", f"skincare product for {step.get('step', 'routine')}")
                
                # 1. Fetch raw products from APIs
                raw_products = await run_parallel_searches(search_query)
                
                # 2. Validate products with Gemini
                validated = await validate_products(search_query, raw_products, context, max_results=3)
                
                # Assign validated products
                step["products"] = validated
    
    # Parse and validate the updated response dictionary
    return SkincareResult(**result_dict)
