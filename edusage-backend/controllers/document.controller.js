const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const WordExtractor = require("word-extractor");

const Document = require("../models/Document.model");
const Diagram = require("../models/Diagram.model");
const Activity = require("../models/Activity.model");
const chunkText = require("../services/textChunker");
const embedText = require("../services/embedding.service");
const chroma = require("../services/chroma.client");
const pymupdfExtractor = require("../services/pymupdfExtractor.service");
const spatialLinkingService = require("../services/spatialLinking.service");

async function extractDiagramsFromPdf({ filePath, notebookId, documentId, userId, originalName }) {
  console.log("Starting PyMuPDF diagram extraction for:", originalName);
  
  try {
    // Use PyMuPDF extractor for image extraction
    const extractedImages = await pymupdfExtractor.extractImagesFromPDF({
      filePath,
      notebookId,
      documentId,
      userId,
      originalName
    });

    console.log(`PyMuPDF extraction found ${extractedImages.length} images`);

    // Save extracted images to database
    for (const imageData of extractedImages) {
      try {
        await Diagram.create(imageData);
        console.log(`Saved diagram: ${imageData.heading}`);
      } catch (saveError) {
        console.warn(`Failed to save diagram: ${saveError.message}`);
      }
    }

    console.log(`Successfully saved ${extractedImages.length} diagrams to database`);
    return extractedImages;
    
  } catch (error) {
    console.error("PyMuPDF diagram extraction failed:", error.message);
    // No fallback - if PyMuPDF fails, we log the error but don't crash
    console.log("Diagram extraction completed with errors");
    return [];
  }
}

async function fallbackDiagramExtraction({ filePath, notebookId, documentId, userId, originalName }) {
  console.log(" Using fallback diagram extraction for:", originalName);
  
  try {
    const diagramsDir = path.join(__dirname, "..", "uploads", "diagrams", String(notebookId));
    fs.mkdirSync(diagramsDir, { recursive: true });

    const data = await pdfParse(fs.readFileSync(filePath));
    const pageCount = data.numpages || 0;

    for (let page = 0; page < pageCount; page++) {
      try {
        const outputFileName = `${path.basename(filePath, '.pdf')}_page_${page + 1}.png`;
        const outputPath = path.join(diagramsDir, outputFileName);
        
        // Try to use ImageMagick convert command if available
        try {
          const possiblePaths = [
            '"C:\\Program Files\\ImageMagick-7.1.2-Q16-HDRI\\convert.exe"',
            '"C:\\Program Files\\ImageMagick-7.1.2-Q16-HDRI\\magick.exe"',
            '"C:\\Program Files\\ImageMagick-7.1.1-Q16-HDRI\\convert.exe"',
            '"C:\\Program Files\\ImageMagick-7.1.1-Q16-HDRI\\magick.exe"',
            '"C:\\Program Files (x86)\\ImageMagick-7.1.2-Q16-HDRI\\convert.exe"',
            '"C:\\Program Files (x86)\\ImageMagick-7.1.2-Q16-HDRI\\magick.exe"',
            '"C:\\Program Files (x86)\\ImageMagick-7.1.1-Q16-HDRI\\convert.exe"',
            '"C:\\Program Files (x86)\\ImageMagick-7.1.1-Q16-HDRI\\magick.exe"',
            'convert', // fallback to PATH
            'magick'   // fallback to PATH
          ];
          
          let convertSuccess = false;
          for (const convertPath of possiblePaths) {
            try {
              await execPromise(`${convertPath} -density 150 -quality 90 "${filePath}[${page}]" "${outputPath}"`);
              convertSuccess = true;
              break;
            } catch (err) {
              continue; // try next path
            }
          }
          
          if (!convertSuccess) {
            throw new Error('ImageMagick convert command not found');
          }
          
          const relativePath = outputPath
            .replace(path.join(__dirname, ".."), "")
            .replace(/\\/g, "/");

          const heading = `${originalName} - Page ${page + 1}`;

          await Diagram.create({
            notebookId,
            documentId,
            userId,
            heading,
            pageNumber: page + 1,
            imagePath: relativePath.startsWith("/") ? relativePath : `/${relativePath}`,
            imageType: 'illustration',
            confidence: 0.3,
            spatialProximity: {
              positionOnPage: 'center',
              textDensity: 0
            }
          });
        } catch (convertErr) {
          console.warn("ImageMagick not available or conversion failed for page", page + 1, convertErr.message);
        }
      } catch (err) {
        console.warn("Failed to extract diagram for page", page + 1, err.message);
      }
    }
  } catch (err) {
    console.warn("Fallback diagram extraction failed", err.message);
  }
}

