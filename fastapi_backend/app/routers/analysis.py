"""
Analysis Routes
Skin Analysis Linked to NextAuth User
"""

from fastapi import (
    APIRouter,
    HTTPException,
    status,
    UploadFile,
    File,
    Form,
    Header,
    Depends,
)
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Analysis, AnalysisStatus
from app.services.ai_service import analyze_skin_image
from app.services.image_processor import image_processor

import uuid
import cv2

router = APIRouter()


@router.get("/", status_code=status.HTTP_200_OK)
def get_analyses(
    page: int = 1,
    limit: int = 1,
    user_id: str = Header(..., alias="x-user-id"),
    db: Session = Depends(get_db),
):
    offset = (page - 1) * limit
    analyses = (
        db.query(Analysis)
        .filter(Analysis.user_id == user_id)
        .order_by(Analysis.id.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    return {
        "success": True,
        "analyses": [
            {
                "id":            a.id,
                "status":        a.status.value,
                "skinType":      a.skin_type,
                "oil":           a.oil,
                "acne":          a.acne,
                "blackheads":    a.blackheads,
                "pigmentation":  a.pigmentation,
                "hydration":     a.hydration,
                "sensitivity":   a.sensitivity,
                "summary":       a.summary,
            }
            for a in analyses
        ],
    }


@router.post("/upload-and-analyze", status_code=status.HTTP_201_CREATED)
async def upload_and_analyze(
    file: UploadFile = File(...),
    require_face: bool = Form(True),
    enhance: bool = Form(True),
    user_id: str = Header(..., alias="x-user-id"),
    db: Session = Depends(get_db),
):
    try:
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing user id",
            )

        
        process_result = await image_processor.process_upload(
            file=file,
            require_face=False,
            enhance=enhance,
        )

        
        face_detected = process_result["face_detection"]["detected"]

        if require_face and not face_detected:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No face detected. Please upload a clear selfie.",
            )

    
        cropped_numpy = process_result["numpy_image"]

        
        success, buffer = cv2.imencode(".jpg", cropped_numpy)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to encode cropped face image",
            )
        cropped_bytes = buffer.tobytes()

        
        analysis = Analysis(
            id=str(uuid.uuid4()),
            user_id=user_id,
            image_url=process_result["processed"]["base64"],
            status=AnalysisStatus.RUNNING,
        )
        print("About to insert - oil value:", analysis.oil)
        print("DB URL:", db.bind.url)
        db.add(analysis)
        db.commit()
        db.refresh(analysis)

        try:
        
            ai_results = await analyze_skin_image(cropped_bytes)

            analysis.skin_type    = ai_results.get("skin_type", "NORMAL")
            analysis.oil          = int(ai_results.get("oil", 0))
            analysis.acne         = int(ai_results.get("acne", 0))
            analysis.blackheads   = int(ai_results.get("blackheads", 0))
            analysis.pigmentation = int(ai_results.get("pigmentation", 0))
            analysis.hydration    = int(ai_results.get("hydration", 0))
            analysis.sensitivity  = int(ai_results.get("sensitivity", 0))
            analysis.summary      = ai_results.get("summary", "Analysis completed.")
            analysis.ai_raw_json  = ai_results
            analysis.status       = AnalysisStatus.COMPLETED

            db.commit()
            db.refresh(analysis)

        except Exception as ai_error:
            analysis.status  = AnalysisStatus.FAILED
            analysis.summary = f"AI failed: {str(ai_error)}"
            db.commit()

            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"AI analysis failed: {str(ai_error)}",
            )
        return {
            "success": True,
            "analysis": {
                "id":            analysis.id,
                "status":        analysis.status.value,
                "skinType":      analysis.skin_type,
                "oil":           analysis.oil,
                "acne":          analysis.acne,
                "blackheads":    analysis.blackheads,
                "pigmentation":  analysis.pigmentation,
                "hydration":     analysis.hydration,
                "sensitivity":   analysis.sensitivity,
                "summary":       analysis.summary,
            },
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Processing failed: {str(e)}",
        )