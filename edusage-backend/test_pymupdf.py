#!/usr/bin/env python3
"""
Test script for PyMuPDF image extraction
"""

import sys
import os
import json
from pathlib import Path

# Add the services directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from extract_images import extract_images_from_pdf
    
    def test_extraction():
        # Test parameters
        pdf_path = "test.pdf"  # Update with actual test PDF path
        output_dir = "./test_output"
        notebook_id = "test_notebook"
        document_id = "test_doc"
        user_id = "test_user"
        original_name = "test.pdf"
        
        print("Testing PyMuPDF image extraction...")
        
        # Check if PDF exists
        if not os.path.exists(pdf_path):
            print(f"Test PDF not found: {pdf_path}")
            print("Please place a test PDF file named 'test.pdf' in the backend directory")
            return
        
        # Run extraction
        result = extract_images_from_pdf(
            pdf_path, output_dir, notebook_id, 
            document_id, user_id, original_name
        )
        
        print(f"Extraction result: {json.dumps(result, indent=2)}")
        
        if result['success']:
            print(f"Successfully extracted {result['totalImages']} images")
        else:
            print(f"Extraction failed: {result['error']}")
    
    if __name__ == "__main__":
        test_extraction()
        
except ImportError as e:
    print(f"Missing dependencies: {e}")
    print("Please install Python dependencies:")
    print("pip install -r requirements.txt")
