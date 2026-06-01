const fs = require("fs");
const path = require("path");

// Load PDF.js with standard import paths
const pdfjsLib = require("pdfjs-dist");
const sharp = require("sharp");

// Set up PDF.js worker using standard build path
pdfjsLib.GlobalWorkerOptions.workerSrc = require.resolve("pdfjs-dist/build/pdf.worker.js");

console.log("✅ PDF.js v2.16.105 loaded successfully");
console.log("✅ Sharp loaded successfully");

class AdvancedPDFExtractor {
  constructor() {
    this.minImageSize = 50; // Minimum image size to consider (width/height in pixels)
    this.maxImageSize = 2000; // Maximum image size to prevent memory issues
  }

  async extractImagesFromPDF({ filePath, notebookId, documentId, userId, originalName }) {
    console.log(" Starting PDF image extraction:", originalName);
    
    try {
      const diagramsDir = path.join(__dirname, "..", "uploads", "diagrams", String(notebookId));
      fs.mkdirSync(diagramsDir, { recursive: true });

      // Read PDF file
      const pdfData = fs.readFileSync(filePath);
      const loadingTask = pdfjsLib.getDocument({ data: pdfData });
      const pdf = await loadingTask.promise;
      
      const pageCount = pdf.numPages;
      console.log(` PDF has ${pageCount} pages`);

      const extractedImages = [];

      for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
        try {
          console.log(` Processing page ${pageNum}...`);
          const pageImages = await this.extractImagesFromPage({
            pdf,
            pageNum,
            documentId,
            userId,
            originalName,
            diagramsDir
          });
          
          extractedImages.push(...pageImages);
        } catch (pageError) {
          console.warn(` Failed to extract images from page ${pageNum}:`, pageError.message);
        }
      }

      console.log(` Total images extracted: ${extractedImages.length}`);
      return extractedImages;

    } catch (error) {
      console.error("PDF image extraction failed:", error);
      throw error;
    }
  }

  async extractImagesFromPage({ pdf, pageNum, documentId, userId, originalName, diagramsDir }) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better quality
    
    // Get page dimensions
    const pageWidth = viewport.width;
    const pageHeight = viewport.height;
    
    console.log(` Page ${pageNum} dimensions: ${pageWidth}x${pageHeight}`);

    // Get operator list to find images
    const operatorList = await page.getOperatorList();
    const images = [];

    // Parse operator list for image objects
    const imageObjects = this.parseOperatorListForImages(operatorList);
    
    console.log(` Found ${imageObjects.length} potential images on page ${pageNum}`);

    // Extract each image
    for (let i = 0; i < imageObjects.length; i++) {
      try {
        const imageObj = imageObjects[i];
        const imageData = await this.extractImageObject(page, imageObj, i);
        
        if (imageData) {
          // Save image to file
          const fileName = `${path.basename(originalName, '.pdf')}_page_${pageNum}_img_${i + 1}.png`;
          const outputPath = path.join(diagramsDir, fileName);
          
          // Process and save image with sharp
          await sharp(imageData.buffer, {
            raw: {
              width: imageData.width,
              height: imageData.height,
              channels: imageData.channels || 4
            }
          })
          .png({ quality: 90 })
          .toFile(outputPath);

          // Calculate relative path
          const relativePath = outputPath
            .replace(path.join(__dirname, ".."), "")
            .replace(/\\/g, "/");

          // Determine image type based on characteristics
          const imageType = this.classifyImageType(imageData);
          
          // Calculate position on page
          const positionOnPage = this.calculatePositionOnPage(
            imageData.boundingBox,
            pageWidth,
            pageHeight
          );

          images.push({
            notebookId: undefined, // Will be set by caller
            documentId,
            userId,
            heading: `${originalName} - Page ${pageNum}, Image ${i + 1}`,
            pageNumber: pageNum,
            imagePath: relativePath.startsWith("/") ? relativePath : `/${relativePath}`,
            boundingBox: {
              x0: imageData.boundingBox.x0,
              y0: imageData.boundingBox.y0,
              x1: imageData.boundingBox.x1,
              y1: imageData.boundingBox.y1,
              width: imageData.width,
              height: imageData.height
            },
            imageType,
            confidence: this.calculateImageConfidence(imageData),
            spatialProximity: {
              positionOnPage,
              textDensity: 0 // Will be calculated later
            }
          });
        }
      } catch (imgError) {
        console.warn(` Failed to extract image ${i + 1} from page ${pageNum}:`, imgError.message);
      }
    }

    // If no images found through operator list, skip rendering approach since Canvas is not available
    if (images.length === 0) {
      console.log(` No images found through operator list on page ${pageNum} (Canvas not available for rendering fallback)`);
    }

    return images;
  }

  parseOperatorListForImages(operatorList) {
    const images = [];
    const args = operatorList.argsArray;
    
    for (let i = 0; i < operatorList.fnArray.length; i++) {
      const fn = operatorList.fnArray[i];
      const fnArgs = args[i];
      
      // Look for image-related operators
      if (fn === pdfjsLib.OPS.paintImageXObject || 
          fn === pdfjsLib.OPS.paintInlineImageXObject) {
        
        const imageObj = {
          operator: fn,
          args: fnArgs,
          index: i
        };
        
        images.push(imageObj);
      }
    }
    
    return images;
  }

  async extractImageObject(page, imageObj, index) {
    try {
      // Get the image object from the page's resources
      const resources = await page.getResources();
      const xObjects = resources.get('XObject') || {};
      
      let image;
      if (imageObj.operator === pdfjsLib.OPS.paintImageXObject) {
        const imageName = imageObj.args[0];
        image = xObjects.get(imageName);
      } else if (imageObj.operator === pdfjsLib.OPS.paintInlineImageXObject) {
        image = imageObj.args[0];
      }
      
      if (!image) {
        return null;
      }

      // Get image dimensions and data
      const width = image.width;
      const height = image.height;
      
      // Skip if image is too small
      if (width < this.minImageSize || height < this.minImageSize) {
        console.log(` Skipping small image: ${width}x${height}`);
        return null;
      }

      // Get image data
      const imageData = await image.getData();
      
      // Estimate bounding box (this is approximate)
      const viewport = page.getViewport({ scale: 2.0 });
      const boundingBox = {
        x0: viewport.width * 0.1, // Estimate position
        y0: viewport.height * 0.1,
        x1: viewport.width * 0.9,
        y1: viewport.height * 0.9
      };

      return {
        buffer: Buffer.from(imageData),
        width,
        height,
        channels: 4, // RGBA
        boundingBox
      };
      
    } catch (error) {
      console.warn(` Error extracting image object ${index}:`, error.message);
      return null;
    }
  }

  classifyImageType(imageData) {
    const { width, height } = imageData;
    const aspectRatio = width / height;
    
    // Simple heuristics for image classification
    if (aspectRatio > 3 || aspectRatio < 0.33) {
      return 'chart'; // Wide or tall images are likely charts
    } else if (width > 500 && height > 500) {
      return 'diagram'; // Large square images are likely diagrams
    } else if (aspectRatio > 0.8 && aspectRatio < 1.2) {
      return 'illustration'; // Square-ish images
    } else {
      return 'other';
    }
  }

  calculateImageConfidence(imageData) {
    let confidence = 0.5;
    
    // Increase confidence based on size
    if (imageData.width > 200 && imageData.height > 200) {
      confidence += 0.2;
    }
    
    // Increase confidence based on aspect ratio
    const aspectRatio = imageData.width / imageData.height;
    if (aspectRatio > 0.5 && aspectRatio < 2.0) {
      confidence += 0.2;
    }
    
    return Math.min(confidence, 1.0);
  }

  calculatePositionOnPage(boundingBox, pageWidth, pageHeight) {
    const centerX = (boundingBox.x0 + boundingBox.x1) / 2;
    const centerY = (boundingBox.y0 + boundingBox.y1) / 2;
    
    const xRatio = centerX / pageWidth;
    const yRatio = centerY / pageHeight;
    
    let horizontal = 'center';
    let vertical = 'middle';
    
    if (xRatio < 0.33) horizontal = 'left';
    else if (xRatio > 0.67) horizontal = 'right';
    
    if (yRatio < 0.33) vertical = 'top';
    else if (yRatio > 0.67) vertical = 'bottom';
    
    return `${vertical}-${horizontal}`;
  }

  async linkImagesToTextChunks(images, textChunks, notebookId) {
    console.log(` Linking ${images.length} images to ${textChunks.length} text chunks...`);
    
    for (const image of images) {
      const nearbyChunks = this.findNearbyTextChunks(image, textChunks);
      image.linkedChunks = nearbyChunks.map(chunk => chunk.id);
      image.spatialProximity.nearbyTextChunks = nearbyChunks.map(chunk => chunk.text.substring(0, 100));
      image.spatialProximity.textDensity = nearbyChunks.length;
      
      // Update the image in database
      if (image._id) {
        await Diagram.findByIdAndUpdate(image._id, {
          linkedChunks: image.linkedChunks,
          spatialProximity: image.spatialProximity
        });
      }
    }
    
    console.log(` Image-to-text linking complete`);
  }

  findNearbyTextChunks(image, textChunks, maxDistance = 2) {
    const nearbyChunks = [];
    
    for (const chunk of textChunks) {
      if (chunk.pageNumber === image.pageNumber) {
        // Simple proximity check - can be enhanced with actual spatial data
        const chunkStart = chunk.chunkIndex || 0;
        const imagePosition = image.boundingBox.x0; // Simplified position
        
        if (Math.abs(chunkStart - imagePosition) <= maxDistance) {
          nearbyChunks.push(chunk);
        }
      }
    }
    
    return nearbyChunks;
  }
}

module.exports = new AdvancedPDFExtractor();
