"""
FastAPI Main Application
Skincare Analysis App Backend
"""

from dotenv import load_dotenv
load_dotenv()


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import upload, analysis, recommendations
from app.database import engine, Base 
from app.models import User, Analysis

from app.routers import upload, analysis, recommendations, email_router 
print("Known tables:", Base.metadata.tables.keys())
app = FastAPI(
    title="Skincare Analysis API",
    description="Backend API for skin analysis and recommendations",
    version="1.0.0"
)

# Create DB tables
Base.metadata.create_all(bind=engine)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(upload.router, prefix="/api/upload-url", tags=["Upload"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["Analysis"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["Recommendations"])

app.include_router(email_router.router, prefix="/api/email", tags=["Email"]) 
@app.get("/")
async def root():
    return {"message": "Skincare Analysis API is running 🚀"}


@app.get("/health")
async def health_check():
    return {"status": "OK"}
