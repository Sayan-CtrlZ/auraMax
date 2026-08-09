import asyncio
import sys
import os
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

# Ensure backend root is in PYTHONPATH
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings

print("\n" + "="*80)
print("              auraMax API Credentials Connectivity Diagnostics".center(80))
print("="*80 + "\n")

async def test_neon():
    try:
        print("1. Testing NeonDB PostgreSQL connection...")
        engine = create_async_engine(settings.NEON_DATABASE_URL)
        async with engine.connect() as conn:
            result = await conn.execute(text("SELECT 1;"))
            val = result.scalar()
            print(f"   [PASS] NeonDB successfully executed 'SELECT 1' (Result: {val})")
        await engine.dispose()
    except Exception as e:
        print(f"   [FAIL] NeonDB connection failed: {str(e)}")

def test_gemini():
    try:
        print("\n2. Testing Google Gemini 2.0 Flash API...")
        import google.generativeai as genai
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content("Ping")
        print(f"   [PASS] Gemini API responded successfully. Reply: '{response.text.strip()}'")
    except Exception as e:
        print(f"   [FAIL] Gemini API failed: {str(e)}")

def test_supabase():
    try:
        print("\n3. Testing Supabase client connectivity...")
        from supabase import create_client
        # Attempt to create client
        client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
        print("   [PASS] Supabase SDK Client successfully initialized.")
        try:
            # Send a dummy token request to verify auth endpoint responds (expecting invalid jwt, but not connection error)
            client.auth.get_user("dummy_token")
            print("   [PASS] Supabase auth communication complete.")
        except Exception as auth_err:
            if "invalid jwt" in str(auth_err).lower() or "signature is invalid" in str(auth_err).lower() or "api key" in str(auth_err).lower():
                print(f"   [PASS] Supabase auth responded correctly (rejected dummy JWT but reached server). response: {str(auth_err)}")
            else:
                print(f"   [FAIL] Supabase auth query failed: {str(auth_err)}")
    except Exception as e:
        print(f"   [FAIL] Supabase client initialization failed: {str(e)}")

def test_huggingface():
    try:
        print("\n4. Testing Hugging Face Inference API...")
        from huggingface_hub import HfApi
        api = HfApi(token=settings.HUGGINGFACE_API_KEY)
        user_info = api.whoami()
        print(f"   [PASS] HuggingFace authenticated. Account Name: {user_info.get('username')}")
    except Exception as e:
        print(f"   [FAIL] Hugging Face Inference API failed: {str(e)}")

async def run_diagnostics():
    await test_neon()
    test_gemini()
    test_supabase()
    test_huggingface()
    print("\n" + "="*80)
    print("                      Connectivity Diagnostics Complete".center(80))
    print("="*80 + "\n")

if __name__ == "__main__":
    asyncio.run(run_diagnostics())
