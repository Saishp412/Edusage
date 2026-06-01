# PDF Image Extraction and Spatial Linking Feature

## Overview

This feature enhances the EduSage platform with the ability to extract diagrams and images from uploaded PDFs, link them spatially to text content, and retrieve relevant images during query processing.

## Features Implemented

### 1. Advanced PDF Image Extraction
- **Service**: `advancedPDFExtractor.service.js`
- **Technology**: PDF.js v2.16.105, Sharp
- **Capabilities**:
  - Extract individual images from PDF pages using PDF.js operator list parsing
  - Automatic image classification (diagram, chart, illustration, etc.)
  - Bounding box detection and spatial metadata extraction
  - Confidence scoring for extracted images
  - High-quality image processing with Sharp
  - Node.js compatible without browser dependencies
  - Standard CommonJS module system

### 2. Enhanced Database Schema
- **Model**: `Diagram.model.js`
- **New Fields**:
  - `boundingBox`: Spatial coordinates (x0, y0, x1, y1, width, height)
  - `imageType`: Classification (diagram, chart, table, illustration, screenshot, other)
  - `confidence`: Extraction confidence score (0-1)
  - `linkedChunks`: References to associated text chunks
  - `spatialProximity`: Text density and position information

### 3. Spatial Linking Service
- **Service**: `spatialLinking.service.js`
- **Functionality**:
  - Links extracted images to nearby text chunks based on page and position
  - Calculates relevance scores for image-text relationships
  - Retrieves relevant images for user queries using semantic similarity
  - Enhances context with image references for better responses

### 4. Enhanced Query Processing
- **Controller**: `query.controller.js`
- **Enhancements**:
  - Retrieves relevant images during query processing
  - Enhances context with image references
  - Returns both text answer and relevant images in response
  - Supports both topic-based and fallback query processing

### 5. Updated Document Processing
- **Controller**: `document.controller.js`
- **Changes**:
  - Integrates advanced PDF extraction with existing text processing
  - Performs spatial linking after document upload
  - Maintains backward compatibility with existing functionality

## API Changes

### Query Response Format
The query endpoint now returns an additional `relevantImages` field:

```json
{
  "answer": "Generated answer text...",
  "sources": [...],
  "relevantImages": [
    {
      "id": "diagram_id",
      "heading": "Diagram title",
      "pageNumber": 1,
      "imageUrl": "/uploads/diagrams/notebook_id/image.png",
      "imageType": "diagram",
      "confidence": 0.85,
      "relevanceScore": 2.3
    }
  ],
  "queryTopic": "...",
  "queryConfidence": 0.9
}
```

### Diagram Retrieval
New endpoint to get all diagrams for a notebook:
```
GET /api/documents/:notebookId/diagrams
```

## Installation and Setup

### New Dependencies
```bash
npm install pdfjs-dist@2.16.105 sharp@0.34.5 --save
```

**Important**: Use standard import paths for PDF.js v2.16.105:
- `require('pdfjs-dist')` for the main library
- `require.resolve('pdfjs-dist/build/pdf.worker.js')` for the worker

**Note**: PDF.js v2.16.105 has built-in Node.js compatibility without legacy paths

### Environment Variables
No new environment variables required. Uses existing MongoDB connection.

## Usage

### For PDF Upload
1. Upload a PDF through the existing document upload endpoint
2. The system automatically extracts images in the background
3. Images are linked to text chunks spatially
4. Extracted images are stored with metadata in the database

### For Query Processing
1. When users ask questions, the system:
   - Retrieves relevant text chunks using semantic search
   - Finds images linked to those chunks
   - Also finds images on the same pages as relevant chunks
   - Ranks images by relevance score
   - Includes top 3 most relevant images in response

### Frontend Integration
The frontend should:
1. Display the `relevantImages` array when available
2. Show image thumbnails with metadata (page number, type, confidence)
3. Allow users to click on images to view full size
4. Display relevance scores to help users understand image importance

## Technical Details

### Image Extraction Process
1. **PDF Parsing**: Uses PDF.js to parse PDF structure
2. **Operator Analysis**: Analyzes operator list for image objects
3. **Image Extraction**: Extracts image data and saves as PNG
4. **Metadata Generation**: Creates bounding box, type, and confidence data
5. **Database Storage**: Saves to Diagram collection with full metadata

