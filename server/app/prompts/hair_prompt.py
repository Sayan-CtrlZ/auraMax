def build_hair_prompt(image_description: str, context: dict) -> str:
    """
    Constructs a prompt telling Gemini to analyze hair based on an image and context,
    matching the exact schema the Next.js hair page expects for BOTH care and styling modes.
    """
    mode = context.get("mode", "care") # "care" | "styling"
    
    if mode == "care":
        gender = context.get("gender", "Female")
        length = context.get("hairLength", "Medium")
        texture = context.get("texture", "Wavy")
        treatment = context.get("treatment", "Neither")
        concerns_list = context.get("concerns", [])
        water_type = context.get("waterType", "Hard water")
        gym = context.get("gym", False)
        
        return f"""You are a professional hair care specialist and trichologist AI.
Analyze the following description of a user's hair and scalp scan:
"{image_description}"

User Care Context:
- Gender: {gender}
- Length: {length}
- Texture: {texture}
- Chemical Treatment: {treatment}
- Primary Concerns: {", ".join(concerns_list)}
- Tap Water Type: {water_type}
- Exercises regularly: {gym}

Construct a 7-day calendar protocol and product list. For products, do NOT hallucinate specific brands. Instead, provide a description and a precise "search_query" (e.g. "pre-shampoo bond builder treatment India").
Return ONLY a valid JSON object matching the exact structure below. Do not wrap it in markdown code blocks like ```json or add any explanations outside the JSON.

JSON Schema:
{{
  "title": "{texture} Hair Care Protocol",
  "tips": [
    "Use lukewarm water when washing and cold water to rinse.",
    "Incorporate a clarifying wash weekly to remove product build up."
  ],
  "products": [
    {{
      "desc": "Weekly pre-shampoo bond builder to repair hair fibers.",
      "search_query": "pre-shampoo hair bond builder treatment India"
    }},
    {{
      "desc": "Apply to damp ends daily to lock in hydration.",
      "search_query": "hydrating argan oil hair serum India"
    }}
  ],
  "days": [
    {{
      "day": "Monday",
      "type": "Wash & Style",
      "activity": "Deep Cleanse",
      "details": "Use clarifying shampoo to reset scalp. Follow with hydrating mask."
    }},
    {{
      "day": "Tuesday",
      "type": "Rest",
      "activity": "Scalp Massage",
      "details": "Massage scalp for 3 minutes to stimulate blood flow. No product."
    }},
    {{
      "day": "Wednesday",
      "type": "Rest / Refresh",
      "activity": "Hydration Refresh",
      "details": "Lightly mist ends with leave-in conditioner spray."
    }},
    {{
      "day": "Thursday",
      "type": "Rest",
      "activity": "Protective Styling",
      "details": "Keep hair in loose braids or silk scrunchie."
    }},
    {{
      "day": "Friday",
      "type": "Wash & Style",
      "activity": "Standard Wash",
      "details": "Shampoo twice, condition mid-lengths to ends."
    }},
    {{
      "day": "Saturday",
      "type": "Rest",
      "activity": "Silk Wrap",
      "details": "Use a silk bonnet or pillowcase to prevent frizz overnight."
    }},
    {{
      "day": "Sunday",
      "type": "Scalp Care",
      "activity": "Pre-wash Oil",
      "details": "Apply hair strengthening oil to scalp. Wash off after 1-2 hours."
    }}
  ]
}}"""

    else:
        occasion = context.get("stylingOccasion", "Wedding / Formal")
        vibe = context.get("outfitVibe", "")
        length = context.get("stylingLength", "Medium")
        texture = context.get("stylingTexture", "Wavy")
        
        return f"""You are a professional hair stylist and fashion consultant AI.
Analyze the following description of the user's hair and styling context:
"{image_description}"

User Styling Context:
- Occasion: {occasion}
- Outfit Vibe: {vibe}
- Current Hair Length: {length}
- Current Hair Texture: {texture}

Recommend exactly 3 suitable hairstyles.
Return ONLY a valid JSON object matching the exact structure below. Do not wrap it in markdown code blocks like ```json or add any explanations outside the JSON.

JSON Schema:
{{
  "title": "{occasion} Lookbook",
  "desc": "Curated for {length.lower()}, {texture.lower()} hair to complement your outfit vibe.",
  "hairstyles": [
    {{
      "name": "Textured Crop",
      "desc": "Low maintenance, works beautifully with natural waves.",
      "search_reference": "textured crop haircut for wavy hair men"
    }},
    {{
      "name": "Slicked Back Elegance",
      "desc": "Clean and formal look to elevate the occasion.",
      "search_reference": "slicked back elegant formal hairstyle"
    }},
    {{
      "name": "Voluminous Blowout",
      "desc": "Embraces length and volume for a classic statement.",
      "search_reference": "voluminous blowout hairstyle for medium hair"
    }}
  ]
}}"""
