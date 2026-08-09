import pytest
from httpx import AsyncClient, ASGITransport
from unittest.mock import patch
from main import app
from app.core.dependencies import get_current_user
from app.models.analyze import SkincareResult

# ── MOCK USER IDENTITY ────────────────────────────────────────────────────────
class MockUser:
    id = "12345678-1234-1234-1234-1234567890ab"
    email = "testuser@example.com"

# Override authentication dependency to bypass real Supabase token validation
app.dependency_overrides[get_current_user] = lambda: MockUser()

@pytest.mark.asyncio
async def test_skincare_analysis():
    """
    Tests the POST /analyze/skincare endpoint.
    Mocks both the Gemini service execution and the Supabase history saving.
    """
    mock_payload = {
        "score": 88,
        "skinAge": 25,
        "metrics": {
            "hydration": 75,
            "barrier": 80,
            "elasticity": 85,
            "clarity": 70
        },
        "concernsIdentified": ["Mild dehydration detected across the forehead"],
        "routine": {
            "morning": [
                {
                    "step": "Cleanse",
                    "product": "Gentle Hydrating Cleanser",
                    "desc": "Non-stripping milk wash.",
                    "image": "/product_cleanser.png"
                }
            ],
            "evening": [
                {
                    "step": "Treat",
                    "product": "Retinol",
                    "desc": "Encourages cell turnover.",
                    "image": "/product_retinol.png"
                }
            ]
        }
    }
    
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Patch the backend service logic and history persistence
        with patch("app.api.v1.endpoints.analyze.skincare_service.analyze_skincare") as mock_analyze, \
             patch("app.api.v1.endpoints.analyze.history_service.save_history") as mock_save:
            
            # Return validated Pydantic model instance
            mock_analyze.return_value = SkincareResult(**mock_payload)
            
            response = await ac.post("/api/v1/analyze/skincare", json={
                "image_base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
                "type": "skincare",
                "context": {
                    "skinType": "dry",
                    "concern": "dullness"
                }
            })
            
            # Assertions
            assert response.status_code == 200
            data = response.json()
            assert data["score"] == 88
            assert data["skinAge"] == 25
            assert data["metrics"]["hydration"] == 75
            assert "Mild dehydration detected across the forehead" in data["concernsIdentified"]
            assert data["routine"]["morning"][0]["step"] == "Cleanse"
            
            # Ensure history gets logged
            mock_save.assert_called_once()
