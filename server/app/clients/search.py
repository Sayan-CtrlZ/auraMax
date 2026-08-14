import httpx
import asyncio
from app.core.config import settings

async def search_google_shopping(query: str) -> list[dict]:
    """
    Searches Google Shopping using SerpAPI.
    Returns a list of raw products.
    """
    if not settings.SERPAPI_API_KEY:
        return []
        
    url = "https://serpapi.com/search.json"
    params = {
        "engine": "google_shopping",
        "google_domain": "google.co.in",
        "gl": "in",
        "hl": "en",
        "q": query,
        "api_key": settings.SERPAPI_API_KEY
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params, timeout=20.0)
            if response.status_code == 200:
                data = response.json()
                shopping_results = data.get("shopping_results", [])
                
                raw_products = []
                for item in shopping_results[:15]:
                    link = item.get("product_link") or item.get("link", "#")
                    if link.startswith("/"):
                        link = f"https://www.google.com{link}"
                        
                    raw_products.append({
                        "name": item.get("title", ""),
                        "price": item.get("price", ""),
                        "source": item.get("source", "Google Shopping"),
                        "link": link,
                        "thumbnail": item.get("thumbnail", "/product_placeholder.png")
                    })
                return raw_products
            return []
        except Exception as e:
            print(f"SerpAPI Google Shopping error: {e}")
            return []

async def search_amazon_india(query: str) -> list[dict]:
    """
    Searches Amazon India using SerpAPI.
    Returns a list of raw products.
    """
    if not settings.SERPAPI_API_KEY:
        return []
        
    url = "https://serpapi.com/search.json"
    params = {
        "engine": "amazon",
        "amazon_domain": "amazon.in",
        "q": query,
        "api_key": settings.SERPAPI_API_KEY
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params, timeout=20.0)
            if response.status_code == 200:
                data = response.json()
                amazon_results = data.get("amazon_results", [])
                
                raw_products = []
                for item in amazon_results[:15]:
                    link = item.get("link", "#")
                    if link.startswith("/"):
                        link = f"https://www.amazon.in{link}"
                        
                    raw_products.append({
                        "name": item.get("title", ""),
                        "price": item.get("price", {}).get("raw", "") if isinstance(item.get("price"), dict) else str(item.get("price", "")),
                        "source": "Amazon India",
                        "link": link,
                        "thumbnail": item.get("thumbnail", "/product_placeholder.png")
                    })
                return raw_products
            return []
        except Exception as e:
            print(f"SerpAPI error: {e}")
            return []

async def run_parallel_searches(query: str) -> list[dict]:
    """
    Runs both Serper and SerpAPI simultaneously and combines results.
    """
    google_task = search_google_shopping(query)
    amazon_task = search_amazon_india(query)
    
    results = await asyncio.gather(google_task, amazon_task, return_exceptions=True)
    
    combined = []
    if isinstance(results[0], list):
        combined.extend(results[0])
    if isinstance(results[1], list):
        combined.extend(results[1])
        
    return combined
