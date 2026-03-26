from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    GEMINI_API_KEY: str
    MAX_TRENDS_TO_PROCESS: int = 10
    # UNSPLASH_ACCESS_KEY: str | None = None
    # GEMINI_MODEL: str = "gemini-2.5-flash"
    # GEMINI_MAX_TOKENS: int = 1200
    MODEL:str="llama-3.1-8b-instant"
    HF_TOKEN: str
    HF_API_URL:str
    CLOUDINARY_API_SECRET:str
    CLOUDINARY_API_KEY:str
    CLOUDINARY_CLOUD_NAME:str
    GROQ_API_KEY:str
    GROQ_BASE_URL:str

    class Config:
        env_file = ".env"


settings = Settings()