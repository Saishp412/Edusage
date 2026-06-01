// Simple Google API test
require('dotenv').config();

const GoogleSearchService = require('./services/googleSearch.service');

async function quickTest() {
  console.log('🔍 Quick Google API Test');
  console.log('========================');
  
  // Check configuration
  console.log('API Key:', process.env.GOOGLE_CUSTOM_SEARCH_API_KEY ? '✅ Configured' : '❌ Missing');
  console.log('Search Engine ID:', process.env.GOOGLE_SEARCH_ENGINE_ID ? '✅ Configured' : '❌ Missing');
  
  const searchService = new GoogleSearchService();
  
  // Test a simple search
  try {
    console.log('\n🔍 Testing search: "machine learning"');
    const result = await searchService.search('machine learning');
    
    console.log(`\n✅ Search successful!`);
    console.log(`Provider: ${result.provider}`);
    console.log(`Results: ${result.results.length}`);
    
    if (result.results.length > 0) {
      console.log('\n📋 Top 3 results:');
      result.results.slice(0, 3).forEach((res, i) => {
        console.log(`\n${i + 1}. ${res.title}`);
        console.log(`   ${res.displayLink}`);
        console.log(`   Score: ${res.relevanceScore || 'N/A'}`);
      });
    }
    
  } catch (error) {
    console.log(`\n❌ Search failed: ${error.message}`);
  }
}

quickTest();
