import asyncio
import json
from app.prompts.fashion_prompt import build_fashion_prompt
from app.services.bedrock_service import analyze_image
from app.services.image_service import generate_image
from app.models.analyze import FashionOutfit, FashionPiece
from app.clients.search import run_parallel_searches
from app.services.validator_service import validate_products

async def process_outfit_pipeline(raw_outfit: dict, context: dict, delay: float) -> FashionOutfit:
    """
    Processes a single outfit: generates the image and finds real products in parallel.
    Uses delay to stagger API calls.
    """
    await asyncio.sleep(delay)
    
    img_prompt = raw_outfit.get("image_generation_prompt", f"Fashion outfit: {raw_outfit.get('title')}")
    
    async def get_image():
        try:
            base64_img = await asyncio.to_thread(generate_image, img_prompt)
            return f"data:image/png;base64,{base64_img}"
        except Exception as e:
            print(f"Image generation failed: {e}")
            return "/product_placeholder.png"
            
    async def get_components():
        real_pieces = []
        components = raw_outfit.get("components", [])
        
        async def process_component(comp: dict):
            search_query = comp.get("search_query", f"fashion item for {comp.get('desc', 'outfit')}")
            raw_products = await run_parallel_searches(search_query)
            validated = await validate_products(search_query, raw_products, context, max_results=3)
            return FashionPiece(desc=comp.get("desc", "Fashion Item"), products=validated)
            
        tasks = [process_component(c) for c in components]
        pieces = await asyncio.gather(*tasks)
        return list(pieces)

    # Run image generation and product searches in parallel
    image_task = asyncio.create_task(get_image())
    components_task = asyncio.create_task(get_components())
    
    image_url, pieces = await asyncio.gather(image_task, components_task)
    
    return FashionOutfit(
        id=raw_outfit.get("id", 1),
        title=raw_outfit.get("title", "Outfit Concept"),
        image=image_url,
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
    outfits_list = await asyncio.to_thread(analyze_image, image_base64, prompt)
    
    if not isinstance(outfits_list, list):
        if isinstance(outfits_list, dict) and "outfits" in outfits_list:
            outfits_list = outfits_list["outfits"]
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
