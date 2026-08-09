import pytest
from httpx import AsyncClient, ASGITransport
from unittest.mock import patch
from main import app
from app.core.dependencies import get_current_user
from app.models.image import ImageUploadResponse

# ── MOCK USER IDENTITY ────────────────────────────────────────────────────────
class MockUser:
    id = "12345678-1234-1234-1234-1234567890ab"
    email = "testuser@example.com"

# Override authentication dependency to bypass real Supabase token validation
app.dependency_overrides[get_current_user] = lambda: MockUser()

@pytest.mark.asyncio
async def test_upload_image():
    """
    Tests POST /image/upload with multipart form files.
    Mocks Cloudinary upload service call.
    """
    mock_upload_res = {
        "url": "https://res.cloudinary.com/demo/image/upload/sample.png",
        "public_id": "sample_public_id"
    }
    
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        with patch("app.api.v1.endpoints.image.image_service.upload_image") as mock_upload:
            mock_upload.return_value = ImageUploadResponse(**mock_upload_res)
            
            # Send sample text file pretending to be an image
            files = {"file": ("test.png", b"fake_image_payload", "image/png")}
            
            response = await ac.post("/api/v1/image/upload", files=files)
            
            assert response.status_code == 200
            data = response.json()
            assert data["url"] == "https://res.cloudinary.com/demo/image/upload/sample.png"
            assert data["public_id"] == "sample_public_id"
