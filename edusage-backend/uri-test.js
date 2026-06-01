const mongoose = require('mongoose');
require('dotenv').config');

console.log('=== MongoDB Atlas URI Format Test ===');

// Different URI formats to try
const uriFormats = [
  process.env.MONGO_URI, // Original
  'mongodb+srv://saish:saishpatil0412@edusage.v61laga.mongodb.net/edusage?retryWrites=true&w=majority',
  'mongodb+srv://saish:saishpatil0412@edusage.v61laga.mongodb.net/test?retryWrites=true&w=majority'
];

async function testURI(uri, index) {
  console.log(`\n--- Testing URI Format ${index + 1} ---`);
  console.log('URI:', uri.substring(0, 50) + '...');
  
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log('✅ SUCCESS: Connected!');
    
    // Test basic operation
    const db = mongoose.connection.db;
    await db.admin().ping();
    console.log('✅ Ping successful');
    
    await mongoose.disconnect();
    console.log('✅ Disconnected');
    
    return true;
    
  } catch (error) {
    console.log('❌ FAILED:', error.message);
    await mongoose.disconnect().catch(() => {});
    return false;
  }
}

async function runTests() {
  let success = false;
  
  for (let i = 0; i < uriFormats.length; i++) {
    const uri = uriFormats[i];
    if (!uri) continue;
    
    const result = await testURI(uri, i);
    if (result) {
      success = true;
      console.log(`\n🎉 URI Format ${i + 1} works!`);
      break;
    }
  }
  
  if (!success) {
    console.log('\n❌ All URI formats failed');
    console.log('\n🔧 Common solutions:');
    console.log('1. Check MongoDB Atlas cluster is running');
    console.log('2. Verify username and password');
    console.log('3. Add your IP to Network Access whitelist');
    console.log('4. Check internet connection');
  }
  
  process.exit(success ? 0 : 1);
}

runTests();
