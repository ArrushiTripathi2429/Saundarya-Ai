"""
Email Router
Sends personalised skincare routine to user's email
"""

from fastapi import APIRouter, HTTPException, status, Header, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models import Analysis, AnalysisStatus
from app.services.email_services import send_routine_email
from app.services.ai_service import generate_routine_from_analysis

router = APIRouter()


class SendRoutineRequest(BaseModel):
    email: str
    user_name: str
    analysis_id: str


@router.post("/send-routine", status_code=status.HTTP_200_OK)
async def send_routine(
    req: SendRoutineRequest,
    user_id: str = Header(..., alias="x-user-id"),
    db: Session = Depends(get_db)
):
    
    analysis = db.query(Analysis).filter(
        Analysis.id == req.analysis_id,
        Analysis.user_id == user_id
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

    
    routine_json = generate_routine_from_analysis({
        "skinType":     analysis.skin_type,
        "oil":          analysis.oil,
        "acne":         analysis.acne,
        "blackheads":   analysis.blackheads,
        "pigmentation": analysis.pigmentation,
        "hydration":    analysis.hydration,
        "sensitivity":  analysis.sensitivity,
        "summary":      analysis.summary,
    })


    success = send_routine_email(
        to_email=req.email,
        user_name=req.user_name,
        routine_json=routine_json
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send email"
        )

    return {"success": True, "message": f"Routine sent to {req.email}"}