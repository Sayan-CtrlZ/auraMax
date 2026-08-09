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

Analyze the skin, determine the sub-metrics (hydration, barrier, elasticity, clarity), calculate an approximate skin age, list primary identified concerns, and compile a solid morning and evening routine. For the routine, output a step name, brief description of use, and a precise "search_query" to find real products for that step. For example: "gentle salicylic acid face wash for oily skin India".

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
        "desc": "Non-stripping milk wash with ceramides to preserve barrier lipids.",
        "search_query": "hydrating ceramide milk cleanser India"
      }},
      {{
        "step": "Protect",
        "desc": "Zinc oxide barrier to prevent UV pigmentation and aging.",
        "search_query": "mineral sunscreen spf 50 zinc oxide India"
      }}
    ],
    "evening": [
      {{
        "step": "Treat",
        "desc": "Encourages cell turnover and smooths outer texture overnight.",
        "search_query": "anti-aging retinol serum India"
      }}
    ]
  }}
}}"""
