const chroma = require("../services/chroma.client");
const embedText = require("../services/embedding.service");
const synthesizeAnswer = require("../services/answerSynthesizer.service");
const Chat = require("../models/Chat.model");
const spatialLinkingService = require("../services/spatialLinking.service");
const { evaluateAccuracyMetrics } = require("../services/metricsEvaluator.service");

// Import topic-based system
const TopicDocumentProcessor = require("../services/topicDocumentProcessor.service");
const PageEstimationService = require("../services/pageEstimation.service");

exports.askQuestion = async (req, res) => {
  const notebookId = req.params.notebookId || req.body.notebookId;
  const { question } = req.body;

  console.log(`[RAG] Processing question: "${question}" for notebook: ${notebookId}`);

  if (!notebookId) {
    return res.status(400).json({ message: "notebookId is required" });
  }

  if (!question || question.trim().length === 0) {
    return res.status(400).json({ message: "Question is required" });
  }

  try {
    return await processOriginalQuery(req, res, question, notebookId);
  } catch (error) {
    console.error(`[RAG ERROR] Query processing failed:`, error);
    res.status(500).json({
      message: "An error occurred while processing your question",
      error: error.message
    });
  }
};

// Helper function to process topic-based results
async function processQueryResults(req, res, queryResults, question, notebookId) {
  try {
    /* -------- SAVE USER MESSAGE -------- */
    try {
      const userChat = await Chat.create({
        notebookId,
        userId: req.userId,
        role: "user",
        message: question
      });
      console.log(`[RAG] Saved user message:`, userChat._id);
    } catch (saveError) {
      console.error(`[RAG ERROR] Failed to save user message:`, saveError);
    }

    /* -------- GET CHAT HISTORY -------- */
    let chatHistory = [];
    try {
      chatHistory = await Chat.find({
        notebookId,
        userId: req.userId
      })
      .sort({ createdAt: -1 })
      .limit(6)
      .select('role message');

      console.log(`[RAG] Retrieved ${chatHistory.length} chat messages`);
    } catch (historyError) {
      console.error(`[RAG ERROR] Failed to retrieve chat history:`, historyError);
    }

    /* -------- BUILD TOPIC-AWARE CONTEXT -------- */
    const documents = queryResults.documents || [];
    const metadatas = queryResults.metadatas || [];
    
    if (documents.length === 0) {
      console.log(`[RAG] No relevant content found`);
      
      await Chat.create({
        notebookId,
        userId: req.userId,
        role: "assistant",
        message: "I couldn't find any relevant information in your notebook to answer this question. Please try rephrasing your question or check if the relevant content has been uploaded."
      });
      
      return res.json({
        answer: "I couldn't find any relevant information in your notebook to answer this question. Please try rephrasing your question or check if the relevant content has been uploaded.",
        sources: [],
        queryTopic: queryResults.queryTopic,
        queryConfidence: queryResults.queryConfidence
      });
    }

    /* -------- ENHANCED CONTEXT CONSTRUCTION -------- */
    const documentContext = buildTopicAwareContext(documents, metadatas, queryResults);
    console.log(`[RAG] Built topic-aware context with ${documentContext.length} characters`);

    /* -------- RETRIEVE RELEVANT IMAGES -------- */
    let relevantImages = [];
    try {
      const [questionEmbedding] = await embedText([question]);
      relevantImages = await spatialLinkingService.getRelevantImagesForQuery(notebookId, questionEmbedding, 3, question);
      console.log(`[RAG] Retrieved ${relevantImages.length} relevant images for the query`);
    } catch (imageError) {
      console.warn(`[RAG] Failed to retrieve relevant images:`, imageError.message);
    }

    /* -------- ENHANCE CONTEXT WITH IMAGES -------- */
    const enhancedContext = await spatialLinkingService.enhanceContextWithImages(documentContext, relevantImages);
    console.log(`[RAG] Enhanced context with image references`);

    /* -------- BUILD CONVERSATIONAL CONTEXT -------- */
    let conversationHistory = "";
    if (chatHistory.length > 0) {
      const recentMessages = chatHistory.slice(1).reverse();
      conversationHistory = recentMessages.map(msg => 
        `${msg.role}: ${msg.message}`
      ).join('\n');
    }

    /* -------- BUILD FINAL CONTEXT -------- */
    const finalContext = conversationHistory ? 
      `Conversation History:\n${conversationHistory}\n\nContext:\n${enhancedContext}` :
      enhancedContext;

    if (finalContext.trim().length === 0) {
      console.log(`[RAG] Empty context after processing`);
      
      await Chat.create({
        notebookId,
        userId: req.userId,
        role: "assistant",
        message: "I couldn't find sufficient relevant information in your notebook to answer this question accurately."
      });
      
      return res.json({
        answer: "I couldn't find sufficient relevant information in your notebook to answer this question accurately.",
        sources: [],
        queryTopic: queryResults.queryTopic,
        queryConfidence: queryResults.queryConfidence
      });
    }

    /* -------- SYNTHESIZE ANSWER -------- */
    console.log(`[RAG] Synthesizing answer with topic-aware context`);
    const answer = await synthesizeAnswer({
      question,
      context: finalContext
    });

    /* -------- COMPUTE ACCURACY METRICS -------- */
    let accuracyMetrics = null;
    try {
      // Topic-based results may not have raw distances, so estimate from confidence
      const estimatedDistances = metadatas.map(m => {
        const conf = m.confidence || 0.5;
        return 1.5 * (1 - conf); // Convert confidence back to approximate distance
      });
      accuracyMetrics = await evaluateAccuracyMetrics({
        question,
        answer,
        context: documentContext,
        distances: estimatedDistances,
        chunksRetrieved: documents.length
      });
    } catch (metricsError) {
      console.warn(`[RAG] Metrics evaluation failed:`, metricsError.message);
    }

    /* -------- SAVE ASSISTANT MESSAGE -------- */
    // Build relevantImages data for persistence
    const imageDataForStorage = relevantImages.map(img => ({
      id: img._id?.toString(),
      heading: img.heading,
      pageNumber: img.pageNumber,
      imageUrl: img.imageData && img.imageData.startsWith('data:') 
        ? img.imageData  // base64 data URI — works without disk
        : img.imagePath?.startsWith('http') 
          ? img.imagePath 
          : `${req.protocol}://${req.get('host')}${img.imagePath}`,
      imageType: img.imageType,
      confidence: img.confidence,
      relevanceScore: img.relevanceScore
    }));

    try {
      const assistantChat = await Chat.create({
        notebookId,
        userId: req.userId,
        role: "assistant",
        message: answer,
        relevantImages: imageDataForStorage.length > 0 ? imageDataForStorage : undefined,
        accuracyMetrics: accuracyMetrics || undefined
      });
      console.log(`[RAG] Saved assistant message:`, assistantChat._id);
    } catch (saveError) {
      console.error(`[RAG ERROR] Failed to save assistant message:`, saveError);
    }

    /* -------- BUILD ENHANCED SOURCES -------- */
    const sources = buildEnhancedSources(metadatas, queryResults);

    console.log(`[RAG] Generated answer with ${sources.length} sources`);
    console.log(`[RAG] Answer length: ${answer.length}`);

    res.json({ 
      answer, 
      sources,
      relevantImages: imageDataForStorage,
      accuracyMetrics,
      queryTopic: queryResults.queryTopic,
      queryConfidence: queryResults.queryConfidence,
      topicDistribution: queryResults.topicDistribution,
      resultCount: queryResults.resultCount
    });

  } catch (error) {
    console.error(`[RAG ERROR] Topic-based result processing failed:`, error);
    throw error;
  }
}

