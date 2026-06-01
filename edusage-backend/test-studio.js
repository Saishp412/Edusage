// Test script to verify studio functionality
require('dotenv').config();

const axios = require('axios');

async function testStudioEndpoint() {
  try {
    console.log('🧪 Testing Studio Endpoint...\n');

    // Test 1: Check if endpoint exists and responds
    console.log('1. Testing endpoint existence...');
    const response = await axios.post('http://localhost:5000/api/studio/generate', {
      type: 'report',
      notebookId: 'test-notebook-id',
      query: 'test query'
    }, {
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Endpoint responded successfully!');
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.log('❌ Error testing endpoint:');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else if (error.request) {
      console.log('❌ Network Error - Backend server may not be running');
      console.log('Error:', error.message);
    } else {
      console.log('Error:', error.message);
    }
  }

  try {
    // Test 2: Check backend server is running
    console.log('\n2. Testing backend server health...');
    const healthResponse = await axios.get('http://localhost:5000/health', { timeout: 5000 });
    console.log('✅ Backend server is running');
  } catch (error) {
    console.log('❌ Backend server health check failed:');
    console.log('Error:', error.message);
  }

  try {
    // Test 3: Check if studio service is properly imported
    console.log('\n3. Testing studio service import...');
    const studioService = require('./services/studio.service');
    console.log('✅ Studio service imported successfully');
    console.log('Available functions:', Object.keys(studioService));
  } catch (error) {
    console.log('❌ Studio service import failed:');
    console.log('Error:', error.message);
  }

  console.log('\n📋 Test Summary:');
  console.log('1. Make sure backend server is running on port 5000');
  console.log('2. Check if studio routes are properly registered');
  console.log('3. Verify authentication middleware is working');
  console.log('4. Ensure ChromaDB collections exist for the notebook');
  console.log('5. Check OpenAI API key is configured');
}

testStudioEndpoint();
