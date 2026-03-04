"""
Upload Routes
Image upload with OpenCV preprocessing and validation
Auth Removed
"""

from fastapi import APIRouter, HTTPException, status, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import UploadUrlRequest, UploadUrlResponse
from app.services.image_processor import image_processor
import uuid
import os

router = APIRouter()


@router.post("/validate", status_code=status.HTTP_200_OK)
async def validate_image_upload(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    validation = await image_processor.validate_image(file)

    if not validation["valid"]:
        return {
            "valid": False,
            "errors": validation["errors"]
        }

    return {
        "valid": True,
        "dimensions": validation["dimensions"],
        "file_size": validation["file_size"],
        "format": validation["format"],
    }


@router.post("/process", status_code=status.HTTP_200_OK)
async def process_image_upload(
    file: UploadFile = File(...),
    require_face: bool = Form(True),
    enhance: bool = Form(True),
    db: Session = Depends(get_db)
):
    try:
        result = await image_processor.process_upload(
            file=file,
            require_face=require_face,
            enhance=enhance
        )

        return {
            "success": True,
            "message": "Image processed successfully",
            **result
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Image processing failed: {str(e)}"
        )


@router.post("", response_model=UploadUrlResponse)
async def get_upload_url(
    request: UploadUrlRequest,
    db: Session = Depends(get_db)
):
    allowed_types = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/heic"
    ]

    if request.fileType not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only image files are allowed"
        )

    max_size = 10 * 1024 * 1024
    if request.fileSize and request.fileSize > max_size:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size must be less than 10MB"
        )

    scan_id = str(uuid.uuid4())
    file_extension = request.fileName.split(".")[-1]
    unique_file_name = f"{scan_id}.{file_extension}"

    # TEMP USER
    file_path = f"uploads/temp-user/{unique_file_name}"

    return UploadUrlResponse(
        scanId=scan_id,
        uploadUrl=f"/api/upload-handler?path={file_path}",
        filePath=file_path,
        expiresIn=3600
    )


@router.post("/direct", status_code=status.HTTP_201_CREATED)
async def direct_upload(
    file: UploadFile = File(...),
    require_face: bool = Form(True),
    enhance: bool = Form(True),
    save_to_storage: bool = Form(False),
    db: Session = Depends(get_db)
):
    result = await image_processor.process_upload(
        file=file,
        require_face=require_face,
        enhance=enhance
    )

    saved_path = None

    if save_to_storage:
        scan_id = str(uuid.uuid4())
        upload_dir = f"uploads/temp-user"
        os.makedirs(upload_dir, exist_ok=True)

        import base64
        processed_bytes = base64.b64decode(result["processed"]["base64"])

        file_extension = os.path.splitext(file.filename)[1] or ".jpg"
        saved_path = f"{upload_dir}/{scan_id}{file_extension}"

        with open(saved_path, "wb") as f:
            f.write(processed_bytes)

    return {
        "success": True,
        "scanId": str(uuid.uuid4()),
        "imageUrl": saved_path,
        "processed": result["processed"],
        "face_detection": result["face_detection"],
        "quality": result["quality"],
        "original": result["original"]
    }  