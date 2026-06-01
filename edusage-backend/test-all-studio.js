// Comprehensive Studio Feature Test Script
require('dotenv').config();

const { generateStudioContent } = require('./services/studio.service');

const testNotebookId = '69c41d3d8e06dc356b6d1189'; // Use your actual notebook ID

const studioFeatures = [
  'audio', 'video', 'mindmap', 'report', 
  'flashcards', 'quiz', 'infographic', 
  'slides', 'table'
];

async function testAllStudioFeatures() {
  console.log('🎬 Testing All Studio Features\n');
  console.log(`Using notebook ID: ${testNotebookId}\n`);

  const results = {};

  for (const feature of studioFeatures) {
    console.log(`🧪 Testing ${feature.toUpperCase()} feature...`);
    
    try {
      const startTime = Date.now();
      const result = await generateStudioContent(feature, testNotebookId);
      const endTime = Date.now();
      
      results[feature] = {
        success: result.success,
        duration: endTime - startTime,
        contentLength: result.content ? result.content.length : 0,
        sources: result.sources || 0,
        error: result.error || null
      };

      console.log(`✅ ${feature.toUpperCase()}: ${result.success ? 'SUCCESS' : 'FAILED'}`);
      console.log(`   Duration: ${results[feature].duration}ms`);
      console.log(`   Content Length: ${results[feature].contentLength} chars`);
      console.log(`   Sources Used: ${results[feature].sources}`);
      
      if (result.success) {
        console.log(`   Preview: ${result.content.substring(0, 100)}...`);
      } else {
        console.log(`   Error: ${result.error || 'Unknown error'}`);
      }
      
      console.log('');

    } catch (error) {
      results[feature] = {
        success: false,
        duration: 0,
        contentLength: 0,
        sources: 0,
        error: error.message
      };
      
      console.log(`❌ ${feature.toUpperCase()}: FAILED`);
      console.log(`   Error: ${error.message}`);
      console.log('');
    }
  }

  // Summary Report
  console.log('📊 STUDIO TEST SUMMARY');
  console.log('='.repeat(50));
  
  const successful = Object.values(results).filter(r => r.success).length;
  const failed = Object.values(results).filter(r => !r.success).length;
  
  console.log(`✅ Successful: ${successful}/${studioFeatures.length}`);
  console.log(`❌ Failed: ${failed}/${studioFeatures.length}`);
  console.log(`📈 Success Rate: ${Math.round((successful / studioFeatures.length) * 100)}%`);
  
  console.log('\n🔍 Detailed Results:');
  Object.entries(results).forEach(([feature, result]) => {
    const status = result.success ? '✅' : '❌';
    const duration = result.duration > 0 ? `(${result.duration}ms)` : '';
    console.log(`${status} ${feature.padEnd(12)} ${duration}`);
  });

  console.log('\n🚀 Recommendations:');
  
  if (failed === 0) {
    console.log('🎉 All studio features are working perfectly!');
  } else {
    console.log('🔧 Troubleshooting Steps:');
    console.log('1. Check if documents are uploaded to the notebook');
    console.log('2. Verify ChromaDB collections exist');
    console.log('3. Ensure OpenAI API key is valid');
    console.log('4. Check backend logs for detailed errors');
    
    const failedFeatures = Object.entries(results)
      .filter(([_, result]) => !result.success)
      .map(([feature, _]) => feature);
    
    console.log(`5. Failed features: ${failedFeatures.join(', ')}`);
  }

  console.log('\n📋 Next Steps:');
  console.log('1. Test studio features in the frontend UI');
  console.log('2. Verify download functionality works');
  console.log('3. Check content quality for each feature');
  console.log('4. Test with different notebook IDs');
}

// Run the test
testAllStudioFeatures().catch(console.error);
