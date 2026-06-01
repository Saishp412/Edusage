#!/usr/bin/env python3
"""
Test the complete PyMuPDF extraction flow
"""

import sys
import json
import os
from services.extract_images import extract_images_from_pdf

def test_extraction():
    # Test with a mock PDF path (will fail but should return proper JSON)
    result = extract_images_from_pdf(
        "nonexistent.pdf",
        "./test_output",
        "test_notebook",
        "test_doc", 
        "test_user",
        "test.pdf"
    )
    
    print("Test Result:")
    print(json.dumps(result, indent=2))
    
    # Verify structure
    required_keys = ["success", "images", "totalImages"]
    for key in required_keys:
        if key not in result:
            print(f"ERROR: Missing required key '{key}'")
            return False
    
    if not isinstance(result["images"], list):
        print("ERROR: 'images' should be a list")
        return False
    
    if not isinstance(result["totalImages"], int):
        print("ERROR: 'totalImages' should be an integer")
        return False
    
    print("✅ JSON structure is valid")
    return True

if __name__ == "__main__":
    success = test_extraction()
    sys.exit(0 if success else 1)
