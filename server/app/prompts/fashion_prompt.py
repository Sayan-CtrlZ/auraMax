def build_fashion_prompt(image_description: str, context: dict) -> str:
    """
    Constructs a prompt telling Gemini to analyze fashion/style based on an image and context,
    matching the exact schema the Next.js fashion lookbook expects.
    """
    occasion = context.get("occasion", "Casual day out")
    weather = context.get("weather", "Mild")
    mood = context.get("mood", "Minimal & clean")
    budget = context.get("budget", "No limit")
    extra_context = context.get("extraContext", "")

    return f"""You are a professional fashion stylist and image consultant AI.
Analyze the following description of a user's look:
"{image_description}"

User Preferences Context:
- Occasion: {occasion}
- Weather: {weather}
- Style Vibe / Mood: {mood}
- Target Budget: {budget}
- Extra Notes: {extra_context}

Create exactly 4 outfit concept recommendations tailored for this user. For each outfit recommendation, provide:
1. An outfit ID (1, 2, 3, 4).
2. A descriptive, stylish title (e.g. "Pre-Draped Georgette Saree", "Indo-Western Co-Ord Set").
3. A detailed descriptive prompt for outfit image generation (which we will pass to a text-to-image AI).
4. Up to 4 specific outfit components. For each component, provide a brief description and a precise "search_query" (e.g. "beige oversized linen blazer women") to find the item in online stores.

Return ONLY a valid JSON array matching the exact structure below. Do not wrap it in markdown code blocks like ```json or add any explanations outside the JSON.

JSON Schema:
[
  {{
    "id": 1,
    "title": "Minimalist Silk Slip Dress",
    "image_generation_prompt": "A minimalist silk slip dress in deep emerald green, styled with delicate gold jewelry on a clean studio background, studio lighting",
    "components": [
      {{
        "desc": "Emerald Silk Slip Dress",
        "search_query": "emerald green silk slip dress"
      }},
      {{
        "desc": "Minimalist Gold Chain",
        "search_query": "minimalist gold chain necklace"
      }}
    ]
  }},
  {{
    "id": 2,
    "title": "Casual Oversized Blazer Look",
    "image_generation_prompt": "A modern tailored beige oversized linen blazer paired with white denim and beige mules, crisp warm studio setup",
    "components": [
      {{
        "desc": "Beige Linen Blazer",
        "search_query": "beige linen oversized blazer"
      }},
      {{
        "desc": "Straight Leg White Denim",
        "search_query": "straight leg white denim jeans"
      }}
    ]
  }}
]"""