### Spatial Linking Algorithm
1. **Chunk Position Estimation**: Estimates where text chunks appear on pages
2. **Proximity Calculation**: Calculates distance between images and chunks
3. **Link Creation**: Creates links for nearby chunks (within threshold)
4. **Text Density**: Calculates text density around each image
5. **Position Classification**: Classifies image position (top, middle, bottom, etc.)

### Query-Time Image Retrieval
1. **Semantic Search**: Uses question embedding to find relevant text chunks
2. **Linked Images**: Finds images directly linked to relevant chunks
3. **Page-Based Search**: Finds images on same pages as relevant chunks
4. **Relevance Scoring**: Scores images based on multiple factors
5. **Top-K Selection**: Returns top 3 most relevant images

## Error Handling and Fallbacks

### PDF Extraction Failures
- Falls back to ImageMagick-based page conversion
- Gracefully handles corrupted or password-protected PDFs
- Logs errors without breaking document processing

### Spatial Linking Failures
- Continues with text-only processing if linking fails
- Uses estimated positions when exact coordinates unavailable
- Maintains system stability during edge cases

### Query-Time Failures
- Returns text-only responses if image retrieval fails
- Logs warnings for debugging
- Preserves existing functionality

## Performance Considerations

### Memory Management
- Limits image size to prevent memory issues
- Processes images asynchronously to avoid blocking
- Uses streaming for large file operations

### Scalability
- Indexes database fields for efficient queries
- Limits number of images returned per query
- Uses background processing for extraction

### Caching
- Caches extracted images to avoid reprocessing
- Stores embeddings for efficient similarity search
- Maintains spatial relationships for quick retrieval

## Testing

### Test Files
- `test-image-extraction.js`: Comprehensive integration tests
- `test-dependencies.js`: Dependency loading verification

### Running Tests
```bash
node test-dependencies.js  # Test dependency loading
node test-image-extraction.js  # Run integration tests
```

## Future Enhancements

### Potential Improvements
1. **Advanced Image Classification**: Use ML models for better image type detection
2. **OCR Integration**: Extract text from images for better linking
3. **Interactive Diagrams**: Support for interactive elements in PDFs
4. **Vector Graphics**: Better handling of SVG and vector content
5. **Multi-page Diagrams**: Handle diagrams spanning multiple pages

### Performance Optimizations
1. **Parallel Processing**: Process multiple pages simultaneously
2. **GPU Acceleration**: Use GPU for image processing
3. **Smart Caching**: Implement intelligent cache invalidation
4. **Progressive Loading**: Load images progressively for better UX

## Troubleshooting

### Common Issues
1. **DOMMatrix Error**: Using browser build instead of legacy build
   - **Solution**: Use `require('pdfjs-dist/legacy/build/pdf.js')` instead of `require('pdfjs-dist')`
   
2. **PDF.js Worker Issues**: Ensure worker file is properly resolved
   - **Solution**: Use `require.resolve('pdfjs-dist/legacy/build/pdf.worker.js')`
   
3. **Memory Issues**: Large PDFs may cause memory problems
   - **Solution**: Adjust `maxImageSize` in the extractor or process pages in batches
   
4. **Sharp Installation**: May require additional system dependencies on some systems
   - **Solution**: Install build tools if needed

### DOMMatrix Error Specific Fix
If you encounter "DOMMatrix is not defined" error:
```javascript
// ❌ Wrong - Browser build
const pdfjsLib = require('pdfjs-dist');

// ❌ Wrong - Legacy paths (not needed for v2.16.105)
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.cjs');

// ✅ Correct - Standard PDF.js v2.16.105  
const pdfjsLib = require('pdfjs-dist');
pdfjsLib.GlobalWorkerOptions.workerSrc = require.resolve('pdfjs-dist/build/pdf.worker.js');
```

### Version Compatibility
- **Use PDF.js v2.16.105**: Stable version with good Node.js compatibility
- **Avoid legacy paths**: Not needed for v2.16.105
- **Standard imports**: Use `require('pdfjs-dist')` for simplicity and stability

### Debug Mode
Enable detailed logging by setting:
```bash
DEBUG=pdf-extraction:* node server.js
```

## Security Considerations

### File Safety
- Validates file types and sizes
- Sanitizes file paths
- Limits extraction to prevent resource exhaustion

### Data Privacy
- All processing happens server-side
- No external API calls for image processing
- Temporary files are cleaned up automatically

This feature seamlessly integrates with the existing EduSage platform while adding powerful image extraction and spatial linking capabilities.
