/**
 * Service to estimate page numbers for existing chunks
 * This helps with documents that were processed before page extraction was implemented
 */

class PageEstimationService {
  /**
   * Estimate page numbers for chunks based on content and position
   * @param {Array} chunks - Array of chunks with content
   * @param {number} estimatedTotalPages - Estimated total pages in the document
   * @returns {Array} Chunks with estimated page numbers
   */
  static estimatePageNumbers(chunks, estimatedTotalPages = 10) {
    if (!chunks || chunks.length === 0) {
      return chunks;
    }

    // Calculate total words across all chunks
    const totalWords = chunks.reduce((sum, chunk) => {
      return sum + (chunk.content ? chunk.content.split(/\s+/).length : 0);
    }, 0);

    // Estimate words per page
    const wordsPerPage = Math.ceil(totalWords / estimatedTotalPages);
    
    let currentPage = 1;
    let currentWordCount = 0;

    return chunks.map((chunk, index) => {
      const chunkWords = chunk.content ? chunk.content.split(/\s+/).length : 0;
      currentWordCount += chunkWords;

      // Estimate page number based on word count
      const estimatedPageNumber = Math.min(
        Math.ceil(currentWordCount / wordsPerPage),
        estimatedTotalPages
      );

      // Look for page indicators in the content
      const contentPageNumbers = this.extractPageIndicators(chunk.content);
      const finalPageNumber = contentPageNumbers.length > 0 ? 
        contentPageNumbers[0] : 
        estimatedPageNumber;

      return {
        ...chunk,
        pages: [finalPageNumber],
        pageNumbers: finalPageNumber.toString(),
        estimatedPage: finalPageNumber
      };
    });
  }

  /**
   * Extract page numbers from chunk content
   * @param {string} content - Text content of the chunk
   * @returns {Array} Array of page numbers found in content
   */
  static extractPageIndicators(content) {
    if (!content) return [];

    const pagePatterns = [
      /Page\s+(\d+)/gi,
      /page\s+(\d+)/gi,
      /(\d+)\s*of\s*\d+/gi,
      /^(\d+)\s+/gm,
      /\n(\d+)\s+/gm,
      /-\s*(\d+)\s*-/gi,
      /\((\d+)\)/gi,
      /Section\s+(\d+)/gi,
      /Chapter\s+(\d+)/gi
    ];

    const pageNumbers = new Set();

    pagePatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const number = match.match(/\d+/);
          if (number) {
            const pageNum = parseInt(number[0]);
            // Reasonable page number range (1-1000)
            if (pageNum >= 1 && pageNum <= 1000) {
              pageNumbers.add(pageNum);
            }
          }
        });
      }
    });

    return Array.from(pageNumbers).sort((a, b) => a - b);
  }

  /**
   * Estimate total pages in a document based on content analysis
   * @param {string} fullText - Complete text of the document
   * @returns {number} Estimated total pages
   */
  static estimateTotalPages(fullText) {
    if (!fullText) return 1;

    const totalWords = fullText.split(/\s+/).length;
    
    // Average words per page varies by document type
    const wordsPerPageRanges = {
      academic: 400,      // Academic papers
      textbook: 500,     // Textbooks
      report: 450,        // Reports
      manual: 350,        // Manuals
      default: 450        // Default estimate
    };

    // Try to detect document type
    let documentType = 'default';
    if (fullText.toLowerCase().includes('chapter') || 
        fullText.toLowerCase().includes('section')) {
      documentType = 'textbook';
    } else if (fullText.toLowerCase().includes('abstract') || 
               fullText.toLowerCase().includes('methodology')) {
      documentType = 'academic';
    } else if (fullText.toLowerCase().includes('manual') || 
               fullText.toLowerCase().includes('guide')) {
      documentType = 'manual';
    }

    const wordsPerPage = wordsPerPageRanges[documentType];
    const estimatedPages = Math.ceil(totalWords / wordsPerPage);

    // Reasonable page range (1-500)
    return Math.max(1, Math.min(estimatedPages, 500));
  }

  /**
   * Enhance existing chunks with page information
   * @param {Array} chunks - Existing chunks from database
   * @returns {Array} Enhanced chunks with page information
   */
  static enhanceChunksWithPageInfo(chunks) {
    if (!chunks || chunks.length === 0) {
      return chunks;
    }

    // Check if chunks already have page information
    const hasPageInfo = chunks.some(chunk => 
      chunk.pages && chunk.pages.length > 0 && chunk.pages[0] > 1
    );

    if (hasPageInfo) {
      return chunks; // Already have page info
    }

    // Estimate total pages from all content
    const fullText = chunks.map(chunk => chunk.content || '').join('\n');
    const estimatedTotalPages = this.estimateTotalPages(fullText);

    console.log(`[PAGE ESTIMATION] Estimated ${estimatedTotalPages} pages for ${chunks.length} chunks`);

    return this.estimatePageNumbers(chunks, estimatedTotalPages);
  }
}

module.exports = PageEstimationService;
