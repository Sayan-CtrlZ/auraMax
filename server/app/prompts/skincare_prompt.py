def build_skincare_prompt(image_description: str, context: dict) -> str:
    """
    Constructs a prompt telling Gemini to analyze skin based on an image and context,
    matching the exact schema the Next.js skincare dashboard expects.
    """
    skin_type = context.get("skinType", "dry")
    concern = context.get("concern", "dullness")
    
    return f"""You are a professional dermatologist and skincare expert AI.
Analyze the following description of a user's facial scan:
"{image_description}"

User Preferences Context:
- Skin Type: {skin_type}
- Primary Concern: {concern}

Analyze the skin, determine the sub-metrics (hydration, barrier, elasticity, clarity), calculate an approximate skin age, list primary identified concerns, and compile a solid morning and evening routine. 

CRITICAL INSTRUCTIONS FOR LANGUAGE:
1. For "concernsIdentified" (pathology), use VERY SIMPLE, easy-to-understand English. Avoid complicated medical or pathological jargon. (e.g. say "Dry patches on cheeks" instead of "Desquamation and compromised lipid barrier").
2. For the routine "desc", you MUST be highly detailed and comprehensive (2-3 sentences minimum per step). Explain EXACTLY what the product does, the precise application technique (e.g., "Massage into damp skin for 60 seconds", "Wait 2 minutes before the next step"), and exactly WHY it helps their specific concern. Do not write short descriptions.
3. For "search_query", provide a precise search string to find real products (e.g. "gentle salicylic acid face wash for oily skin India").

Return ONLY a valid JSON object matching the exact structure below. Do not wrap it in markdown code blocks like ```json or add any explanations outside the JSON object.

JSON Schema:
{{
  "score": 85,
  "skinAge": 25,
  "metrics": {{
    "hydration": 75,
    "barrier": 80,
    "elasticity": 85,
    "clarity": 70
  }},
  "concernsIdentified": ["Mild dehydration detected across the forehead", "Slight uneven texture and dullness near cheek planes"],
  "routine": {{
    "morning": [
      {{
        "step": "Cleanse",
        "desc": "Start with a non-stripping milk wash packed with ceramides to preserve your natural barrier lipids. Massage a dime-sized amount gently into damp skin for 60 seconds to effectively dissolve impurities without causing dryness. Rinse with lukewarm water and pat dry with a clean towel.",
        "search_query": "hydrating ceramide milk cleanser India"
      }},
      {{
        "step": "Protect",
        "desc": "Finish with a robust Zinc Oxide barrier to prevent UV pigmentation and guard against premature aging. Apply two finger-lengths generously across your face and neck as the absolute final step. Let it set for 5 minutes before applying any makeup to ensure an even protective film.",
        "search_query": "mineral sunscreen spf 50 zinc oxide India"
      }}
    ],
    "evening": [
      {{
        "step": "Treat",
        "desc": "Use this active serum to encourage cell turnover and smooth out your surface texture overnight. Apply 3-4 drops evenly over dry skin, carefully avoiding the immediate eye area. Wait approximately 2 to 3 minutes for it to fully absorb before layering your night cream to prevent irritation.",
        "search_query": "anti-aging retinol serum India"
      }}
    ]
  }}
}}"""
