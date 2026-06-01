// Enhanced document processing service with topic-based chunking
// Integrates with existing PDF processing pipeline

const embedText = require("./embedding.service");
const pdfParse = require("pdf-parse");
const { TopicChunker } = require("./topicChunking.service");
const EnhancedPDFProcessor = require("./enhancedPDFProcessor.service");
const chroma = require('./chroma.client');

class TopicDocumentProcessor {
  constructor() {
    this.topicChunker = new TopicChunker();
  }

  // Main processing function - replaces or enhances existing document processing
  async processDocumentWithTopicChunking(pdfBuffer, documentId, filename) {
    console.log(`[TOPIC PROCESSOR] Starting topic-based processing for: ${filename}`);
    
    try {
      // Step 1: Extract text from PDF with page information
      const pages = await EnhancedPDFProcessor.extractTextWithPages(pdfBuffer);
      const fullText = pages.map(page => page.text).join('\n\n');
      
      console.log(`[TOPIC PROCESSOR] Extracted ${fullText.length} characters from ${pages.length} pages`);

      // Step 2: Create topic-based chunks with page information
      const topicChunks = this.topicChunker.createTopicChunks(fullText, documentId);
      
      // Add page information to chunks
      const chunksWithPages = this.addPageInfoToChunks(topicChunks, pages);
      
      console.log(`[TOPIC PROCESSOR] Created ${chunksWithPages.length} topic chunks with page information`);

      // Step 3: Store chunks in vector database with enhanced metadata
      const storedChunks = await this.storeTopicChunks(chunksWithPages, documentId, filename);
      
      console.log(`[TOPIC PROCESSOR] Stored ${storedChunks.length} chunks in vector database`);

      return {
        success: true,
        documentId,
        filename,
        chunksCreated: storedChunks.length,
        topicsDetected: this.getDetectedTopics(chunksWithPages),
        processingStats: this.getProcessingStats(chunksWithPages),
        pagesProcessed: pages.length
      };

    } catch (error) {
      console.error(`[TOPIC PROCESSOR] Error processing document:`, error);
      throw error;
    }
  }

  // Add page information to topic chunks
  addPageInfoToChunks(chunks, pages) {
    return chunks.map(chunk => {
      // Find which pages contain this chunk's content
      const matchingPages = EnhancedPDFProcessor.findPagesForText(pages, chunk.content);
      
      return {
        ...chunk,
        pages: matchingPages.length > 0 ? matchingPages : [1], // Default to page 1 if no match
        pageNumbers: matchingPages.length > 0 ? matchingPages.join(', ') : '1'
      };
    });
  }

  // Store chunks with enhanced metadata in ChromaDB
  async storeTopicChunks(chunks, documentId, filename) {
    const storedChunks = [];

    for (const chunk of chunks) {
      try {
        // Create collection name based on document
        const collectionName = `document_${documentId}`;
        
        // Get or create collection
        const collection = await chroma.getOrCreateCollection({
          name: collectionName
        });

        // Prepare enhanced metadata
        const metadata = {
          documentId,
          filename,
          topic: chunk.topic,
          chunkType: chunk.type,
          confidence: chunk.confidence,
          keywords: chunk.metadata.keywords?.join(',') || '',
          chunkId: chunk.id,
          createdAt: chunk.metadata.createdAt,
          // Page information
          pages: chunk.pages || [1],
          pageNumbers: chunk.pageNumbers || '1',
          // Additional metadata for better retrieval
          isDedicatedTopic: chunk.type === 'dedicated_topic',
          isSubTopic: chunk.type === 'sub_topic',
          topicScore: chunk.confidence,
          wordCount: chunk.content.split(' ').length
        };

        // Store in ChromaDB
        await collection.add({
          ids: [chunk.id],
          documents: [chunk.content],
          metadatas: [metadata]
        });

        storedChunks.push({
          id: chunk.id,
          topic: chunk.topic,
          type: chunk.type,
          confidence: chunk.confidence,
          stored: true
        });

      } catch (error) {
        console.error(`[TOPIC PROCESSOR] Error storing chunk ${chunk.id}:`, error);
        storedChunks.push({
          id: chunk.id,
          topic: chunk.topic,
          type: chunk.type,
          confidence: chunk.confidence,
          stored: false,
          error: error.message
        });
      }
    }

    return storedChunks;
  }

  // Get summary of detected topics
  getDetectedTopics(chunks) {
    const topicSummary = {};
    
    chunks.forEach(chunk => {
      if (!topicSummary[chunk.topic]) {
        topicSummary[chunk.topic] = {
          count: 0,
          dedicatedChunks: 0,
          subChunks: 0,
          avgConfidence: 0,
          totalConfidence: 0
        };
      }
      
      const summary = topicSummary[chunk.topic];
      summary.count++;
      summary.totalConfidence += chunk.confidence;
      
      if (chunk.type === 'dedicated_topic') summary.dedicatedChunks++;
      if (chunk.type === 'sub_topic') summary.subChunks++;
    });

    // Calculate averages
    Object.values(topicSummary).forEach(summary => {
      summary.avgConfidence = summary.count > 0 ? summary.totalConfidence / summary.count : 0;
    });

    return topicSummary;
  }

