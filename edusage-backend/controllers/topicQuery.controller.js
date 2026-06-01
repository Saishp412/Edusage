// Enhanced query controller with topic-based chunking integration
const TopicDocumentProcessor = require('../services/topicDocumentProcessor.service');
const synthesizeAnswer = require('../services/answerSynthesizer.service');
const Chat = require('../models/Chat.model');

class TopicQueryController {
  constructor() {
    this.documentProcessor = new TopicDocumentProcessor();
  }

  // Enhanced query processing with topic awareness
  async processTopicAwareQuery(req, res) {
    const notebookId = req.params.notebookId || req.body.notebookId;
    const { question } = req.body;

    console.log(`[TOPIC QUERY] Processing question: "${question}" for notebook: ${notebookId}`);

    if (!notebookId) {
      return res.status(400).json({ message: "notebookId is required" });
    }

    if (!question || question.trim().length === 0) {
      return res.status(400).json({ message: "Question is required" });
    }

    try {
      /* -------- SAVE USER MESSAGE -------- */
      try {
        const userChat = await Chat.create({
          notebookId,
          userId: req.userId,
          role: "user",
          message: question
        });
        console.log(`[TOPIC QUERY] Saved user message:`, userChat._id);
      } catch (saveError) {
        console.error(`[TOPIC QUERY ERROR] Failed to save user message:`, saveError);
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

        console.log(`[TOPIC QUERY] Retrieved ${chatHistory.length} chat messages`);
      } catch (historyError) {
        console.error(`[TOPIC QUERY ERROR] Failed to retrieve chat history:`, historyError);
      }

      /* -------- TOPIC-AWARE RETRIEVAL -------- */
      const queryResults = await this.documentProcessor.queryWithTopicAwareness(
        question, 
        notebookId, 
        6 // Get top 6 results
      );

      console.log(`[TOPIC QUERY] Retrieved ${queryResults.resultCount} topic-aware results`);
      console.log(`[TOPIC QUERY] Query topic: ${queryResults.queryTopic} (confidence: ${queryResults.queryConfidence})`);
      console.log(`[TOPIC QUERY] Result topics:`, queryResults.topicDistribution);

      const documents = queryResults.documents || [];
      const metadatas = queryResults.metadatas || [];

      if (documents.length === 0) {
        console.log(`[TOPIC QUERY] No relevant content found`);
        
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
      const documentContext = this.buildTopicAwareContext(documents, metadatas, queryResults);
      console.log(`[TOPIC QUERY] Built context with ${documentContext.length} characters`);

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
        `Conversation History:\n${conversationHistory}\n\nContext:\n${documentContext}` :
        documentContext;

      if (finalContext.trim().length === 0) {
        console.log(`[TOPIC QUERY] Empty context after processing`);
        
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
      console.log(`[TOPIC QUERY] Synthesizing answer with topic-aware context`);
      const answer = await synthesizeAnswer({
        question,
        context: finalContext
      });

      /* -------- SAVE ASSISTANT MESSAGE -------- */
      try {
        const assistantChat = await Chat.create({
          notebookId,
          userId: req.userId,
          role: "assistant",
          message: answer
        });
        console.log(`[TOPIC QUERY] Saved assistant message:`, assistantChat._id);
      } catch (saveError) {
        console.error(`[TOPIC QUERY ERROR] Failed to save assistant message:`, saveError);
      }

      /* -------- BUILD ENHANCED SOURCES -------- */
      const sources = this.buildEnhancedSources(metadatas, queryResults);

      console.log(`[TOPIC QUERY] Generated answer with ${sources.length} sources`);
      console.log(`[TOPIC QUERY] Answer length: ${answer.length}`);

      res.json({ 
        answer, 
        sources,
        queryTopic: queryResults.queryTopic,
        queryConfidence: queryResults.queryConfidence,
        topicDistribution: queryResults.topicDistribution,
        resultCount: queryResults.resultCount
      });

    } catch (error) {
      console.error(`[TOPIC QUERY ERROR] Query processing failed:`, error);
      res.status(500).json({
        message: "An error occurred while processing your question",
        error: error.message
      });
    }
  }

  // Build context with topic awareness
  buildTopicAwareContext(documents, metadatas, queryResults) {
    // Sort results by relevance (topic confidence + semantic distance)
    const sortedResults = documents.map((doc, index) => ({
      document: doc,
      metadata: metadatas[index],
      relevanceScore: this.calculateRelevanceScore(metadatas[index], queryResults)
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

  // Calculate relevance score for result ranking
  calculateRelevanceScore(metadata, queryResults) {
    let score = 0;

    // Topic matching bonus
    if (metadata.topic === queryResults.queryTopic) {
      score += 10;
    }

    // Chunk type bonus
    if (metadata.chunkType === 'dedicated_topic') {
      score += 5;
    } else if (metadata.chunkType === 'sub_topic') {
      score += 3;
    }

    // Confidence bonus
    score += metadata.confidence * 2;

    return score;
  }

  // Build enhanced sources with topic information
  buildEnhancedSources(metadatas, queryResults) {
    const sourceMap = {};

    metadatas.forEach(metadata => {
      const topic = metadata.topic;
      const chunkType = metadata.chunkType;
      const filename = metadata.filename || 'Unknown Document';

      const sourceKey = `${topic} (${filename})`;
      
      if (!sourceMap[sourceKey]) {
        sourceMap[sourceKey] = {
          topic,
          filename,
          chunkTypes: new Set(),
          chunks: [],
          confidence: 0,
          totalChunks: 0
        };
      }

      const source = sourceMap[sourceKey];
      source.chunkTypes.add(chunkType);
      source.chunks.push(metadata.chunkId);
      source.confidence += metadata.confidence;
      source.totalChunks++;
    });

    // Format source information
    return Object.entries(sourceMap).map(([key, source]) => {
      const chunkTypes = [...source.chunkTypes].join(', ');
      const avgConfidence = Math.round((source.confidence / source.totalChunks) * 100) / 100;
      
      return `${source.topic} from ${source.filename} (${chunkTypes}, confidence: ${avgConfidence})`;
    });
  }

  // Fallback to original query method if topic-based fails
  async processFallbackQuery(req, res) {
    console.log(`[TOPIC QUERY] Using fallback query processing`);
    
    // Import the original query controller
    const { askQuestion } = require('./query.controller');
    return askQuestion(req, res);
  }
}

module.exports = new TopicQueryController();
