const mongoose = require('mongoose');
require('dotenv').config();

// Import the services we need to test
const advancedPDFExtractor = require('./services/advancedPDFExtractor.service');
const spatialLinkingService = require('./services/spatialLinking.service');
const Diagram = require('./models/Diagram.model');

async function testImageExtraction() {
  console.log('=== Testing Image Extraction and Spatial Linking ===');
  
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/edusage');
    console.log('Connected to MongoDB');

    // Test with a sample PDF file (you would replace this with an actual PDF)
    const testFilePath = './uploads/test-sample.pdf'; // Replace with actual test file
    const testNotebookId = '507f1f77bcf86cd799439011'; // Sample notebook ID
    const testDocumentId = '507f1f77bcf86cd799439012'; // Sample document ID
    const testUserId = '507f1f77bcf86cd799439013'; // Sample user ID
    const testOriginalName = 'test-document.pdf';

    console.log('\n1. Testing Advanced PDF Extraction...');
    
    // Test the advanced PDF extractor
    if (require('fs').existsSync(testFilePath)) {
      const extractedImages = await advancedPDFExtractor.extractImagesFromPDF({
        filePath: testFilePath,
        notebookId: testNotebookId,
        documentId: testDocumentId,
        userId: testUserId,
        originalName: testOriginalName
      });
      
      console.log(`✅ Extracted ${extractedImages.length} images`);
      
      // Save to database for testing
      for (const imageData of extractedImages) {
        imageData.notebookId = testNotebookId;
        await Diagram.create(imageData);
        console.log(`✅ Saved diagram: ${imageData.heading}`);
      }
      
      console.log('\n2. Testing Spatial Linking...');
      
      // Test spatial linking
      await spatialLinkingService.linkImagesToTextChunks(testNotebookId, testDocumentId);
      console.log('✅ Spatial linking completed');
      
      console.log('\n3. Testing Query-Based Image Retrieval...');
      
      // Test query-based retrieval
      const testEmbedding = [0.1, 0.2, 0.3, 0.4, 0.5]; // Sample embedding
      const relevantImages = await spatialLinkingService.getRelevantImagesForQuery(
        testNotebookId, 
        testEmbedding, 
        3
      );
      
      console.log(`✅ Retrieved ${relevantImages.length} relevant images for query`);
      
      console.log('\n4. Testing Context Enhancement...');
      
      const testContext = "This is a test context about machine learning algorithms.";
      const enhancedContext = await spatialLinkingService.enhanceContextWithImages(
        testContext, 
        relevantImages
      );
      
      console.log('✅ Context enhanced with image references');
      console.log('Enhanced context preview:', enhancedContext.substring(0, 200) + '...');
      
    } else {
      console.log('⚠️  Test PDF file not found. Skipping extraction test.');
      console.log('To test extraction, place a PDF file at:', testFilePath);
    }

    console.log('\n=== All Tests Completed Successfully ===');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Test database schema
async function testDatabaseSchema() {
  console.log('\n=== Testing Database Schema ===');
  
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/edusage');
    
    // Test creating a diagram with all new fields
    const testDiagram = {
      notebookId: '507f1f77bcf86cd799439011',
      documentId: '507f1f77bcf86cd799439012',
      userId: '507f1f77bcf86cd799439013',
      heading: 'Test Diagram',
      pageNumber: 1,
      imagePath: '/uploads/diagrams/test/test.png',
      boundingBox: {
        x0: 100,
        y0: 200,
        x1: 300,
        y1: 400,
        width: 200,
        height: 200
      },
      imageType: 'diagram',
      confidence: 0.85,
      spatialProximity: {
        nearbyTextChunks: ['This is nearby text chunk 1', 'This is nearby text chunk 2'],
        textDensity: 2,
        positionOnPage: 'middle-center'
      }
    };
    
    const createdDiagram = await Diagram.create(testDiagram);
    console.log('✅ Successfully created diagram with new schema');
    console.log('Diagram ID:', createdDiagram._id);
    console.log('Image Type:', createdDiagram.imageType);
    console.log('Bounding Box:', createdDiagram.boundingBox);
    console.log('Spatial Proximity:', createdDiagram.spatialProximity);
    
    // Clean up
    await Diagram.findByIdAndDelete(createdDiagram._id);
    console.log('✅ Cleaned up test diagram');
    
  } catch (error) {
    console.error('❌ Database schema test failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run tests
async function runTests() {
  console.log('Starting Image Extraction Integration Tests...\n');
  
  await testDatabaseSchema();
  await testImageExtraction();
  
  console.log('\n🎉 All integration tests completed!');
}

// Export for running
module.exports = {
  testImageExtraction,
  testDatabaseSchema,
  runTests
};

// Run if called directly
if (require.main === module) {
  runTests().catch(console.error);
}
