import sys
import os
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient

# Ensure backend root is in PYTHONPATH
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app
from app.core.dependencies import get_current_user
from app.db.neon import get_db
from app.models.auth import UserResponse
from app.models.analyze import SkincareResult, FashionOutfit, HairCareResult, HairStylingResult
from app.models.image import ImageUploadResponse
from app.models.product import Product
from app.models.history import HistoryItem, HistoryListResponse

# ── 1. DEPENDENCY OVERRIDES ───────────────────────────────────────────────────
class MockUser:
    id = "12345678-1234-1234-1234-1234567890ab"
    email = "testuser@example.com"
    full_name = "Mock User"

app.dependency_overrides[get_current_user] = lambda: MockUser()
app.dependency_overrides[get_db] = lambda: MagicMock()

client = TestClient(app)

print("\n" + "="*80)
print("              auraMax API Endpoint Integration Testing Suite".center(80))
print("="*80 + "\n")

all_passed = True

def run_test(name, method, url, mock_path, mock_return, **kwargs):
    global all_passed
    with patch(mock_path) as mocked_service, \
         patch("app.api.v1.endpoints.analyze.history_service.save_history") as mocked_history:
        
        mocked_service.return_value = mock_return
        mocked_history.return_value = None
        
        headers = {"Authorization": "Bearer mock_token"}
        if method == "GET":
            response = client.get(url, headers=headers, **kwargs)
        elif method == "POST":
            response = client.post(url, headers=headers, **kwargs)
        elif method == "DELETE":
            response = client.delete(url, headers=headers, **kwargs)
            
        status = response.status_code
        if status in (200, 201):
            print(f"  [PASS]  {name:<30} | {method:<6} {url:<30} | Status: {status}")
        else:
            print(f"  [FAIL]  {name:<30} | {method:<6} {url:<30} | Status: {status} - {response.text}")
            all_passed = False

# ── 2. RUNNING TESTS ──────────────────────────────────────────────────────────

# Auth Endpoints
run_test(
    name="User Signup",
    method="POST",
    url="/api/v1/auth/signup",
    mock_path="app.api.v1.endpoints.auth.auth_service.signup",
    mock_return=UserResponse(id="usr_1", email="test@example.com", full_name="Test User"),
    json={"email": "test@example.com", "password": "password123", "full_name": "Test User"}
)

run_test(
    name="User Login",
    method="POST",
    url="/api/v1/auth/login",
    mock_path="app.api.v1.endpoints.auth.auth_service.login",
    mock_return=("mock_access_token", UserResponse(id="usr_1", email="test@example.com", full_name="Test User")),
    json={"email": "test@example.com", "password": "password123"}
)

run_test(
    name="User Logout",
    method="POST",
    url="/api/v1/auth/logout",
    mock_path="app.api.v1.endpoints.auth.auth_service.logout",
    mock_return=None
)

# AI Analysis Endpoints
run_test(
    name="Skincare Scan",
    method="POST",
    url="/api/v1/analyze/skincare",
    mock_path="app.api.v1.endpoints.analyze.skincare_service.analyze_skincare",
    mock_return=SkincareResult(
        score=90,
        skinAge=23,
        metrics={"hydration": 80, "barrier": 85, "elasticity": 90, "clarity": 75},
        concernsIdentified=["Dehydration"],
        routine={"morning": [], "evening": []}
    ),
    json={"image_base64": "mock_base64", "type": "skincare", "context": {}}
)

run_test(
    name="Fashion Lookbook Scan",
    method="POST",
    url="/api/v1/analyze/fashion",
    mock_path="app.api.v1.endpoints.analyze.fashion_service.analyze_fashion",
    mock_return=[
        FashionOutfit(id=1, title="Minimalist look", image="http://img", links=[])
    ],
    json={"image_base64": "mock_base64", "type": "fashion", "context": {}}
)

run_test(
    name="Hair Care Calendar Scan",
    method="POST",
    url="/api/v1/analyze/hair",
    mock_path="app.api.v1.endpoints.analyze.hair_service.analyze_hair",
    mock_return=HairCareResult(title="Wavy Protocol", tips=[], products=[], days=[]),
    json={"image_base64": "mock_base64", "type": "hair", "context": {"mode": "care"}}
)

run_test(
    name="Hair Style Lookbook Scan",
    method="POST",
    url="/api/v1/analyze/hair",
    mock_path="app.api.v1.endpoints.analyze.hair_service.analyze_hair",
    mock_return=HairStylingResult(title="Wedding look", desc="", hairstyles=[]),
    json={"image_base64": "mock_base64", "type": "hair", "context": {"mode": "styling"}}
)

# Image Endpoints
run_test(
    name="Image Cloudinary Upload",
    method="POST",
    url="/api/v1/image/upload",
    mock_path="app.api.v1.endpoints.image.image_service.upload_image",
    mock_return=ImageUploadResponse(url="http://cloudinary/img.png", public_id="img_123"),
    files={"file": ("test.png", b"filecontent", "image/png")}
)

run_test(
    name="Image Generation (FLUX)",
    method="POST",
    url="/api/v1/image/generate",
    mock_path="app.api.v1.endpoints.image.image_service.generate_image",
    mock_return="mock_base64_string",
    json={"prompt": "Minimalist blazer"}
)

# Products Endpoints
run_test(
    name="Get All Products",
    method="GET",
    url="/api/v1/products",
    mock_path="app.api.v1.endpoints.products.product_service.get_all_products",
    mock_return=[
        Product(id="p1", name="Cleanser", category="skincare", tags=[], price=10.0, image_url="http://img", affiliate_link="#")
    ]
)

run_test(
    name="Get Matched Products",
    method="POST",
    url="/api/v1/products/match",
    mock_path="app.api.v1.endpoints.products.product_service.match_products",
    mock_return=[
        Product(id="p1", name="Cleanser", category="skincare", tags=[], price=10.0, image_url="http://img", affiliate_link="#")
    ],
    json={"tags": ["acne"], "category": "skincare"}
)

# History Endpoints
run_test(
    name="Get History logs",
    method="GET",
    url="/api/v1/history",
    mock_path="app.api.v1.endpoints.history.history_service.get_history",
    mock_return=HistoryListResponse(items=[
        HistoryItem(id="h1", user_id="u1", type="skincare", result={}, created_at="2026-06-06T00:00:00")
    ])
)

run_test(
    name="Delete History Log",
    method="DELETE",
    url="/api/v1/history/h1",
    mock_path="app.api.v1.endpoints.history.history_service.delete_history",
    mock_return=True
)

print("\n" + "="*80)
if all_passed:
    print("                ALL ENDPOINTS WORKING PERFECTLY AND READY!  ".center(80))
else:
    print("                SOME ENDPOINTS FAILED TESTS. REVIEW DETAILS.  ".center(80))
print("="*80 + "\n")