  // Get processing statistics
  getProcessingStats(chunks) {
    const totalChunks = chunks.length;
    const dedicatedChunks = chunks.filter(c => c.type === 'dedicated_topic').length;
    const subChunks = chunks.filter(c => c.type === 'sub_topic').length;
    const avgConfidence = chunks.reduce((sum, c) => sum + c.confidence, 0) / totalChunks;
    const totalWords = chunks.reduce((sum, c) => sum + c.content.split(' ').length, 0);

    return {
      totalChunks,
      dedicatedChunks,
      subChunks,
      avgConfidence: Math.round(avgConfidence * 100) / 100,
      totalWords,
      avgWordsPerChunk: Math.round(totalWords / totalChunks),
      topicDistribution: Object.keys(this.getDetectedTopics(chunks)).length
    };
  }

  // Enhanced query processing for topic-based chunks
  async queryWithTopicAwareness(query, documentId, topK = 6) {
    console.log(`[TOPIC QUERY] Processing query: "${query}" for document: ${documentId}`);
    
    try {
      // Detect query topic
      const queryTopic = this.topicChunker.topicClassifier.detectPrimaryTopic(query);
      console.log(`[TOPIC QUERY] Detected topic: ${queryTopic.topic} (confidence: ${queryTopic.confidence})`);

      // Get collection
      const collection = await chroma.getOrCreateCollection({
        name: `document_${documentId}`
      });

      // Build query strategy based on detected topic
      const queryStrategy = this.buildQueryStrategy(queryTopic, query);
      console.log(`[TOPIC QUERY] Using strategy:`, queryStrategy);

      // Execute tiered search
      const results = await this.executeTieredSearch(collection, query, queryStrategy, topK);
      
      console.log(`[TOPIC QUERY] Retrieved ${results.documents?.[0]?.length || 0} results`);
      return this.formatQueryResults(results, queryTopic);

    } catch (error) {
      console.error(`[TOPIC QUERY] Error in topic-aware query:`, error);
      throw error;
    }
  }

  buildQueryStrategy(detectedTopic, originalQuery) {
    if (detectedTopic.confidence > 0.7) {
      // High confidence - prioritize dedicated topic chunks
      return {
        primary: { topic: detectedTopic.topic, type: 'dedicated_topic' },
        secondary: { topic: detectedTopic.topic, type: 'sub_topic' },
        fallback: { keywords: this.extractQueryKeywords(originalQuery) }
      };
    } else if (detectedTopic.confidence > 0.3) {
      // Medium confidence - mix of topic and keyword search
      return {
        primary: { topic: detectedTopic.topic },
        secondary: { keywords: this.extractQueryKeywords(originalQuery) },
        fallback: { type: 'dedicated_topic' }
      };
    } else {
      // Low confidence - keyword-based search
      return {
        primary: { keywords: this.extractQueryKeywords(originalQuery) },
        fallback: { type: 'dedicated_topic' }
      };
    }
  }

  async executeTieredSearch(collection, query, strategy, topK) {
    const allResults = {
      documents: [[]],
      metadatas: [[]],
      distances: [[]]
    };

    // Execute searches in priority order
    const searches = ['primary', 'secondary', 'fallback'];
    
    for (const searchType of searches) {
      if (allResults.documents[0].length >= topK) break;
      
      const searchConfig = strategy[searchType];
      if (!searchConfig) continue;

      try {
        const searchResults = await this.executeSpecificSearch(collection, query, searchConfig, topK - allResults.documents[0].length);
        
        // Merge results, avoiding duplicates
        await this.mergeSearchResults(allResults, searchResults);
        
      } catch (error) {
        console.error(`[TOPIC QUERY] Error in ${searchType} search:`, error);
      }
    }

    return allResults;
  }

  async executeSpecificSearch(collection, query, config, limit) {
    // Build where clause for ChromaDB
    let whereClause = {};
    
    if (config.topic) {
      whereClause.topic = config.topic;
    }
    
    if (config.type) {
      whereClause.chunkType = config.type;
    }

    // For now, use the existing embedding service
    // In Phase 2, we'll add semantic search capabilities
    const embedText = require('./embedding.service');
    const [queryEmbedding] = await embedText([query]);

    return await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: limit,
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined
    });
  }

  async mergeSearchResults(targetResults, newResults) {
    if (!newResults.documents?.[0]) return;

    const existingIds = new Set(targetResults.metadatas[0]?.map(m => m.chunkId) || []);
    
    newResults.documents[0].forEach((doc, index) => {
      const metadata = newResults.metadatas[0][index];
      const distance = newResults.distances[0][index];
      
      if (!existingIds.has(metadata.chunkId)) {
        targetResults.documents[0].push(doc);
        targetResults.metadatas[0].push(metadata);
        targetResults.distances[0].push(distance);
        existingIds.add(metadata.chunkId);
      }
    });
  }

  formatQueryResults(results, queryTopic) {
    const documents = results.documents?.[0] || [];
    const metadatas = results.metadatas?.[0] || [];
    const distances = results.distances?.[0] || [];

    return {
      documents,
      metadatas,
      distances,
      queryTopic: queryTopic.topic,
      queryConfidence: queryTopic.confidence,
      resultCount: documents.length,
      topicDistribution: this.analyzeResultTopics(metadatas)
    };
  }

  analyzeResultTopics(metadatas) {
    const topicCount = {};
    metadatas.forEach(meta => {
      topicCount[meta.topic] = (topicCount[meta.topic] || 0) + 1;
    });
    return topicCount;
  }

  extractQueryKeywords(query) {
    return this.topicChunker.topicClassifier.extractKeywords(query, 5);
  }
}

module.exports = TopicDocumentProcessor;