// Helper function to build topic-aware context
function buildTopicAwareContext(documents, metadatas, queryResults) {
  // Sort results by relevance
  const sortedResults = documents.map((doc, index) => ({
    document: doc,
    metadata: metadatas[index],
    relevanceScore: calculateRelevanceScore(metadatas[index], queryResults)
  })).sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Build context with topic headers
  const contextSections = [];
  let currentTopic = null;

  sortedResults.forEach(result => {
    const topic = result.metadata.topic;
    const chunkType = result.metadata.chunkType;

    // Add topic header if topic changes
    if (topic !== currentTopic) {
      contextSections.push(`\n--- ${topic.toUpperCase()} SECTION ---`);
      currentTopic = topic;
    }

    // Add chunk type indicator
    let chunkIndicator = '';
    if (chunkType === 'dedicated_topic') {
      chunkIndicator = '[Complete Topic] ';
    } else if (chunkType === 'sub_topic') {
      chunkIndicator = '[Sub-topic] ';
    }

    contextSections.push(`${chunkIndicator}${result.document}`);
  });

  return contextSections.join('\n\n').trim();
}

// Helper function to calculate relevance score
function calculateRelevanceScore(metadata, queryResults) {
  let score = 0;

  if (metadata.topic === queryResults.queryTopic) {
    score += 10;
  }

  if (metadata.chunkType === 'dedicated_topic') {
    score += 5;
  } else if (metadata.chunkType === 'sub_topic') {
    score += 3;
  }

  score += (metadata.confidence || 0) * 2;

  return score;
}

