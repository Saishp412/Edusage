const pdfParse = require("pdf-parse");

/**
 * Enhanced PDF processor that extracts text with page information
 */
class EnhancedPDFProcessor {
  /**
   * Extract text with page information
   * @param {Buffer} pdfBuffer - PDF file buffer
   * @returns {Promise<Array>} Array of page objects with text and page number
   */
  static async extractTextWithPages(pdfBuffer) {
    try {
      const data = await pdfParse(pdfBuffer, {
        // Enable page-by-page parsing
        pagerender: function(pageData) {
          return pageData.getTextContent();
        }
      });

      // The standard pdf-parse doesn't provide page-by-page text easily
      // We'll use a workaround by parsing the full text and estimating page breaks
      
      const pageCount = data.numpages || 0;
      const fullText = data.text;
      
      // Estimate page breaks based on common PDF formatting
      // This is a heuristic approach - for precise page breaks, we'd need more advanced parsing
      const pages = this.splitTextIntoPages(fullText, pageCount);
      
      console.log(`[PDF PROCESSOR] Extracted ${pages.length} pages from ${pageCount} total pages`);
      
      return pages.map((pageText, index) => ({
        pageNumber: index + 1,
        text: pageText.trim(),
        wordCount: pageText.split(/\s+/).length
      }));
      
    } catch (error) {
      console.error(`[PDF PROCESSOR] Error extracting pages:`, error);
      // Fallback to single page extraction
      const data = await pdfParse(pdfBuffer);
      return [{
        pageNumber: 1,
        text: data.text,
        wordCount: data.text.split(/\s+/).length
      }];
    }
  }

  /**
   * Split full text into estimated pages
   * @param {string} fullText - Complete PDF text
   * @param {number} pageCount - Number of pages from PDF
   * @returns {Array} Array of page texts
   */
  static splitTextIntoPages(fullText, pageCount) {
    if (pageCount <= 1) {
      return [fullText];
    }

    // Enhanced page break patterns
    const pageBreakPatterns = [
      /\f/, // Form feed character
      /\n\s*\n\s*\n/, // Multiple newlines
      /\n\s*\d+\s*$/, // Page number at end
      /\n\s*Page\s+\d+/, // "Page X" pattern
      /\n\s*-\s*\d+\s*-/, // "- X -" page separator
      /\n\s*={3,}/, // Three or more equals (page separator)
      /\n\s*-+\s*\n/, // Line of dashes
    ];

    let pages = [];
    let currentPage = '';
    let lines = fullText.split('\n');
    
    // Estimate words per page with better accuracy
    const totalWords = fullText.split(/\s+/).length;
    const wordsPerPage = Math.ceil(totalWords / pageCount);
    
    let currentWordCount = 0;
    let currentPageNumber = 1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineWords = line.split(/\s+/).length;
      
      // Check if this line looks like a page break
      const isPageBreak = pageBreakPatterns.some(pattern => pattern.test(line)) ||
                         (currentWordCount + lineWords > wordsPerPage && line.trim().length === 0) ||
                         (currentWordCount > wordsPerPage * 0.8 && this.looksLikePageStart(line, currentPageNumber + 1));
      
      if (isPageBreak && currentPage.trim().length > 50 && pages.length < pageCount - 1) {
        pages.push({
          pageNumber: currentPageNumber++,
          text: currentPage.trim(),
          wordCount: currentWordCount
        });
        currentPage = line;
        currentWordCount = lineWords;
      } else {
        currentPage += (currentPage ? '\n' : '') + line;
        currentWordCount += lineWords;
      }
    }
    
    // Add the last page
    if (currentPage.trim().length > 0) {
      pages.push({
        pageNumber: currentPageNumber,
        text: currentPage.trim(),
        wordCount: currentWordCount
      });
    }
    
