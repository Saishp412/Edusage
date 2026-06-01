const axios = require("axios");

async function testOllama() {
  console.log("Testing Ollama connectivity...");
  
  try {
    // Test 1: Check if Ollama is running
    console.log("1. Testing Ollama server connection...");
    const response = await axios.get('http://localhost:11434/api/tags', {
      timeout: 5000
    });
    console.log("✅ Ollama server is running");
    console.log("Available models:", response.data.models);
    
    // Test 2: Test model generation
    console.log("2. Testing phi3:mini model generation...");
    const testResponse = await axios.post('http://localhost:11434/api/generate', {
      model: "phi3:mini",
      prompt: "Test prompt - say hello",
      stream: false
    }, {
      timeout: 30000
    });
    
    console.log("✅ Model generation working");
    console.log("Test response:", testResponse.data.response);
    
  } catch (error) {
    console.error("❌ Ollama test failed:", error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error("Solution: Start Ollama server");
      console.error("Run: ollama serve");
    } else if (error.code === 'ECONNABORTED') {
      console.error("Solution: Increase timeout or check model loading");
      console.error("Run: ollama pull phi3:mini");
    }
  }
}

testOllama();
