// Test Google API Configuration
require('dotenv').config();

const GoogleSearchService = require('./services/googleSearch.service');

async function testGoogleAPI() {
  console.log('🔍 Testing Google API Configuration\n');
  
  const searchService = new GoogleSearchService();
  
  // Check current configuration
  console.log('📊 Current Configuration:');
  const status = searchService.getProviderStatus();
  console.log(JSON.stringify(status, null, 2));
  console.log('');
  
  // Test if Google is configured
  if (status.googleCustomSearch.configured) {
    console.log('✅ Google Custom Search API is properly configured!');
    console.log('🎯 Testing Google search with sample query...\n');
    
    try {
      const result = await searchService.searchGoogle('machine learning algorithms');
      console.log('🎉 Google Search Results:');
      console.log(`   Provider: ${result.provider}`);
      console.log(`   Results: ${result.results.length}`);
      console.log(`   Success: ${result.success}`);
      
      if (result.results.length > 0) {
        console.log('\n📋 Sample Results:');
        result.results.slice(0, 3).forEach((res, index) => {
          console.log(`\n${index + 1}. ${res.title}`);
          console.log(`   ${res.snippet.substring(0, 100)}...`);
          console.log(`   ${res.displayLink || new URL(res.url).hostname}`);
        });
      }
      
      console.log('\n🚀 Your Google API is working correctly!');
      console.log('💡 You should now see "Google Custom Search" in your web search results.');
      
    } catch (error) {
      console.log('❌ Google Search test failed:', error.message);
      console.log('💡 Check your API key and search engine ID in .env file');
    }
    
  } else {
    console.log('❌ Google Custom Search API is NOT configured');
    console.log('');
    console.log('🔧 To fix this:');
    console.log('1. Get API key from: https://console.cloud.google.com/');
    console.log('2. Create search engine at: https://cse.google.com/');
    console.log('3. Add both keys to your .env file:');
    console.log('   GOOGLE_CUSTOM_SEARCH_API_KEY=your-key-here');
    console.log('   GOOGLE_SEARCH_ENGINE_ID=your-id-here');
    console.log('4. Restart your backend server');
    console.log('');
    console.log('📖 For detailed steps, see: GOOGLE_API_SETUP.md');
  }
  
  // Test universal search (should prioritize Google)
  console.log('\n🔄 Testing Universal Search (should prioritize Google)...');
  try {
    const universalResult = await searchService.search('software development');
    console.log(`✅ Universal Search Provider: ${universalResult.provider}`);
    console.log(`📊 Results Quality: ${universalResult.success ? 'Good' : 'Needs improvement'}`);
    console.log(`📋 Results Count: ${universalResult.results.length}`);
    
    if (universalResult.provider === 'Google Custom Search') {
      console.log('🎉 Perfect! Google is being used as primary search provider.');
    } else {
      console.log('⚠️  Google is not the primary provider. Check your .env configuration.');
    }
    
  } catch (error) {
    console.log('❌ Universal search test failed:', error.message);
  }
  
  console.log('\n📋 Summary:');
  console.log('- Google API configured:', status.googleCustomSearch.configured ? '✅ Yes' : '❌ No');
  console.log('- Search Engine ID:', status.googleCustomSearch.searchEngineId ? '✅ Yes' : '❌ No');
  console.log('- Expected provider: Google Custom Search');
  console.log('- Current provider in universal search:', universalResult.provider);
}

// Run the test
testGoogleAPI().catch(console.error);
