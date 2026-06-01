#!/usr/bin/env python3
"""
PyMuPDF-based PDF image extraction service
Extracts all images from PDF files and returns clean JSON output
"""

import sys
import json
import os
import traceback
from pathlib import Path
import fitz  # PyMuPDF

def extract_images_from_pdf(pdf_path, output_dir, notebook_id, document_id, user_id, original_name):
    """
    Extract all images from a PDF file using PyMuPDF
    
    Args:
        pdf_path: Path to PDF file
        output_dir: Directory to save extracted images
        notebook_id: ID of notebook
        document_id: ID of document
        user_id: ID of user
        original_name: Original filename
    
    Returns:
        dict: JSON response with extracted images data
    """
    try:
        # Validate inputs
        if not pdf_path or not os.path.exists(pdf_path):
            return {
                "success": False,
                "error": f"PDF file not found: {pdf_path}",
                "images": [],
                "totalImages": 0
            }
        
        # Create output directory
        os.makedirs(output_dir, exist_ok=True)
        
        # Open PDF document
        try:
            doc = fitz.open(pdf_path)
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to open PDF: {str(e)}",
                "images": [],
                "totalImages": 0
            }
        
        extracted_images = []
        
        # Process each page
        try:
            for page_num in range(len(doc)):
                try:
                    page = doc.load_page(page_num)
                    
                    # Get image list from page
                    try:
                        image_list = page.get_images(full=True)
                    except Exception:
                        # Skip page if images can't be retrieved
                        continue
                    
                    # Extract each image
                    for img_index, img in enumerate(image_list):
                        try:
                            # Get image data
                            xref = img[0]
                            
                            # Create pixmap safely
                            try:
                                pix = fitz.Pixmap(doc, xref)
                            except Exception:
                                continue
                            
                            # Skip if image is too small or invalid
                            if pix.width < 50 or pix.height < 50 or pix.width <= 0 or pix.height <= 0:
                                pix = None
                                continue
                            
                            # Convert to PNG safely
                            try:
                                if pix.n - pix.alpha < 4:
                                    # RGB or Grayscale image
                                    img_data = pix.tobytes("png")
                                else:
                                    # CMYK image, convert to RGB first
                                    pix1 = fitz.Pixmap(fitz.csRGB, pix)
                                    img_data = pix1.tobytes("png")
                                    pix1 = None
                            except Exception:
                                pix = None
                                continue
                            
                            # Generate filename
                            base_name = os.path.splitext(original_name)[0]
                            filename = f"{base_name}_page_{page_num + 1}_img_{img_index + 1}.png"
                            output_path = os.path.join(output_dir, filename)
                            
                            # Save image file
                            try:
                                with open(output_path, "wb") as f:
                                    f.write(img_data)
                            except Exception:
                                continue
                            
                            # Calculate relative path for static serving
                            try:
                                # The backend serves the uploads/ folder at /uploads
                                # output_dir is .../uploads/diagrams/{notebookId}
                                # We need the path relative to the uploads folder itself
                                # Find the uploads directory (parent of diagrams dir)
                                uploads_dir = output_dir
                                while os.path.basename(uploads_dir) != "uploads" and uploads_dir != os.path.dirname(uploads_dir):
                                    uploads_dir = os.path.dirname(uploads_dir)
                                
                                if os.path.basename(uploads_dir) == "uploads":
                                    relative_path = os.path.relpath(output_path, uploads_dir)
                                else:
                                    # Fallback: construct path directly
                                    relative_path = f"diagrams/{notebook_id}/{filename}"
                                
                                relative_path = relative_path.replace("\\", "/")
                                # Final path: /uploads/diagrams/notebook_id/filename
                                relative_path = f"/uploads/{relative_path}"
                            except Exception:
                                relative_path = f"/uploads/diagrams/{notebook_id}/{filename}"
                            
                            # Get image dimensions and position
                            try:
                                rect = page.get_image_bbox(img)
                            except Exception:
                                # Use default bounding box if extraction fails
                                rect = fitz.Rect(0, 0, pix.width, pix.height)
                            
                            # Classify image type based on dimensions and aspect ratio
                            try:
                                aspect_ratio = pix.width / pix.height if pix.height > 0 else 1.0
                                if aspect_ratio > 3 or aspect_ratio < 0.33:
                                    image_type = "chart"
                                elif pix.width > 500 and pix.height > 500:
                                    image_type = "diagram"
                                elif 0.8 < aspect_ratio < 1.2:
                                    image_type = "illustration"
                                else:
                                    image_type = "other"
                            except Exception:
                                image_type = "other"
                            
                            # Calculate confidence based on size and quality
                            try:
                                confidence = 0.5
                                if pix.width > 200 and pix.height > 200:
                                    confidence += 0.2
                                if 0.5 < aspect_ratio < 2.0:
                                    confidence += 0.2
                                confidence = min(confidence, 1.0)
                            except Exception:
                                confidence = 0.5
                            
                            # Calculate position on page
                            try:
                                page_width = page.rect.width
                                page_height = page.rect.height
                                center_x = rect.x0 + (rect.width / 2)
                                center_y = rect.y0 + (rect.height / 2)
                                
                                x_ratio = center_x / page_width if page_width > 0 else 0.5
                                y_ratio = center_y / page_height if page_height > 0 else 0.5
                                
                                if x_ratio < 0.33:
                                    horizontal = "left"
                                elif x_ratio > 0.67:
                                    horizontal = "right"
                                else:
                                    horizontal = "center"
                                
                                if y_ratio < 0.33:
                                    vertical = "top"
                                elif y_ratio > 0.67:
                                    vertical = "bottom"
                                else:
                                    vertical = "middle"
                                
                                position_on_page = f"{vertical}-{horizontal}"
                            except Exception:
                                position_on_page = "center-middle"
                            
                            # Extract page text for context and heading generation
                            context_text = ""
                            derived_heading = f"{original_name} - Page {page_num + 1}, Image {img_index + 1}"
                            try:
                                page_text = page.get_text("text")
                                if page_text:
                                    context_text = page_text.strip()[:2000]  # Store up to 2000 chars of page text
                                
                                # Try to derive a meaningful heading from text near the image
                                # Get text blocks with position info
                                text_blocks = page.get_text("blocks")
                                if text_blocks and rect:
                                    # Find text blocks that are close to (especially above) the image
                                    candidate_headings = []
                                    img_top = rect.y0
                                    img_center_x = rect.x0 + rect.width / 2
                                    
                                    for block in text_blocks:
                                        # block format: (x0, y0, x1, y1, text, block_no, block_type)
                                        if len(block) < 5 or block[6] != 0:  # Skip non-text blocks
                                            continue
                                        block_text = block[4].strip()
                                        if not block_text or len(block_text) < 3:
                                            continue
                                        
                                        block_y1 = block[3]  # bottom of text block
                                        block_y0 = block[1]  # top of text block
                                        block_center_x = (block[0] + block[2]) / 2
                                        
                                        # Text blocks ABOVE the image (within 150 pts)
                                        if block_y1 <= img_top and (img_top - block_y1) < 150:
                                            # Prefer shorter text (likely a heading/caption)
                                            # and text that's horizontally aligned with the image
                                            x_distance = abs(block_center_x - img_center_x)
                                            y_distance = img_top - block_y1
                                            
                                            # Score: closer = better, shorter = better (likely a title)
                                            text_len = len(block_text)
                                            score = 100 - y_distance - x_distance * 0.5
                                            if text_len < 80:  # Short text = likely a heading
                                                score += 30
                                            if text_len < 40:
                                                score += 20
                                            
                                            candidate_headings.append((score, block_text))
                                        
                                        # Text blocks BELOW the image (captions, within 80 pts)
                                        elif block_y0 >= rect.y1 and (block_y0 - rect.y1) < 80:
                                            text_len = len(block_text)
                                            if text_len < 100:  # Likely a figure caption
                                                y_distance = block_y0 - rect.y1
                                                score = 80 - y_distance
                                                if block_text.lower().startswith(("fig", "figure", "diagram", "chart")):
                                                    score += 40  # Boost figure captions
                                                candidate_headings.append((score, block_text))
                                    
                                    if candidate_headings:
                                        # Sort by score (highest first) and pick the best
                                        candidate_headings.sort(key=lambda x: x[0], reverse=True)
                                        best_heading = candidate_headings[0][1]
                                        # Clean up the heading
                                        best_heading = best_heading.replace('\n', ' ').strip()
                                        if len(best_heading) > 120:
                                            best_heading = best_heading[:120] + "..."
                                        if len(best_heading) >= 3:
                                            derived_heading = best_heading
                                
                            except Exception:
                                # If text extraction fails, keep the generic heading
                                pass
                            
                            # Create image data object
                            image_data = {
                                "notebookId": notebook_id,
                                "documentId": document_id,
                                "userId": user_id,
                                "heading": derived_heading,
                                "pageNumber": page_num + 1,
                                "imagePath": relative_path,
                                "boundingBox": {
                                    "x0": float(rect.x0),
                                    "y0": float(rect.y0),
                                    "x1": float(rect.x1),
                                    "y1": float(rect.y1),
                                    "width": float(rect.width),
                                    "height": float(rect.height)
                                },
                                "imageType": image_type,
                                "confidence": float(confidence),
                                "contextText": context_text,
                                "spatialProximity": {
                                    "positionOnPage": position_on_page,
                                    "textDensity": 0
                                }
                            }
                            
                            extracted_images.append(image_data)
                            
                            # Clean up
                            pix = None
                            
                        except Exception:
                            # Continue with other images if one fails
                            continue
                            
                except Exception:
                    # Continue with other pages if one fails
                    continue
                    
        except Exception:
            # Continue with document even if page processing fails
            pass
        
        # Close document
        try:
            doc.close()
        except Exception:
            pass
        
        # Return clean JSON response
        return {
            "success": True,
            "images": extracted_images,
            "totalImages": len(extracted_images)
        }
        
    except Exception as e:
        # Catch any unexpected errors
        return {
            "success": False,
            "error": str(e),
            "images": [],
            "totalImages": 0
        }

