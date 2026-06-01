# PyMuPDF Diagram Extraction Setup

## Overview

The diagram extraction system now uses PyMuPDF (Python) for reliable image extraction from PDF files. This replaces the previous PDF.js-based implementation which had compatibility issues.

## Architecture

```
Node.js Backend
├── document.controller.js (Main upload handler)
├── pymupdfExtractor.service.js (Node.js wrapper)
└── Python Script
    └── extract_images.py (PyMuPDF extraction logic)
```

## Installation

### 1. Install Python Dependencies

Run the provided batch script:
```bash
install_python_deps.bat
```

Or manually install:
```bash
pip install fitz==1.23.26 Pillow==10.4.0
```

### 2. Remove Old Dependencies (Optional)

The following Node.js packages are no longer needed:
- pdfjs-dist
- sharp

You can remove them with:
```bash
npm uninstall pdfjs-dist sharp
```

## How It Works

1. **Upload Process**: When a PDF is uploaded, the Node.js controller calls the PyMuPDF extractor
2. **Python Extraction**: The Python script uses PyMuPDF to extract all images from the PDF
3. **Image Processing**: Images are saved as PNG files with proper metadata
4. **Database Storage**: Image metadata is stored in MongoDB with bounding box information
5. **Spatial Linking**: Images are linked to nearby text chunks for context

## Python Script Details

### `extract_images.py`

- **Input**: PDF file path, output directory, metadata
- **Output**: Clean JSON with image data
- **Features**:
  - Extracts all images from PDF pages
  - Filters out small images (< 50px)
  - Converts CMYK to RGB
  - Calculates bounding boxes and positions
  - Classifies image types (diagram, chart, illustration)
  - Generates confidence scores

### Output Format

```json
{
  "success": true,
  "images": [
    {
      "notebookId": "notebook_123",
      "documentId": "doc_456", 
      "userId": "user_789",
      "heading": "document.pdf - Page 1, Image 1",
      "pageNumber": 1,
      "imagePath": "/uploads/diagrams/notebook_123/doc_page_1_img_1.png",
      "boundingBox": {
        "x0": 100,
        "y0": 200,
        "x1": 400,
        "y1": 500,
        "width": 300,
        "height": 300
      },
      "imageType": "diagram",
      "confidence": 0.8,
      "spatialProximity": {
        "positionOnPage": "center-middle",
        "textDensity": 0
      }
    }
  ],
  "totalImages": 1
}
```

## Testing

### Test the Python Script

```bash
python test_pymupdf.py
```

This will test the extraction with a sample PDF (place `test.pdf` in the backend directory).

### Test Full Integration

1. Upload a PDF through the web interface
2. Check the console logs for extraction messages
3. Verify images are saved to `uploads/diagrams/{notebookId}/`
4. Check MongoDB for diagram records

## Troubleshooting

### Python Not Found

```
ERROR: Python is not installed or not in PATH
```

**Solution**: Install Python 3.7+ and ensure it's in your system PATH

### Module Import Errors

```
ModuleNotFoundError: No module named 'fitz'
```

**Solution**: Run the dependency installation script:
```bash
install_python_deps.bat
```

### Permission Errors

```
PermissionError: [Errno 13] Permission denied
```

**Solution**: Ensure the backend has write permissions to the uploads directory

### PDF Processing Errors

```
PyMuPDF extraction failed: Invalid PDF file
```

**Solution**: Verify the PDF file is not corrupted and is a valid PDF format

## File Structure

```
edusage-backend/
├── services/
│   ├── pymupdfExtractor.service.js    # Node.js wrapper
│   └── extract_images.py              # Python extraction script
├── controllers/
│   └── document.controller.js         # Updated to use PyMuPDF
├── uploads/
│   └── diagrams/                      # Extracted images storage
├── requirements.txt                   # Python dependencies
├── install_python_deps.bat           # Installation script
└── test_pymupdf.py                   # Test script
```

## Advantages of PyMuPDF

1. **Better Image Extraction**: More reliable than PDF.js for complex PDFs
2. **No Browser Dependencies**: Pure Python implementation
3. **Accurate Bounding Boxes**: Better position detection
4. **Format Support**: Handles various image formats within PDFs
5. **Performance**: Faster processing for large PDFs
6. **Clean Output**: Structured JSON without logging noise

## Migration Notes

- Removed all PDF.js-related code
- Removed ImageMagick fallback
- Simplified error handling (no fallbacks)
- Clean JSON output from Python script
- Maintained existing database schema
- Preserved spatial linking functionality
