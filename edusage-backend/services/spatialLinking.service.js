const Diagram = require("../models/Diagram.model");
const chroma = require("./chroma.client");

class SpatialLinkingService {
  constructor() {
    this.proximityThreshold = 2; // Maximum chunk distance for proximity
    this.confidenceThreshold = 0.3; // Minimum confidence for image relevance
  }

  async linkImagesToTextChunks(notebookId, documentId) {
    console.log(`[SPATIAL] Starting spatial linking for notebook ${notebookId}, document ${documentId}`);
    
    try {
      // Get all diagrams for the document
      const diagrams = await Diagram.find({
        notebookId,
        documentId,
        confidence: { $gte: this.confidenceThreshold }
      }).sort({ pageNumber: 1 });

      console.log(`[SPATIAL] Found ${diagrams.length} diagrams for document ${documentId}`);
      
      if (diagrams.length === 0) {
        console.log(`[SPATIAL] No diagrams found for linking`);
        return;
      }

      // Get text chunks from ChromaDB
      const collection = await chroma.getOrCreateCollection({
        name: `notebook_${notebookId}`
      });

      const chunks = await this.getChunksFromCollection(collection, documentId);
      console.log(`[SPATIAL] Found ${chunks.length} chunks for document ${documentId}`);

      if (chunks.length === 0) {
        console.log(`[SPATIAL] No chunks found for linking`);
        return;
      }

      // Link each diagram to nearby chunks
      for (const diagram of diagrams) {
        console.log(`[SPATIAL] Processing diagram: ${diagram.heading} (page ${diagram.pageNumber})`);
        const nearbyChunks = this.findNearbyChunks(diagram, chunks);
        console.log(`[SPATIAL] Found ${nearbyChunks.length} nearby chunks for diagram ${diagram.heading}`);
        
        // Update diagram with linked chunks
        await Diagram.findByIdAndUpdate(diagram._id, {
          linkedChunks: nearbyChunks.map(chunk => chunk.metadata.chunkId), // Use chunkId from metadata
          spatialProximity: {
            ...diagram.spatialProximity,
            nearbyTextChunks: nearbyChunks.map(chunk => chunk.text.substring(0, 100)),
            textDensity: nearbyChunks.length
          }
        });

        console.log(`[SPATIAL] Linked diagram "${diagram.heading}" to ${nearbyChunks.length} chunks:`, nearbyChunks.map(c => c.metadata.chunkId));
      }

      console.log(`[SPATIAL] Spatial linking complete for ${diagrams.length} diagrams`);
      
    } catch (error) {
      console.error(`[SPATIAL] Spatial linking failed:`, error);
      throw error;
    }
  }

  async getChunksFromCollection(collection, documentId) {
    try {
      // Get all chunks for the specific document
      const results = await collection.get({
        where: { documentId: documentId.toString() }
      });

      const chunks = [];
      if (results.ids && results.documents && results.metadatas) {
        for (let i = 0; i < results.ids.length; i++) {
          chunks.push({
            id: results.ids[i],
            text: results.documents[i],
            metadata: results.metadatas[i]
          });
        }
      }

      return chunks;
    } catch (error) {
      console.error(`[SPATIAL] Failed to get chunks from collection:`, error);
      return [];
    }
  }

  findNearbyChunks(diagram, chunks) {
    const nearbyChunks = [];
    
    for (const chunk of chunks) {
      if (this.isChunkNearDiagram(diagram, chunk)) {
        nearbyChunks.push(chunk);
      }
    }

    // Sort by proximity (closest first)
    return nearbyChunks.sort((a, b) => {
      const distanceA = this.calculateDistance(diagram, a);
      const distanceB = this.calculateDistance(diagram, b);
      return distanceA - distanceB;
    });
  }

