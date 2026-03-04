"""
Image Utility Functions
Helper functions for image operations
"""
import cv2
import numpy as np
from typing import Tuple, Optional

def resize_with_aspect_ratio(
    image: np.ndarray,
    max_width: int = 1920,
    max_height: int = 1920
) -> np.ndarray:
    """
    Resize image maintaining aspect ratio
    """
    height, width = image.shape[:2]
    
    # Calculate scaling factor
    scale = min(max_width / width, max_height / height)
    
    # Only resize if image is larger than max dimensions
    if scale < 1.0:
        new_width = int(width * scale)
        new_height = int(height * scale)
        return cv2.resize(image, (new_width, new_height), interpolation=cv2.INTER_LANCZOS4)
    
    return image

def crop_face_region(
    image: np.ndarray,
    face_coords: dict,
    padding: int = 50
) -> np.ndarray:
    """
    Crop image to face region with padding
    """
    x = max(0, face_coords["x"] - padding)
    y = max(0, face_coords["y"] - padding)
    w = min(image.shape[1] - x, face_coords["width"] + 2 * padding)
    h = min(image.shape[0] - y, face_coords["height"] + 2 * padding)
    
    return image[y:y+h, x:x+w]

def enhance_skin_visibility(image: np.ndarray) -> np.ndarray:
    """
    Enhance skin visibility for better analysis
    """
    # Convert to LAB color space
    lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    
    # Apply CLAHE to L channel
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    l = clahe.apply(l)
    
    # Merge and convert back
    enhanced = cv2.merge([l, a, b])
    enhanced = cv2.cvtColor(enhanced, cv2.COLOR_LAB2BGR)
    
    return enhanced

def remove_background_noise(image: np.ndarray) -> np.ndarray:
    """
    Remove background noise while preserving skin details
    """
    # Apply bilateral filter (preserves edges)
    denoised = cv2.bilateralFilter(image, 9, 75, 75)
    return denoised

def normalize_lighting(image: np.ndarray) -> np.ndarray:
    """
    Normalize lighting conditions
    """
    # Convert to LAB
    lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    
    # Normalize L channel
    l_normalized = cv2.normalize(l, None, 0, 255, cv2.NORM_MINMAX)
    
    # Merge back
    normalized = cv2.merge([l_normalized, a, b])
    normalized = cv2.cvtColor(normalized, cv2.COLOR_LAB2BGR)
    
    return normalized

def prepare_for_analysis(
    image: np.ndarray,
    face_coords: Optional[dict] = None
) -> np.ndarray:
    """
    Complete preprocessing pipeline for skin analysis
    """
    processed = image.copy()
    
    # Crop to face if coordinates provided
    if face_coords:
        processed = crop_face_region(processed, face_coords)
    
    # Resize to optimal size for analysis
    processed = resize_with_aspect_ratio(processed, max_width=1024, max_height=1024)
    
    # Enhance skin visibility
    processed = enhance_skin_visibility(processed)
    
    # Remove noise
    processed = remove_background_noise(processed)
    
    # Normalize lighting
    processed = normalize_lighting(processed)
    
    return processed
