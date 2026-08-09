import httpx
import time
import json

BASE_URL = "http://127.0.0.1:8000/api/v1"

def run_tests():
    with httpx.Client(timeout=180.0) as client:
        print("=== 1. Testing Auth Signup ===")
        # Use timestamp to ensure unique email
        email = f"testuser_{int(time.time())}@example.com"
        password = "testPassword123!"
        
        response = client.post(f"{BASE_URL}/auth/signup", json={
            "email": email,
            "password": password,
            "full_name": "Test User"
        })
        print(f"Signup Status: {response.status_code}")
        print(response.json())
        
        print("\n=== 2. Testing Auth Login ===")
        response = client.post(f"{BASE_URL}/auth/login", json={
            "email": email,
            "password": password
        })
        print(f"Login Status: {response.status_code}")
        data = response.json()
        
        token = data.get("access_token")
        if not token:
            print("Failed to get token! Exiting tests.")
            print(data)
            return
            
        print("Successfully obtained access token!")
        
        print("\n=== 3. Testing Skincare Analysis (Gemini + Serper/SerpAPI) ===")
        headers = {
            "Authorization": f"Bearer {token}"
        }
        
        # A tiny 1x1 transparent PNG encoded in base64
        dummy_img_b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="
        
        print("Sending request... (This will take a few seconds as it calls Gemini -> Serper/SerpAPI -> Gemini)")
        response = client.post(f"{BASE_URL}/analyze/skincare", headers=headers, json={
            "image_base64": dummy_img_b64,
            "type": "skincare",
            "context": {
                "skin_type": "Oily",
                "concerns": ["Acne"],
                "budget": "Under ₹500"
            }
        })
        
        print(f"Skincare Status: {response.status_code}")
        if response.status_code == 200:
            print("Success! Result:")
            print(json.dumps(response.json(), indent=2))
        else:
            print("Error:")
            print(response.text)

if __name__ == "__main__":
    run_tests()
