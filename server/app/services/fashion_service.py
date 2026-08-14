import asyncio
import json
from app.prompts.fashion_prompt import build_fashion_prompt
from app.services.gemini_service import analyze_image
from app.services.groq_service import generate_text
from app.models.analyze import FashionOutfit, FashionPiece
from app.clients.search import run_parallel_searches
from app.services.validator_service import validate_products

async def process_outfit_pipeline(raw_outfit: dict, context: dict, delay: float) -> FashionOutfit:
    """
    Processes a single outfit: finds real products in parallel with Llama retry logic.
    Uses delay to stagger API calls.
    """
    await asyncio.sleep(delay)
    
    async def get_components():
        components = raw_outfit.get("components", [])
        
        async def process_component_with_retry(comp: dict, max_retries: int = 2):
            search_query = comp.get("search_query", f"fashion item for {comp.get('desc', 'outfit')}")
            current_query = search_query
            desc = comp.get('desc', 'Fashion Item')
            
            for attempt in range(max_retries + 1):
                print(f"[Outfit Tracker] 🔍 Searching SerpAPI for: '{current_query}' (Attempt {attempt + 1})")
                raw_products = await run_parallel_searches(current_query)
                
                print(f"[Outfit Tracker] 🤖 Validating {len(raw_products)} raw products for '{desc}'...")
                validated = await validate_products(current_query, raw_products, context, max_results=3)
                
                if validated:
                    print(f"[Outfit Tracker] ✅ Successfully found & validated {len(validated)} products for '{desc}'")
                    return FashionPiece(desc=desc, products=validated)
                    
                if attempt < max_retries:
                    print(f"[Outfit Tracker] ⚠️ No valid products for '{desc}'. Requesting fallback query from Groq...")
                    prompt = f"The search query '{current_query}' for fashion item '{desc}' returned no valid products. Provide a slightly broader or alternative search query. Return JSON format: {{\"new_query\": \"...\"}}"
                    response_dict = await asyncio.to_thread(generate_text, prompt)
                    current_query = response_dict.get("new_query", current_query)
                    print(f"[Outfit Tracker] 🔄 Retrying search with new query: {current_query}")
                    
            print(f"[Outfit Tracker] ❌ Failed to find products for '{desc}' after {max_retries} retries.")
            return FashionPiece(desc=desc, products=[])
            
        tasks = [process_component_with_retry(c) for c in components]
        pieces = await asyncio.gather(*tasks)
        return list(pieces)

    # Run product searches
    pieces = await get_components()
    
    return FashionOutfit(
        id=raw_outfit.get("id", 1),
        title=raw_outfit.get("title", "Outfit Concept"),
        image="",
        pieces=pieces
    )

async def analyze_fashion_stream(image_base64: str, context: dict):
    """
    Performs style analysis and yields outfits one by one as they complete.
    """
    prompt = build_fashion_prompt(
        image_description="User outfit and styling scan for body type, aesthetic, and color palette suggestions",
        context=context
    )
    
    # 1. Analyze the image to get the 4 outfit concepts
    print("\n[Pipeline] 🧠 Submitting image and context to Gemini for style curation...")
    outfits_list = await asyncio.to_thread(analyze_image, image_base64, prompt)
    print(f"[Pipeline] 🎯 Gemini Analysis complete.")
    
    if not isinstance(outfits_list, list):
        if isinstance(outfits_list, dict):
            if "error" in outfits_list:
                raise Exception(outfits_list["error"])
            elif "outfits" in outfits_list:
                outfits_list = outfits_list["outfits"]
            else:
                raise Exception("Fashion analysis response did not contain a valid outfits list.")
        else:
            raise Exception("Fashion analysis response did not contain a valid outfits list.")
            
    # 2. Kick off 4 parallel pipelines with a 0.5s stagger
    tasks = []
    for i, raw_outfit in enumerate(outfits_list):
        # 0.5 second stagger as requested in the architecture
        task = asyncio.create_task(process_outfit_pipeline(raw_outfit, context, delay=i * 0.5))
        tasks.append(task)
        
    # 3. Yield as they complete
    for completed_task in asyncio.as_completed(tasks):
        outfit = await completed_task
        yield outfit
