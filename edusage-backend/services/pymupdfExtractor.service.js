const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const util = require("util");

class PyMuPDFExtractor {
  constructor() {
    this.pythonScript = path.join(__dirname, "extract_images.py");
  }

  async extractImagesFromPDF({ filePath, notebookId, documentId, userId, originalName }) {
    try {
      // Create diagrams directory
      const diagramsDir = path.join(__dirname, "..", "uploads", "diagrams", String(notebookId));
      fs.mkdirSync(diagramsDir, { recursive: true });

      // Call Python script for PyMuPDF extraction
      const result = await this.callPythonScript({
        filePath,
        outputDir: diagramsDir,
        notebookId,
        documentId,
        userId,
        originalName
      });

      if (result.success) {
        console.log(`PyMuPDF extracted ${result.totalImages} images from ${originalName}`);
        return result.images.map(image => ({
          ...image,
          notebookId // Ensure notebookId is set
        }));
      } else {
        throw new Error(`PyMuPDF extraction failed: ${result.error}`);
      }
    } catch (error) {
      console.error("PyMuPDF image extraction failed:", error);
      throw error;
    }
  }

  async callPythonScript({ filePath, outputDir, notebookId, documentId, userId, originalName }) {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn("python", [
        this.pythonScript,
        filePath,
        outputDir,
        notebookId,
        documentId,
        userId,
        originalName
      ]);

      let stdout = "";
      let stderr = "";

      pythonProcess.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      pythonProcess.on("close", (code) => {
        // Always try to parse JSON, even if exit code is non-zero
        try {
          const trimmedOutput = stdout.trim();
          if (!trimmedOutput) {
            reject(new Error(`Python script produced no output. Exit code: ${code}. Stderr: ${stderr}`));
            return;
          }
          
          const result = JSON.parse(trimmedOutput);
          
          // Resolve with result even if extraction failed (let caller handle success/failure)
          resolve(result);
        } catch (parseError) {
          reject(new Error(`Failed to parse Python script output: ${parseError.message}. Output: ${stdout.substring(0, 200)}`));
        }
      });

      pythonProcess.on("error", (error) => {
        reject(new Error(`Failed to execute Python script: ${error.message}`));
      });

      // Set timeout to prevent hanging
      const timeout = setTimeout(() => {
        pythonProcess.kill();
        reject(new Error("Python script execution timed out after 60 seconds"));
      }, 60000);

      pythonProcess.on("close", () => {
        clearTimeout(timeout);
      });
    });
  }

  async linkImagesToTextChunks(images, textChunks, notebookId) {
    console.log(`Linking ${images.length} images to ${textChunks.length} text chunks...`);
    
    for (const image of images) {
      const nearbyChunks = this.findNearbyTextChunks(image, textChunks);
      image.linkedChunks = nearbyChunks.map(chunk => chunk.id);
      image.spatialProximity.nearbyTextChunks = nearbyChunks.map(chunk => chunk.text.substring(0, 100));
      image.spatialProximity.textDensity = nearbyChunks.length;
      
      // Update the image in database
      if (image._id) {
        const Diagram = require("../models/Diagram.model");
        await Diagram.findByIdAndUpdate(image._id, {
          linkedChunks: image.linkedChunks,
          spatialProximity: image.spatialProximity
        });
      }
    }
    
    console.log(`Image-to-text linking complete`);
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

module.exports = new PyMuPDFExtractor();