    // Ensure we have the right number of pages
    if (pages.length === 0) {
      pages = [{ pageNumber: 1, text: fullText, wordCount: totalWords }];
    } else if (pages.length < pageCount) {
      // Split the largest page if needed
      const largestPage = pages.reduce((max, page) => page.wordCount > max.wordCount ? page : max);
      const largestIndex = pages.indexOf(largestPage);
      
      if (largestPage.wordCount > wordsPerPage * 1.5) {
        const splitPoint = Math.floor(largestPage.text.length / 2);
        const firstHalf = largestPage.text.substring(0, splitPoint);
        const secondHalf = largestPage.text.substring(splitPoint);
        
        pages.splice(largestIndex, 1, {
          pageNumber: largestPage.pageNumber,
          text: firstHalf.trim(),
          wordCount: firstHalf.split(/\s+/).length
        });
        
        pages.splice(largestIndex + 1, 0, {
          pageNumber: largestPage.pageNumber + 1,
          text: secondHalf.trim(),
          wordCount: secondHalf.split(/\s+/).length
        });
      }
    }
    
    return pages.slice(0, pageCount);
  }

  /**
   * Check if a line looks like the start of a new page
   */
  static looksLikePageStart(line, expectedPageNumber) {
    const trimmedLine = line.trim();
    
    // Check for page number patterns
    const pagePatterns = [
      new RegExp(`^${expectedPageNumber}\\s+`, 'i'),
      new RegExp(`^Page\\s+${expectedPageNumber}`, 'i'),
      new RegExp(`^${expectedPageNumber}\\.`),
      new RegExp(`^\\(${expectedPageNumber}\\)`),
    ];
    
    return pagePatterns.some(pattern => pattern.test(trimmedLine)) ||
           (trimmedLine.length < 100 && /^[A-Z]/.test(trimmedLine)); // Short, capitalized lines might be titles
  }

  /**
   * Find which page(s) contain specific text
   * @param {Array} pages - Array of page objects
   * @param {string} searchText - Text to search for
   * @returns {Array} Array of page numbers containing the text
   */
  static findPagesForText(pages, searchText) {
    const searchLower = searchText.toLowerCase();
    const matchingPages = [];
    
    pages.forEach(page => {
      if (page.text.toLowerCase().includes(searchLower)) {
        matchingPages.push(page.pageNumber);
      }
    });
    
    return matchingPages;
  }

  /**
   * Enhanced chunk creation with page information
   * @param {Array} pages - Array of page objects
   * @param {number} chunkSize - Maximum words per chunk
   * @returns {Array} Array of chunks with page information
   */
  static createChunksWithPages(pages, chunkSize = 400) {
    const chunks = [];
    let currentChunk = {
      text: '',
      pages: new Set(),
      wordCount: 0
    };
    
    pages.forEach(page => {
      const pageWords = page.text.split(/\s+/);
      
      if (currentChunk.wordCount + pageWords.length <= chunkSize) {
        // Add entire page to current chunk
        currentChunk.text += (currentChunk.text ? '\n\n' : '') + page.text;
        currentChunk.pages.add(page.pageNumber);
        currentChunk.wordCount += pageWords.length;
      } else {
        // Save current chunk and start new one
        if (currentChunk.text.trim()) {
          chunks.push({
            text: currentChunk.text.trim(),
            pages: Array.from(currentChunk.pages).sort((a, b) => a - b),
            wordCount: currentChunk.wordCount
          });
        }
        
        // Start new chunk with this page
        currentChunk = {
          text: page.text,
          pages: new Set([page.pageNumber]),
          wordCount: pageWords.length
        };
      }
    });
    
    // Add the last chunk
    if (currentChunk.text.trim()) {
      chunks.push({
        text: currentChunk.text.trim(),
        pages: Array.from(currentChunk.pages).sort((a, b) => a - b),
        wordCount: currentChunk.wordCount
      });
    }
    
    return chunks;
  }
}

module.exports = EnhancedPDFProcessor;
