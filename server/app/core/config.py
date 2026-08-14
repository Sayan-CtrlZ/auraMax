from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    SECRET_KEY: str = "auramax-production-jwt-secret-key-change-me"
    ENVIRONMENT: str = "production"
    SERPER_API_KEY: str = ""
    SERPAPI_API_KEY: str = ""
    FIREBASE_WEB_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    GROQ_API_KEY: str = ""

    # Scan Limits (Scans allowed per 24 hours)
    SKINCARE_SCAN_LIMIT: int = 1
    FASHION_SCAN_LIMIT: int = 1
    HAIR_SCAN_LIMIT: int = 1

    # Pydantic v2 settings configuration
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