/**
 * Process a single file: extract text, save to DB, embed, store in ChromaDB.
 * Reusable by both single and batch upload handlers.
 */
async function processOneFile({ file, notebookId, userId }) {
  const filePath = file.path;
  console.log(`[UPLOAD] Processing file: ${file.originalname} (${file.mimetype}, ${file.size} bytes)`);

  try {
    /* -------- TEXT EXTRACTION -------- */
    let extractedText = "";
    const ext = path.extname(file.originalname).toLowerCase();

    if (file.mimetype === "application/pdf" || ext === ".pdf") {
      const data = await pdfParse(fs.readFileSync(filePath));
      extractedText = data.text;
      console.log(`[UPLOAD] PDF extraction: ${data.numpages} pages, ${extractedText.length} chars`);

    } else if (ext === ".docx" || file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const result = await mammoth.extractRawText({ path: filePath });
      extractedText = result.value;
      console.log(`[UPLOAD] DOCX extraction: ${extractedText.length} chars`);

    } else if (ext === ".doc" || file.mimetype === "application/msword") {
      const extractor = new WordExtractor();
      const extracted = await extractor.extract(filePath);
      extractedText = extracted.getBody();
      console.log(`[UPLOAD] DOC extraction: ${extractedText?.length || 0} chars`);

    } else if (file.mimetype === "text/plain" || ext === ".txt") {
      extractedText = fs.readFileSync(filePath, "utf-8");
      console.log(`[UPLOAD] TXT extraction: ${extractedText.length} chars`);

    } else {
      throw new Error(`Unsupported file type: ${file.mimetype} (${ext})`);
    }

    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error("No text content found in document");
    }

    /* -------- SAVE DOCUMENT -------- */
    const document = await Document.create({
      notebookId,
      userId,
      filename: file.originalname,
      fileType: file.mimetype,
      textContent: extractedText
    });
    console.log(`[UPLOAD] Document saved: ${document._id}`);

    /* -------- DIAGRAM EXTRACTION (PDF only) -------- */
    const isPdf = file.mimetype === "application/pdf" || ext === ".pdf";
    if (isPdf) {
      console.log(`[UPLOAD] Starting diagram extraction...`);
      try {
        await extractDiagramsFromPdf({
          filePath,
          notebookId,
          documentId: document._id,
          userId,
          originalName: file.originalname,
        });
        console.log(`[UPLOAD] Diagram extraction completed`);
      } catch (diagramErr) {
        console.error(`[UPLOAD] Diagram extraction failed (non-blocking):`, diagramErr.message);
      }
    }

    /* -------- CHUNKING -------- */
    const chunks = chunkText(extractedText);
    console.log(`[UPLOAD] ${chunks.length} chunks created`);

    if (chunks.length === 0) {
      throw new Error("No usable text chunks found in document");
    }

    /* -------- EMBEDDINGS -------- */
    const embeddings = await embedText(chunks);
    if (embeddings.length !== chunks.length) {
      throw new Error("Embedding generation failed for some chunks");
    }

    /* -------- STORE IN CHROMA -------- */
    const collection = await chroma.getOrCreateCollection({
      name: `notebook_${notebookId}`
    });

    await collection.add({
      ids: chunks.map((_, i) => `${document._id}_${i}`),
      documents: chunks,
      embeddings: embeddings,
      metadatas: chunks.map((_, i) => ({
        notebookId,
        documentId: document._id.toString(),
        filename: file.originalname,
        chunkIndex: i,
        chunkId: `${document._id}_${i}`
      }))
    });
    console.log(`[UPLOAD] ChromaDB storage complete`);

    /* -------- SPATIAL LINKING (PDF, non-blocking) -------- */
    if (isPdf) {
      setTimeout(async () => {
        try {
          await spatialLinkingService.linkImagesToTextChunks(notebookId, document._id);
          console.log(`[UPLOAD] Spatial linking completed for ${file.originalname}`);
        } catch (linkingError) {
          console.error(`[UPLOAD] Spatial linking failed:`, linkingError.message);
        }
      }, 3000);
    }

    /* -------- CLEANUP FILE -------- */
    fs.unlink(filePath, () => {
      console.log(`[UPLOAD] Cleaned up: ${file.originalname}`);
    });

    return {
      success: true,
      document: {
        id: document._id,
        filename: document.filename,
        fileType: document.fileType,
        notebookId: document.notebookId,
        chunkCount: chunks.length,
        createdAt: document.createdAt
      }
    };

  } catch (error) {
    console.error(`[UPLOAD ERROR] Failed to process ${file.originalname}:`, error.message);
    
    // Cleanup file on error
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, () => {});
    }

    return {
      success: false,
      filename: file.originalname,
      error: error.message
    };
  }
}

