#!/usr/bin/env python3
"""
Standalone barcode decoder script for Node.js backend.
Uses pyzbar and OpenCV for barcode detection.
"""

import sys
import json
import base64
from io import BytesIO
from pathlib import Path

try:
    import cv2
    import numpy as np
    from PIL import Image
    from pyzbar import pyzbar
except ImportError as e:
    print(json.dumps({
        "success": False,
        "error": f"Missing dependency: {str(e)}. Install with: pip install opencv-python pyzbar pillow"
    }))
    sys.exit(1)


def preprocess_image(image):
    """Apply various preprocessing techniques to improve barcode detection."""
    processed_images = []
    
    # Original
    processed_images.append(("original", image))
    
    # Grayscale
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image
    processed_images.append(("grayscale", gray))
    
    # Thresholding
    _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    processed_images.append(("threshold", thresh))
    
    # Adaptive threshold
    adaptive = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                     cv2.THRESH_BINARY, 11, 2)
    processed_images.append(("adaptive", adaptive))
    
    # Blur then threshold
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    _, blur_thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    processed_images.append(("blur_threshold", blur_thresh))
    
    # Morphological operations
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    morph = cv2.morphologyEx(gray, cv2.MORPH_CLOSE, kernel)
    processed_images.append(("morphological", morph))
    
    # Enhanced contrast
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    enhanced = clahe.apply(gray)
    processed_images.append(("enhanced", enhanced))
    
    # Inverted
    inverted = cv2.bitwise_not(gray)
    processed_images.append(("inverted", inverted))
    
    return processed_images


def try_rotations(image):
    """Try different rotations of the image."""
    rotations = [
        (0, image),
        (90, cv2.rotate(image, cv2.ROTATE_90_CLOCKWISE)),
        (180, cv2.rotate(image, cv2.ROTATE_180)),
        (270, cv2.rotate(image, cv2.ROTATE_90_COUNTERCLOCKWISE)),
    ]
    return rotations


def decode_barcode(image_data, is_base64=True):
    """
    Decode barcode from image data.
    
    Args:
        image_data: Base64 string or file path
        is_base64: True if image_data is base64, False if file path
    
    Returns:
        dict with success, barcode data, and type
    """
    try:
        # Load image
        if is_base64:
            # Decode base64 to image
            img_bytes = base64.b64decode(image_data)
            nparr = np.frombuffer(img_bytes, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        else:
            # Load from file path
            image = cv2.imread(image_data)
        
        if image is None:
            return {
                "success": False,
                "error": "Failed to load image"
            }
        
        # Try original image first
        barcodes = pyzbar.decode(image)
        if barcodes:
            barcode = barcodes[0]
            return {
                "success": True,
                "barcode": barcode.data.decode('utf-8'),
                "type": barcode.type,
                "method": "original"
            }
        
        # Try preprocessed versions
        processed_versions = preprocess_image(image)
        for name, processed in processed_versions:
            barcodes = pyzbar.decode(processed)
            if barcodes:
                barcode = barcodes[0]
                return {
                    "success": True,
                    "barcode": barcode.data.decode('utf-8'),
                    "type": barcode.type,
                    "method": f"preprocessing-{name}"
                }
        
        # Try rotations with preprocessing
        for angle, rotated in try_rotations(image):
            # Try rotated original
            barcodes = pyzbar.decode(rotated)
            if barcodes:
                barcode = barcodes[0]
                return {
                    "success": True,
                    "barcode": barcode.data.decode('utf-8'),
                    "type": barcode.type,
                    "method": f"rotation-{angle}"
                }
            
            # Try preprocessed rotated
            for name, processed in preprocess_image(rotated):
                barcodes = pyzbar.decode(processed)
                if barcodes:
                    barcode = barcodes[0]
                    return {
                        "success": True,
                        "barcode": barcode.data.decode('utf-8'),
                        "type": barcode.type,
                        "method": f"rotation-{angle}-{name}"
                    }
        
        return {
            "success": False,
            "error": "No barcode detected after all preprocessing attempts"
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Decoding error: {str(e)}"
        }


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({
            "success": False,
            "error": "Usage: python decode_barcode.py --file <path> OR python decode_barcode.py <base64_data>"
        }))
        sys.exit(1)
    
    # Check if file path is provided
    if sys.argv[1] == "--file" and len(sys.argv) >= 3:
        image_path = sys.argv[2]
        result = decode_barcode(image_path, is_base64=False)
    else:
        # Assume base64 data
        image_data = sys.argv[1]
        result = decode_barcode(image_data, is_base64=True)
    
    print(json.dumps(result))
