from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.models import AnalysisStatus


# Upload Schemas
class UploadUrlRequest(BaseModel):
    fileName: str
    fileType: str
    fileSize: Optional[int] = None


class UploadUrlResponse(BaseModel):
    scanId: str
    uploadUrl: str
    filePath: str
    expiresIn: int


# Analysis Schemas
class AnalysisResponse(BaseModel):
    id: str
    imageUrl: str
    status: AnalysisStatus
    createdAt: datetime


class AnalysisListResponse(BaseModel):
    analyses: List[dict]
    pagination: dict


# Recommendations Schemas
class RecommendationRequest(BaseModel):
    analysisId: str


class RecommendationResponse(BaseModel):
    message: str
    routine: dict