/**
 * Single file upload (backward compatible).
 */
exports.uploadDocument = async (req, res) => {
  console.log(`[UPLOAD] Single file upload: ${req.file?.originalname}`);
  
  const { notebookId } = req.params;

  if (!notebookId) {
    return res.status(400).json({ message: "notebookId is required" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const result = await processOneFile({
    file: req.file,
    notebookId,
    userId: req.userId
  });

  if (result.success) {
    res.status(201).json({
      message: "Document uploaded and processed successfully",
      document: result.document
    });
  } else {
    res.status(500).json({
      message: "Failed to process document",
      error: result.error
    });
  }
};

/**
 * Batch upload: process multiple files sequentially.
 */
exports.uploadDocuments = async (req, res) => {
  const { notebookId } = req.params;

  if (!notebookId) {
    return res.status(400).json({ message: "notebookId is required" });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  console.log(`[UPLOAD] Batch upload: ${req.files.length} files for notebook ${notebookId}`);

  const results = [];
  const errors = [];

  for (let i = 0; i < req.files.length; i++) {
    const file = req.files[i];
    console.log(`[UPLOAD] Processing file ${i + 1}/${req.files.length}: ${file.originalname}`);

    const result = await processOneFile({
      file,
      notebookId,
      userId: req.userId
    });

    if (result.success) {
      results.push(result.document);
    } else {
      errors.push({ filename: result.filename, error: result.error });
    }
  }

  const totalSuccess = results.length;
  const totalErrors = errors.length;

  console.log(`[UPLOAD] Batch complete: ${totalSuccess} success, ${totalErrors} errors`);

  res.status(totalSuccess > 0 ? 201 : 500).json({
    message: totalErrors === 0 
      ? `All ${totalSuccess} documents uploaded and processed successfully`
      : `${totalSuccess} of ${totalSuccess + totalErrors} documents processed successfully`,
    documents: results,
    errors: errors.length > 0 ? errors : undefined,
    totalProcessed: totalSuccess,
    totalFailed: totalErrors
  });
};


// Get all documents for a given notebook for the current user
exports.getDocumentsForNotebook = async (req, res) => {
  const { notebookId } = req.params;

  try {
    const documents = await Document.find({
      notebookId,
      userId: req.userId,
    })
      .sort({ createdAt: -1 })
      .select("_id filename fileType createdAt updatedAt");

    return res.json(documents);
  } catch (err) {
    console.error("Failed to load documents for notebook", notebookId, err.message);
    return res.status(500).json({ message: "Failed to load documents" });
  }
};

// Get all diagrams for a given notebook for the current user
exports.getDiagramsForNotebook = async (req, res) => {
  const { notebookId } = req.params;

  try {
    const diagrams = await Diagram.find({
      notebookId,
      userId: req.userId,
    })
      .sort({ pageNumber: 1 })
      .select("_id heading pageNumber imagePath createdAt");

    const payload = diagrams.map((d) => ({
      _id: d._id,
      heading: d.heading,
      pageNumber: d.pageNumber,
      imageUrl: d.imagePath,
      createdAt: d.createdAt,
    }));

    return res.json(payload);
  } catch (err) {
    console.error("Failed to load diagrams for notebook", notebookId, err.message);
    return res.status(500).json({ message: "Failed to load diagrams" });
  }
};

// Get all documents for the current user across notebooks
// Get all documents for the current user across notebooks
exports.getAllDocumentsForUser = async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .populate("notebookId", "title")
      .select("_id filename fileType notebookId createdAt updatedAt");

    return res.json(documents);
  } catch (err) {
    console.error(
      "Failed to load documents for user",
      req.userId,
      err.message
    );
    return res.status(500).json({ message: "Failed to load documents" });
  }
};