// Helper function to build enhanced sources
function buildEnhancedSources(metadatas, queryResults) {
  const sourceMap = {};

  metadatas.forEach(metadata => {
    const topic = metadata.topic;
    const chunkType = metadata.chunkType;
    const filename = metadata.filename || 'Unknown Document';
    const pageNumbers = metadata.pageNumbers || '1';

    const sourceKey = `${topic} (${filename})`;
    
    if (!sourceMap[sourceKey]) {
      sourceMap[sourceKey] = {
        topic,
        filename,
        chunkTypes: new Set(),
        pages: new Set(),
        chunks: [],
        confidence: 0,
        totalChunks: 0
      };
    }

    const source = sourceMap[sourceKey];
    source.chunkTypes.add(chunkType);
    source.chunks.push(metadata.chunkId);
    
    // Add page numbers
    if (pageNumbers) {
      pageNumbers.split(',').forEach(page => {
        source.pages.add(page.trim());
      });
    }
    
    source.confidence += metadata.confidence || 0;
    source.totalChunks++;
  });

  return Object.entries(sourceMap).map(([key, source]) => {
    const chunkTypes = [...source.chunkTypes].join(', ');
    const pages = [...source.pages].sort((a, b) => parseInt(a) - parseInt(b)).join(', ');
    const avgConfidence = Math.round((source.confidence / source.totalChunks) * 100) / 100;
    
    // Build display string prioritizing page numbers
    let displayString = `${source.topic} from ${source.filename}`;
    
    if (pages && pages !== '1' && pages.length > 0) {
      displayString += ` (Page${pages.length > 1 ? 's' : ''} ${pages}`;
    } else {
      displayString += ' (Page 1';
    }
    
    if (chunkTypes) {
      displayString += `, ${chunkTypes}`;
    }
    
    displayString += `, confidence: ${avgConfidence})`;
    
    // Return as object with page information prioritized
    return {
      filename: displayString,
      displayName: source.filename,
      pages: pages,
      topic: source.topic,
      chunkTypes: chunkTypes,
      confidence: avgConfidence,
      chunks: [...source.chunks].sort((a, b) => a - b).join(", ") // Keep chunks for reference but don't display
    };
  });
}

