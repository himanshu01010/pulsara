from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router

app = FastAPI(
    title="Trend Content API",
    description="Receives trending tags from Java, generates govt-compliant news articles using Claude AI.",
    version="1.0.0",
)

# ✅ CORS CONFIG
origins = [
    "http://localhost:8080", 
    "http://localhost:5173",   
    "https://pulsara.onrender.com",
    "https://pulsara-frontend.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       
    allow_credentials=True,
    allow_methods=["*"],        
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)