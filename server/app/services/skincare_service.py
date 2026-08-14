from app.prompts.skincare_prompt import build_skincare_prompt
from app.services.gemini_service import analyze_image
from app.services.groq_service import generate_text
from app.models.analyze import SkincareResult
from app.clients.search import run_parallel_searches
from app.services.validator_service import validate_products
import asyncio

async def process_step_with_retry(step: dict, context: dict, max_retries: int = 2):
    search_query = step.pop("search_query", f"skincare product for {step.get('step', 'routine')}")
    current_query = search_query
    
    for attempt in range(max_retries + 1):
        raw_products = await run_parallel_searches(current_query)
        validated = await validate_products(current_query, raw_products, context, max_results=3)
        
        if validated:
            step["products"] = validated
            return
            
        if attempt < max_retries:
            prompt = f"The search query '{current_query}' for skincare step '{step.get('step')}' returned no valid products. Provide a slightly broader or alternative search query. Return JSON format: {{\"new_query\": \"...\"}}"
            response_dict = await asyncio.to_thread(generate_text, prompt)
            current_query = response_dict.get("new_query", current_query)
            print(f"Retrying search with new query: {current_query}")
            
    step["products"] = []

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
    
    # Run all steps in parallel with retry logic
    tasks = []
    for time_of_day in ["morning", "evening"]:
        if time_of_day in result_dict.get("routine", {}):
            for step in result_dict["routine"][time_of_day]:
                tasks.append(process_step_with_retry(step, context))
                
    await asyncio.gather(*tasks)
    
    # Parse and validate the updated response dictionary
    return SkincareResult(**result_dict)
