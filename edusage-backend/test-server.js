console.log('=== Testing Server Startup ===');

try {
  // Test if all required modules can be imported
  console.log('1. Testing imports...');
  const express = require('express');
  console.log('   ✓ Express imported');
  
  const cors = require('cors');
  console.log('   ✓ CORS imported');
  
  const mongoose = require('mongoose');
  console.log('   ✓ Mongoose imported');
  
  // Test basic Express app
  console.log('2. Testing Express app...');
  const app = express();
  app.use(cors());
  app.use(express.json());
  console.log('   ✓ Express app configured');
  
  // Test server startup
  console.log('3. Testing server startup...');
  const PORT = 5001; // Use different port to avoid conflicts
  const server = app.listen(PORT, () => {
    console.log(`   ✓ Test server running on port ${PORT}`);
    
    // Close after 2 seconds
    setTimeout(() => {
      server.close(() => {
        console.log('   ✓ Test server closed');
        console.log('✅ All tests passed - server should work');
        process.exit(0);
      });
    }, 2000);
  });
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