def main():
    """Main function to handle command line arguments"""
    try:
        # Check arguments (expecting 6: script + 5 args)
        if len(sys.argv) < 6:
            result = {
                "success": False,
                "error": "Usage: python extract_images.py <pdf_path> <output_dir> <notebook_id> <document_id> <user_id> [original_name]",
                "images": [],
                "totalImages": 0
            }
            print(json.dumps(result))
            sys.exit(1)
        
        # Parse arguments
        pdf_path = sys.argv[1]
        output_dir = sys.argv[2]
        notebook_id = sys.argv[3]
        document_id = sys.argv[4]
        user_id = sys.argv[5]
        original_name = sys.argv[6] if len(sys.argv) > 6 else "unknown.pdf"
        
        # Extract images
        result = extract_images_from_pdf(pdf_path, output_dir, notebook_id, document_id, user_id, original_name)
        
        # Output JSON result (no logging, clean output only)
        print(json.dumps(result))
        
        # Exit with appropriate code
        sys.exit(0 if result["success"] else 1)
        
    except Exception as e:
        # Last resort error handling
        result = {
            "success": False,
            "error": f"Script error: {str(e)}",
            "images": [],
            "totalImages": 0
        }
        print(json.dumps(result))
        sys.exit(1)

if __name__ == "__main__":
    main()
