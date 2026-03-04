"""
Image Processor Service
Handles image validation, face detection, cropping, and encoding
"""

import cv2
import mediapipe as mp
import base64
import numpy as np
from fastapi import UploadFile

mp_face = mp.solutions.face_detection


def detect_and_crop_face(image: np.ndarray) -> tuple[np.ndarray, bool]:
    """
    Detects and crops the first face found in a numpy image array.

    Args:
        image: BGR numpy array (from cv2.imdecode)

    Returns:
        (cropped_image, face_detected)
        - If face found: (cropped face numpy array, True)
        - If no face:    (original image numpy array, False)
    """
    # Convert BGR → RGB for MediaPipe
    rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    with mp_face.FaceDetection(
        model_selection=1,
        min_detection_confidence=0.5
    ) as detector:

        result = detector.process(rgb)

        # No face found — return original image with False flag
        if not result.detections:
            return image, False

        bbox = result.detections[0].location_data.relative_bounding_box

        h, w, _ = image.shape

        x = int(bbox.xmin * w)
        y = int(bbox.ymin * h)
        width = int(bbox.width * w)
        height = int(bbox.height * h)

        # Clamp to valid bounds so we never go negative or out of frame
        x = max(0, x)
        y = max(0, y)
        width = min(width, w - x)
        height = min(height, h - y)

        # Guard against zero-size crop
        if width <= 0 or height <= 0:
            return image, False

        cropped = image[y:y + height, x:x + width]

        return cropped, True


class ImageProcessor:

    async def validate_image(self, file: UploadFile) -> dict:
        """
        Validates an uploaded image file.
        Returns metadata if valid, or an error dict if not.
        """
        # Read file bytes
        contents = await file.read()

        # IMPORTANT: reset pointer so file can be read again later
        await file.seek(0)

        file_size = len(contents)

        # Convert to numpy image
        np_arr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if image is None:
            return {"valid": False, "errors": ["Invalid image file"]}

        h, w, _ = image.shape

        return {
            "valid": True,
            "dimensions": {"width": w, "height": h},
            "file_size": file_size,
            "format": file.filename.split(".")[-1].lower() if file.filename else "unknown"
        }

    async def process_upload(
        self,
        file: UploadFile,
        require_face: bool = True,
        enhance: bool = True
    ) -> dict:
        """
        Processes an uploaded image:
        - Decodes to numpy array
        - Runs face detection & crop
        - Encodes result to base64
        - Returns result dict including the numpy image for downstream use

        Args:
            file:         FastAPI UploadFile
            require_face: if True and no face found, raises Exception
            enhance:      reserved for future enhancement logic

        Returns:
            dict with keys: processed, face_detection, quality, original, numpy_image
        """
        # Read file bytes
        contents = await file.read()

        # IMPORTANT: reset pointer
        await file.seek(0)

        # Decode bytes → numpy BGR image
        np_arr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if image is None:
            raise Exception("Invalid image format — could not decode file")

        # Face detection & crop
        cropped_image, face_detected = detect_and_crop_face(image)

        if require_face and not face_detected:
            raise Exception("No face detected in the uploaded image")

        # Encode processed (cropped) image to base64 for storage/response
        success, buffer = cv2.imencode(".jpg", cropped_image)
        if not success:
            raise Exception("Image encoding failed")

        base64_img = base64.b64encode(buffer).decode("utf-8")

        return {
            # base64 string for API response / DB storage
            "processed": {"base64": base64_img},

            # ✅ numpy array passed directly to avoid re-reading from disk
            "numpy_image": cropped_image,

            "face_detection": {"detected": face_detected},
            "quality": {"status": "good"},
            "original": {"size": len(contents)}
        }


# Singleton instance
image_processor = ImageProcessor()