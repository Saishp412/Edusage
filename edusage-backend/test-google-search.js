// Test Google Search functionality
require('dotenv').config();

const GoogleSearchService = require('./services/googleSearch.service');

async function testGoogleSearch() {
  console.log('🔍 Testing Google Search Service\n');
  
  const searchService = new GoogleSearchService();
  
  // Check provider status
  console.log('📊 Provider Status:');
  const status = searchService.getProviderStatus();
  console.log(JSON.stringify(status, null, 2));
  console.log('');

  // Test search queries
  const testQueries = [
    'software design patterns',
    'waterfall model',
    'machine learning basics'
  ];

  for (const query of testQueries) {
    console.log(`🔍 Searching for: "${query}"`);
    
    try {
      const startTime = Date.now();
      const result = await searchService.search(query);
      const endTime = Date.now();
      
      console.log(`✅ Search successful!`);
      console.log(`   Provider: ${result.provider}`);
      console.log(`   Results: ${result.results.length}`);
      console.log(`   Total Available: ${result.totalResults}`);
      console.log(`   Duration: ${endTime - startTime}ms`);
      
      if (result.results.length > 0) {
        console.log(`   First result: ${result.results[0].title}`);
        console.log(`   URL: ${result.results[0].url}`);
      }
      
    } catch (error) {
      console.log(`❌ Search failed: ${error.message}`);
    }
    
    console.log('');
  }

  console.log('🎯 Test Summary:');
  console.log('1. Check provider status above');
  console.log('2. If Google Custom Search is not configured:');
  console.log('   - Get API key from Google Cloud Console');
  console.log('   - Create Custom Search Engine at cse.google.com');
  console.log('   - Add keys to .env file');
  console.log('3. If SerpApi is not configured:');
  console.log('   - Sign up at serpapi.com');
  console.log('   - Add SERPAPI_KEY to .env file');
  console.log('4. DuckDuckGo should always work as fallback');
}

// Test individual providers
async function testIndividualProviders() {
  console.log('\n🧪 Testing Individual Providers\n');
  
  const searchService = new GoogleSearchService();
  const query = 'software engineering';

  // Test DuckDuckGo
  console.log('🦆 Testing DuckDuckGo...');
  try {
    const result = await searchService.searchDuckDuckGo(query);
    console.log(`✅ DuckDuckGo: ${result.results.length} results`);
  } catch (error) {
    console.log(`❌ DuckDuckGo failed: ${error.message}`);
  }

  // Test Google Custom Search (if configured)
  if (searchService.googleApiKey && searchService.searchEngineId) {
    console.log('🔍 Testing Google Custom Search...');
    try {
      const result = await searchService.searchGoogle(query);
      console.log(`✅ Google: ${result.results.length} results`);
    } catch (error) {
      console.log(`❌ Google failed: ${error.message}`);
    }
  } else {
    console.log('⚠️ Google Custom Search not configured');
  }

  // Test SerpApi (if configured)
  if (searchService.serpApiKey) {
    console.log('🔍 Testing SerpApi...');
    try {
      const result = await searchService.searchSerpApi(query);
      console.log(`✅ SerpApi: ${result.results.length} results`);
    } catch (error) {
      console.log(`❌ SerpApi failed: ${error.message}`);
    }
  } else {
    console.log('⚠️ SerpApi not configured');
  }
}

// Run tests
testGoogleSearch()
  .then(() => testIndividualProviders())
  .catch(console.error);
