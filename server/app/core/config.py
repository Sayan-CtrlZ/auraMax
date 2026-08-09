from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str
    HUGGINGFACE_API_KEY: str
    SECRET_KEY: str
    ENVIRONMENT: str = "development"
    SERPER_API_KEY: str = ""
    SERPAPI_API_KEY: str = ""
    FIREBASE_WEB_API_KEY: str = ""
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_DEFAULT_REGION: str = "us-east-1"

    # Pydantic v2 settings configuration
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
