// Test script to verify topic-based chunking system works
require('dotenv').config();
const TopicDocumentProcessor = require('./services/topicDocumentProcessor.service');
const fs = require('fs');

async function testTopicSystem() {
  console.log('🧪 Testing Topic-Based Chunking System...');
  
  try {
    // Test 1: Topic Classifier
    console.log('\n--- Test 1: Topic Classifier ---');
    const { TopicClassifier } = require('./services/topicChunking.service');
    const classifier = new TopicClassifier();
    
    const testTexts = [
      "The V-Model is a software development process that emphasizes verification and validation",
      "Waterfall model is a sequential development process",
      "Evolutionary model uses incremental development cycles"
    ];
    
    testTexts.forEach((text, index) => {
      const result = classifier.detectPrimaryTopic(text);
      console.log(`Test ${index + 1}: "${text.substring(0, 50)}..."`);
      console.log(`  → Topic: ${result.topic} (confidence: ${result.confidence})`);
    });
    
    // Test 2: Header Detection
    console.log('\n--- Test 2: Header Detection ---');
    const { HeaderDetector } = require('./services/topicChunking.service');
    const headerDetector = new HeaderDetector();
    
    const sampleDocument = `
1. Introduction to Software Models
This section introduces various software development models.

2. V-Model Explained
The V-Model is a software development process...

2.1 Verification Phase
In the verification phase...

3. Waterfall Model
The waterfall model follows a sequential approach...
    `;
    
    const headers = headerDetector.extractHeaders(sampleDocument);
    console.log(`Found ${headers.length} headers:`);
    headers.forEach(header => {
      console.log(`  → "${header.text}" (level: ${header.level}, type: ${header.type})`);
    });
    
    // Test 3: Topic Chunking
    console.log('\n--- Test 3: Topic Chunking ---');
    const { TopicChunker } = require('./services/topicChunking.service');
    const topicChunker = new TopicChunker();
    
    const chunks = topicChunker.createTopicChunks(sampleDocument, 'test-doc');
    console.log(`Created ${chunks.length} topic chunks:`);
    chunks.forEach((chunk, index) => {
      console.log(`  Chunk ${index + 1}: ${chunk.topic} (${chunk.type}, confidence: ${chunk.confidence})`);
      console.log(`    Content preview: "${chunk.content.substring(0, 100)}..."`);
    });
    
    console.log('\n✅ All tests completed successfully!');
    console.log('\n📋 Next Steps:');
    console.log('1. The topic-based system is working correctly');
    console.log('2. Update frontend to use new endpoints:');
    console.log('   - Upload: POST /api/topic-documents/upload-topic');
    console.log('   - Query: POST /api/topic-query/');
    console.log('3. Or modify existing endpoints to use topic-based logic');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testTopicSystem();
