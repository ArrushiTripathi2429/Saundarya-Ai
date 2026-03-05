"""
Recommendations Routes (Simplified V1)
Auth Removed – Uses Analysis summary only
"""

from fastapi import APIRouter, HTTPException, status, Query, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Analysis, AnalysisStatus
from app.schemas import RecommendationRequest, RecommendationResponse

router = APIRouter()



@router.post("", response_model=RecommendationResponse, status_code=status.HTTP_201_CREATED)
async def create_recommendations(
    request: RecommendationRequest,
    db: Session = Depends(get_db)
):
    analysis = db.query(Analysis).filter(
        Analysis.id == request.analysisId
    ).first()

    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )

    if analysis.status != AnalysisStatus.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Analysis must be completed before generating recommendations"
        )

    return RecommendationResponse(
        message="Recommendations generated successfully",
        routine={
            "analysisId": analysis.id,
            "summary": analysis.summary,
            "analysis": {
                "id": analysis.id,
                "imageUrl": analysis.image_url,
                "skinType": analysis.skin_type,
                "oil": analysis.oil,
                "acne": analysis.acne,
                "blackheads": analysis.blackheads,
                "pigmentation": analysis.pigmentation,
                "hydration": analysis.hydration,
                "sensitivity": analysis.sensitivity,
            }
        }
    )



@router.get("", response_model=dict)
async def get_recommendations(
    analysisId: str = Query(..., description="Analysis ID"),
    db: Session = Depends(get_db)
):
    analysis = db.query(Analysis).filter(
        Analysis.id == analysisId
    ).first()

    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )

    if analysis.status != AnalysisStatus.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Analysis not completed yet"
        )

    return {
        "routine": {
            "analysisId": analysis.id,
            "summary": analysis.summary,
            "analysis": {
                "id": analysis.id,
                "imageUrl": analysis.image_url,
                "skinType": analysis.skin_type,
                "oil": analysis.oil,
                "acne": analysis.acne,
                "blackheads": analysis.blackheads,
                "pigmentation": analysis.pigmentation,
                "hydration": analysis.hydration,
                "sensitivity": analysis.sensitivity,
            }
        }
    }