// Original query processing as fallback
async function processOriginalQuery(req, res, question, notebookId) {
  try {
    /* -------- SAVE USER MESSAGE -------- */
    try {
      const userChat = await Chat.create({
        notebookId,
        userId: req.userId,
        role: "user",
        message: question
      });
      console.log(`[RAG] Saved user message to chat history:`, userChat._id);
    } catch (saveError) {
      console.error(`[RAG ERROR] Failed to save user message:`, saveError);
      // Continue with processing even if save fails
    }

    /* -------- GET CHAT HISTORY -------- */
    let chatHistory = [];
    try {
      chatHistory = await Chat.find({
        notebookId,
        userId: req.userId
      })
      .sort({ createdAt: -1 })
      .limit(6) // Get last 6 messages for context
      .select('role message');

      console.log(`[RAG] Retrieved ${chatHistory.length} chat messages for context`);
    } catch (historyError) {
      console.error(`[RAG ERROR] Failed to retrieve chat history:`, historyError);
      // Continue without history if retrieval fails
    }

    /* -------- EMBED QUESTION -------- */
    const [questionEmbedding] = await embedText([question]);
    console.log(`[RAG] Generated question embedding`);

    /* -------- GET NOTEBOOK COLLECTION -------- */
    const collection = await chroma.getOrCreateCollection({
      name: `notebook_${notebookId}`
    });
    console.log(`[RAG] Got collection for notebook: ${notebookId}`);

    /* -------- IMPROVED RETRIEVAL -------- */
    console.log(`[RAG] Retrieving top 10 chunks...`);
    const results = await collection.query({
      queryEmbeddings: [questionEmbedding],
      nResults: 10 // Retrieve more chunks for better context coverage
    });

    const documents = results.documents?.[0] || [];
    const metadatas = results.metadatas?.[0] || [];
    const distances = results.distances?.[0] || [];

    console.log(`[RAG] Retrieved ${documents.length} chunks`);
    console.log(`[RAG] Chunk distances:`, distances);
    console.log(`[RAG] Chunk lengths:`, documents.map(doc => doc.length));

    if (documents.length === 0) {
      console.log(`[RAG] No chunks retrieved from vector database`);
      
      // Save assistant message
      await Chat.create({
        notebookId,
        userId: req.userId,
        role: "assistant",
        message: "I couldn't find any relevant information in your notebook to answer this question. Please try rephrasing your question or check if the relevant content has been uploaded."
      });
      
      return res.json({
        answer: "I couldn't find any relevant information in your notebook to answer this question. Please try rephrasing your question or check if the relevant content has been uploaded.",
        sources: []
      });
    }

    // Enhance metadatas with page estimation if needed
    const enhancedMetadatas = metadatas.map((metadata, index) => {
      if (!metadata.pages || metadata.pages.length === 0 || (metadata.pages.length === 1 && metadata.pages[0] === 1)) {
        // Create a chunk object for page estimation
        const chunkForEstimation = {
          content: documents[index] || '',
          metadata: metadata
        };
        
        // Estimate page numbers
        const enhancedChunk = PageEstimationService.estimatePageNumbers([chunkForEstimation], 10)[0];
        
        if (enhancedChunk && enhancedChunk.pages) {
          console.log(`[RAG] Estimated page ${enhancedChunk.pages[0]} for chunk ${index}`);
          return {
            ...metadata,
            pages: enhancedChunk.pages,
            pageNumbers: enhancedChunk.pageNumbers,
            estimatedPage: true
          };
        }
      }
      return metadata;
    });

    /* -------- DEBUG: PRINT RETRIEVED CHUNKS -------- */
    console.log(`[RAG DEBUG] Retrieved chunks:`);
    documents.forEach((doc, i) => {
      console.log(`\n--- Chunk ${i + 1} (distance: ${distances[i]}) ---`);
      console.log(doc.substring(0, 300) + (doc.length > 300 ? "..." : ""));
      if (enhancedMetadatas[i] && enhancedMetadatas[i].pages) {
        console.log(`Page: ${enhancedMetadatas[i].pageNumbers} (estimated: ${enhancedMetadatas[i].estimatedPage || false})`);
      }
    });

    /* -------- IMPROVED CONTEXT CONSTRUCTION -------- */
    // Combine all retrieved chunks without filtering
    const documentContext = documents.join("\n\n");
    console.log(`[RAG] Combined context length: ${documentContext.length} characters`);
    console.log(`[RAG] Context preview:`, documentContext.substring(0, 200) + "...");

    /* -------- RETRIEVE RELEVANT IMAGES -------- */
    let relevantImages = [];
    try {
      relevantImages = await spatialLinkingService.getRelevantImagesForQuery(notebookId, questionEmbedding, 3, question);
      console.log(`[RAG] Retrieved ${relevantImages.length} relevant images for the query`);
    } catch (imageError) {
      console.warn(`[RAG] Failed to retrieve relevant images:`, imageError.message);
    }

    /* -------- ENHANCE CONTEXT WITH IMAGES -------- */
    const enhancedContext = await spatialLinkingService.enhanceContextWithImages(documentContext, relevantImages);
    console.log(`[RAG] Enhanced context with image references`);

    /* -------- BUILD CONVERSATIONAL CONTEXT -------- */
    let conversationHistory = "";
    if (chatHistory.length > 0) {
      // Reverse to show oldest first (excluding the current question)
      const recentMessages = chatHistory.slice(1).reverse();
      conversationHistory = recentMessages.map(msg => 
        `${msg.role}: ${msg.message}`
      ).join("\n");
      
      console.log(`[RAG] Added conversation history with ${recentMessages.length} messages`);
    }

    /* -------- BUILD FINAL CONTEXT -------- */
    const finalContext = conversationHistory ? 
      `Conversation History:\n${conversationHistory}\n\nContext:\n${enhancedContext}` :
      enhancedContext;

    if (finalContext.trim().length === 0) {
      console.log(`[RAG] Empty context after combining chunks`);
      
      // Save assistant message
      await Chat.create({
        notebookId,
        userId: req.userId,
        role: "assistant",
        message: "I couldn't find sufficient relevant information in your notebook to answer this question accurately."
      });
      
      return res.json({
        answer: "I couldn't find sufficient relevant information in your notebook to answer this question accurately.",
        sources: []
      });
    }

    /* -------- SYNTHESIZE ANSWER -------- */
    console.log(`[RAG] Synthesizing answer with context`);
    const answer = await synthesizeAnswer({
      question,
      context: finalContext
    });

    /* -------- COMPUTE ACCURACY METRICS -------- */
    let accuracyMetrics = null;
    try {
      accuracyMetrics = await evaluateAccuracyMetrics({
        question,
        answer,
        context: documentContext,
        distances,
        chunksRetrieved: documents.length
      });
    } catch (metricsError) {
      console.warn(`[RAG] Metrics evaluation failed:`, metricsError.message);
    }

    /* -------- SAVE ASSISTANT MESSAGE -------- */
    // Build relevantImages data for persistence
    const imageDataForStorage = relevantImages.map(img => ({
      id: img._id?.toString(),
      heading: img.heading,
      pageNumber: img.pageNumber,
      imageUrl: img.imageData && img.imageData.startsWith('data:') 
        ? img.imageData  // base64 data URI — works without disk
        : img.imagePath?.startsWith('http') 
          ? img.imagePath 
          : `${req.protocol}://${req.get('host')}${img.imagePath}`,
      imageType: img.imageType,
      confidence: img.confidence,
      relevanceScore: img.relevanceScore
    }));

    try {
      const assistantChat = await Chat.create({
        notebookId,
        userId: req.userId,
        role: "assistant",
        message: answer,
        relevantImages: imageDataForStorage.length > 0 ? imageDataForStorage : undefined,
        accuracyMetrics: accuracyMetrics || undefined
      });
      console.log(`[RAG] Saved assistant message to chat history:`, assistantChat._id);
    } catch (saveError) {
      console.error(`[RAG ERROR] Failed to save assistant message:`, saveError);
      // Continue with response even if save fails
    }

    /* -------- BUILD SOURCES -------- */
    const sourceMap = {};
    documents.forEach((doc, i) => {
      const filename = enhancedMetadatas[i]?.filename;
      const pageNumbers = enhancedMetadatas[i]?.pageNumbers;
      const chunkIndex = enhancedMetadatas[i]?.chunkIndex;

      if (!filename) return;

      sourceMap[filename] = sourceMap[filename] || {
        chunks: new Set(),
        pages: new Set()
      };

      if (typeof chunkIndex === "number") {
        sourceMap[filename].chunks.add(chunkIndex);
      }
      
      // Add page numbers if available
      if (pageNumbers) {
        pageNumbers.split(',').forEach(page => {
          sourceMap[filename].pages.add(page.trim());
        });
      }
    });

    const sources = Object.entries(sourceMap).map(
      ([filename, info]) => {
        const pages = [...info.pages].sort((a, b) => parseInt(a) - parseInt(b)).join(", ");
        
        // Build display string prioritizing page numbers
        let displayString;
        
        // If we have page numbers, show them
        if (pages && pages !== '1' && pages.length > 0) {
          displayString = `${filename} (Page${pages.includes(',') ? 's' : ''} ${pages})`;
        } else {
          // If no page info, just show filename
          displayString = `${filename} (Page 1)`;
        }
        
        // Return as object
        return {
          filename: displayString,
          displayName: filename,
          pages: pages,
          chunks: [...info.chunks].sort((a, b) => a - b).join(", ")
        };
      })


    console.log(`[RAG] Generated answer with ${sources.length} sources`);
    console.log(`[RAG] Answer length: ${answer.length}`);

    res.json({ 
      answer, 
      sources,
      relevantImages: imageDataForStorage,
      accuracyMetrics
    });
  } catch (error) {
    console.error(`[RAG ERROR] Query processing failed:`, error);
    res.status(500).json({
      message: "An error occurred while processing your question",
      error: error.message
    });
  }
}
