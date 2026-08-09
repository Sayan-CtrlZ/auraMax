from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class AnalyzeRequest(BaseModel):
    image_base64: str = Field(..., description="Base64 encoded string of the uploaded image")
    type: str = Field(..., description="Category of analysis: skincare, fashion, or hair")
    context: Dict[str, Any] = Field(default_factory=dict, description="Metadata and form choices from the frontend wizard")

# ── SHARED MODELS ───────────────────────────────────────────────────────────────
class ValidatedProduct(BaseModel):
    name: str
    price: str
    source: str
    link: str
    thumbnail: str

# ── SKINCARE MODELS ───────────────────────────────────────────────────────────
class SkincareRoutineItem(BaseModel):
    step: str
    desc: str
    products: List[ValidatedProduct]

class SkincareRoutine(BaseModel):
    morning: List[SkincareRoutineItem]
    evening: List[SkincareRoutineItem]

class SkincareMetrics(BaseModel):
    hydration: int
    barrier: int
    elasticity: int
    clarity: int

class SkincareResult(BaseModel):
    score: int
    skinAge: int
    metrics: SkincareMetrics
    concernsIdentified: List[str]
    routine: SkincareRoutine

# ── FASHION MODELS ────────────────────────────────────────────────────────────
class FashionPiece(BaseModel):
    desc: str
    products: List[ValidatedProduct]

class FashionOutfit(BaseModel):
    id: int
    title: str
    image: str
    pieces: List[FashionPiece]

# ── HAIR CARE MODELS ──────────────────────────────────────────────────────────
class HairCareCategory(BaseModel):
    desc: str
    products: List[ValidatedProduct]

class HairCareDay(BaseModel):
    day: str
    type: str
    activity: str
    details: str

class HairCareResult(BaseModel):
    title: str
    tips: List[str]
    products: List[HairCareCategory]
    days: List[HairCareDay]

# ── HAIR STYLING LOOKBOOK MODELS ──────────────────────────────────────────────
class HairstyleItem(BaseModel):
    name: str
    desc: str
    search_reference: str

class HairStylingResult(BaseModel):
    title: str
    desc: str
    hairstyles: List[HairstyleItem]
