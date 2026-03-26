from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    MAX_TRENDS_TO_PROCESS: int = 3
    TREND_PROCESS_DELAY_SECONDS: float = 0.0
    PER_TREND_TIMEOUT_SECONDS: float = 45.0
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
