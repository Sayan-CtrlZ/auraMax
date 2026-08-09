from fastapi import APIRouter
from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.analyze import router as analyze_router
from app.api.v1.endpoints.image import router as image_router
from app.api.v1.endpoints.history import router as history_router

api_router = APIRouter()

# Mount the endpoint routers onto the API v1 router
api_router.include_router(auth_router)
api_router.include_router(analyze_router)
api_router.include_router(image_router)
api_router.include_router(history_router)