  isChunkNearDiagram(diagram, chunk) {
    // Check if chunk is on the same page
    let chunkPageNumber = chunk.metadata.pageNumber;
    
    // Handle missing pageNumber in metadata
    if (!chunkPageNumber) {
      if (chunk.metadata.pages && chunk.metadata.pages.length > 0) {
        chunkPageNumber = chunk.metadata.pages[0];
      } else if (chunk.metadata.pageNumbers) {
        const pages = chunk.metadata.pageNumbers.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p));
        if (pages.length > 0) {
          chunkPageNumber = pages[0];
        }
      }
    }
    
    // If we still don't have a page number, assume same page for proximity calculation
    if (!chunkPageNumber) {
      console.log(`[SPATIAL] No page number for chunk ${chunk.id}, assuming same page as diagram`);
      return true; // Assume same page for better linking
    }
    
    if (chunkPageNumber !== diagram.pageNumber) {
      return false;
    }

    // Calculate distance based on chunk index and position
    const distance = this.calculateDistance(diagram, chunk);
    return distance <= this.proximityThreshold;
  }

  calculateDistance(diagram, chunk) {
    // Simple distance calculation based on chunk index
    // In a more sophisticated implementation, this would use actual spatial coordinates
    const chunkIndex = chunk.metadata.chunkIndex || 0;
    
    // Estimate diagram position based on bounding box
    const diagramPosition = this.estimateDiagramPosition(diagram);
    
    // Calculate absolute difference
    return Math.abs(chunkIndex - diagramPosition);
  }

  estimateDiagramPosition(diagram) {
    // Estimate the chunk position where this diagram might appear
    // This is a heuristic - in reality, you'd need page layout analysis
    
    if (diagram.boundingBox && diagram.boundingBox.y0 !== undefined) {
      // Use vertical position to estimate chunk position
      const pageHeight = diagram.boundingBox.height || 800; // Default page height
      const relativePosition = diagram.boundingBox.y0 / pageHeight;
      
      // Assume roughly 10 chunks per page
      return Math.floor(relativePosition * 10);
    }
    
    // Fallback: use page number * chunks per page
    return (diagram.pageNumber - 1) * 10 + 5; // Middle of page
  }

  async getRelevantImagesForQuery(notebookId, queryEmbedding, topK = 3, question = '') {
    console.log(`[SPATIAL] Finding relevant images for query in notebook ${notebookId}`);
    console.log(`[SPATIAL] Question: "${question}"`);
    
    try {
      // Get all diagrams for the notebook (including contextText for matching)
      const diagrams = await Diagram.find({
        notebookId,
        confidence: { $gte: this.confidenceThreshold }
      }).sort({ pageNumber: 1 });

      console.log(`[SPATIAL] Found ${diagrams.length} total diagrams in notebook ${notebookId}`);

      if (diagrams.length === 0) {
        console.log(`[SPATIAL] No diagrams found in notebook`);
        return [];
      }

      // Extract keywords from the question for content-based matching
      const questionKeywords = this.extractKeywords(question);
      console.log(`[SPATIAL] Question keywords: [${questionKeywords.join(', ')}]`);

      // If no meaningful keywords, skip diagram retrieval
      if (questionKeywords.length === 0) {
        console.log(`[SPATIAL] No meaningful keywords in question, skipping diagram retrieval`);
        return [];
      }

      // Get relevant text chunks using the query embedding
      const collection = await chroma.getOrCreateCollection({
        name: `notebook_${notebookId}`
      });

      const chunkResults = await collection.query({
        queryEmbeddings: [queryEmbedding],
        nResults: 8
      });

      const relevantChunks = chunkResults.documents?.[0] || [];
      const relevantMetadatas = chunkResults.metadatas?.[0] || [];
      const relevantDistances = chunkResults.distances?.[0] || [];

      console.log(`[SPATIAL] Found ${relevantChunks.length} relevant text chunks`);

      // Score each diagram based on content relevance to the question
      const diagramScores = [];

      for (const diagram of diagrams) {
        let score = 0;
        let matchDetails = [];

        // 1. KEYWORD MATCHING against diagram contextText (strongest signal)
        const contextText = (diagram.contextText || '').toLowerCase();
        const heading = (diagram.heading || '').toLowerCase();
        const nearbyText = (diagram.spatialProximity?.nearbyTextChunks || []).join(' ').toLowerCase();
        
        // Combine all text associated with this diagram
        const allDiagramText = `${heading} ${contextText} ${nearbyText}`;
        
        let keywordMatches = 0;
        let matchedKeywords = [];
        for (const keyword of questionKeywords) {
          if (allDiagramText.includes(keyword)) {
            keywordMatches++;
            matchedKeywords.push(keyword);
          }
        }

        // Keyword match score (0-10 range)
        const keywordScore = (keywordMatches / questionKeywords.length) * 10;
        score += keywordScore;
        
        if (keywordMatches > 0) {
          matchDetails.push(`keywords: ${matchedKeywords.join(',')}`);
        }

        // 2. LINKED CHUNK MATCHING - check if diagram's linked chunks overlap with query-relevant chunks
        const linkedChunkIds = new Set(diagram.linkedChunks || []);
        let linkedChunkScore = 0;
        
        for (let i = 0; i < relevantMetadatas.length; i++) {
          const chunkId = relevantMetadatas[i]?.chunkId;
          if (chunkId && linkedChunkIds.has(chunkId)) {
            // Higher score for higher-ranked chunks (lower distance = more relevant)
            const chunkRelevance = Math.max(0, (8 - i)) * 0.3;
            linkedChunkScore += chunkRelevance;
            matchDetails.push(`linked-chunk-${i}`);
          }
        }
        score += linkedChunkScore;

        // 3. Check if top relevant chunks mention keywords from the question
        //    AND are on the same page as this diagram
        let contextualPageScore = 0;
        for (let i = 0; i < Math.min(relevantChunks.length, 5); i++) {
          const chunkText = (relevantChunks[i] || '').toLowerCase();
          const chunkMeta = relevantMetadatas[i] || {};
          
          // Check if this chunk is on the same page as the diagram
          let chunkPage = chunkMeta.pageNumber;
          if (!chunkPage && chunkMeta.pageNumbers) {
            const pages = chunkMeta.pageNumbers.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p));
            if (pages.length > 0) chunkPage = pages[0];
          }
          
          if (chunkPage === diagram.pageNumber) {
            // Check if the chunk text also contains question keywords
            let chunkKeywordMatches = 0;
            for (const keyword of questionKeywords) {
              if (chunkText.includes(keyword)) {
                chunkKeywordMatches++;
              }
            }
            if (chunkKeywordMatches >= 2) {
              // This chunk is on the same page AND matches keywords
              contextualPageScore += (chunkKeywordMatches / questionKeywords.length) * 2;
              matchDetails.push(`page-context-${diagram.pageNumber}`);
            }
          }
        }
        score += contextualPageScore;

        // 4. Boost for diagram type relevance
        if (diagram.imageType === 'diagram' || diagram.imageType === 'chart') {
          score += 0.5;
        }

        // Only include diagrams with meaningful scores (at least some keyword match)
        if (keywordMatches >= 1 || linkedChunkScore > 0) {
          console.log(`[SPATIAL] Diagram "${diagram.heading}" (page ${diagram.pageNumber}) -> score: ${score.toFixed(2)} [${matchDetails.join(', ')}]`);
          diagramScores.push({
            ...diagram.toObject(),
            relevanceScore: score
          });
        } else {
          console.log(`[SPATIAL] SKIP diagram "${diagram.heading}" (page ${diagram.pageNumber}) - no keyword match`);
        }
      }

      // Sort by relevance score (highest first)
      diagramScores.sort((a, b) => b.relevanceScore - a.relevanceScore);

      // Apply minimum score threshold
      const MIN_SCORE = 1.0;
      const filtered = diagramScores.filter(d => d.relevanceScore >= MIN_SCORE);
      
      const result = filtered.slice(0, topK);
      console.log(`[SPATIAL] Returning ${result.length} relevant diagrams (filtered from ${diagramScores.length} candidates)`);
      return result;

    } catch (error) {
      console.error(`[SPATIAL] Failed to get relevant images:`, error);
      return [];
    }
  }

  /**
   * Extract meaningful keywords from a question for content matching.
   * Removes common stop words and short words, keeps topic-specific terms.
   */
  extractKeywords(question) {
    if (!question) return [];
    
    const stopWords = new Set([
      'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
      'should', 'may', 'might', 'shall', 'can', 'need', 'dare', 'ought',
      'and', 'or', 'but', 'if', 'while', 'although', 'because', 'since',
      'for', 'of', 'at', 'by', 'from', 'in', 'into', 'on', 'to', 'with',
      'about', 'between', 'through', 'during', 'before', 'after',
      'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those',
      'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'she', 'it',
      'they', 'them', 'its', 'his', 'her', 'their',
      'all', 'each', 'every', 'both', 'few', 'more', 'most', 'some', 'any',
      'how', 'when', 'where', 'why', 'not', 'no', 'nor', 'so', 'too', 'very',
      'just', 'also', 'than', 'then', 'now', 'here', 'there',
      'explain', 'describe', 'show', 'give', 'tell', 'list', 'define',
      'please', 'help', 'want', 'know', 'understand', 'mean', 'means',
      'using', 'used', 'use', 'make', 'made', 'get', 'got', 'see',
      'diagram', 'image', 'picture', 'figure', 'draw', 'drawing', 'chart',
      'model', 'process', 'system', 'method', 'approach',
    ]);

    // Keep 'model', 'process' etc. out of stop words - they are often part of specific terms
    // Actually, let me reconsider - remove only truly generic words
    const genericStopWords = new Set([
      'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
      'should', 'may', 'might', 'shall', 'can',
      'and', 'or', 'but', 'if', 'while', 'because', 'since',
      'for', 'of', 'at', 'by', 'from', 'in', 'into', 'on', 'to', 'with',
      'about', 'between', 'through', 'during', 'before', 'after',
      'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those',
      'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'she', 'it',
      'they', 'them', 'its', 'his', 'her', 'their',
      'how', 'when', 'where', 'why', 'not', 'no', 'so', 'too', 'very',
      'just', 'also', 'than', 'then', 'now', 'here', 'there',
      'explain', 'describe', 'show', 'give', 'tell', 'list', 'define',
      'please', 'help', 'want', 'know', 'understand', 'using', 'used',
      'use', 'make', 'see', 'get', 'got',
      'diagram', 'image', 'picture', 'figure', 'draw', 'drawing', 'chart',
      'with', 'me', 'can',
    ]);

    const words = question.toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length >= 2 && !genericStopWords.has(w));

    // Also extract multi-word phrases (bigrams) for better matching
    const questionLower = question.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
    const allWords = questionLower.split(/\s+/).filter(w => w.length >= 2);
    const bigrams = [];
    for (let i = 0; i < allWords.length - 1; i++) {
      if (!genericStopWords.has(allWords[i]) || !genericStopWords.has(allWords[i + 1])) {
        bigrams.push(`${allWords[i]} ${allWords[i + 1]}`);
      }
    }

    // Return unique keywords (single words + bigrams)
    return [...new Set([...words, ...bigrams])];
  }

  calculateImageRelevanceScore(diagram, chunkText, chunkRank) {
    let score = 0;
    
    // Base score from chunk ranking (higher rank = higher relevance)
    score += (10 - chunkRank) * 0.1;
    
    // Boost score based on diagram confidence
    score += diagram.confidence * 2;
    
    // Boost score based on image type
    if (diagram.imageType === 'diagram' || diagram.imageType === 'chart') {
      score += 1;
    }
    
    // Boost score based on text density around image
    if (diagram.spatialProximity && diagram.spatialProximity.textDensity > 0) {
      score += Math.min(diagram.spatialProximity.textDensity * 0.2, 1);
    }
    
    return score;
  }

  calculatePageRelevanceScore(diagram, relevantMetadatas, pageNumber) {
    // Count how many relevant chunks are on this page
    const pageChunkCount = relevantMetadatas.filter(meta => meta.pageNumber === pageNumber).length;
    
    // Base score from number of relevant chunks on the page
    let score = pageChunkCount * 0.5;
    
    // Boost score if diagram is in a good position
    if (diagram.spatialProximity && diagram.spatialProximity.positionOnPage) {
      const position = diagram.spatialProximity.positionOnPage;
      if (position.includes('center') || position.includes('middle')) {
        score += 0.5;
      }
    }
    
    return score;
  }

  async enhanceContextWithImages(context, relevantImages) {
    if (relevantImages.length === 0) {
      return context;
    }

    console.log(`[SPATIAL] Enhancing context with ${relevantImages.length} images`);
    
    let enhancedContext = context;
    
    // Add image references to context
    for (let i = 0; i < relevantImages.length; i++) {
      const image = relevantImages[i];
      const imageReference = `
[IMAGE ${i + 1}: ${image.heading}]
Page: ${image.pageNumber}
Type: ${image.imageType}
Position: ${image.spatialProximity?.positionOnPage || 'unknown'}
Relevance Score: ${image.relevanceScore?.toFixed(2) || 'N/A'}
`;
      
      enhancedContext += imageReference;
    }
    
    return enhancedContext;
  }
}

module.exports = new SpatialLinkingService();

