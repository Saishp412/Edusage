// Quick test for improved search functionality
require('dotenv').config();

const GoogleSearchService = require('./services/googleSearch.service');

async function testImprovedSearch() {
  console.log('🔍 Testing Improved Search Functionality\n');
  
  const searchService = new GoogleSearchService();
  
  // Test the problematic queries from your example
  const testQueries = [
    'Software development philosophies',
    'Project management',
    'Design'
  ];

  for (const query of testQueries) {
    console.log(`\n🔍 Searching for: "${query}"`);
    console.log('-'.repeat(50));
    
    try {
      const result = await searchService.search(query);
      
      console.log(`✅ Provider: ${result.provider}`);
      console.log(`📊 Results: ${result.results.length}`);
      
      // Show first 3 results
      result.results.slice(0, 3).forEach((res, index) => {
        console.log(`\n${index + 1}. ${res.title}`);
        console.log(`   ${res.snippet.substring(0, 100)}...`);
        console.log(`   ${res.displayLink}`);
      });
      
      if (result.results.length > 3) {
        console.log(`\n... and ${result.results.length - 3} more results`);
      }
      
    } catch (error) {
      console.log(`❌ Search failed: ${error.message}`);
    }
  }

  console.log('\n🎯 Expected Improvements:');
  console.log('✅ Better title extraction from DuckDuckGo');
  console.log('✅ More descriptive snippets');
  console.log('✅ Synthetic results as fallback');
  console.log('✅ Multiple provider attempts');
  console.log('✅ Enhanced error handling');
  
  console.log('\n📋 Setup Recommendations:');
  console.log('1. For best results, set up Google Custom Search API');
  console.log('2. Alternative: Set up SerpApi');
  console.log('3. DuckDuckGo now provides better fallback results');
  console.log('4. Synthetic results ensure you always get something useful');
}

testImprovedSearch().catch(console.error);
