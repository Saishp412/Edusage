const fs = require('fs');
require('dotenv').config();

// Write output to file to bypass terminal issues
const logFile = 'mongo-test-output.txt';

function log(message) {
  console.log(message);
  fs.appendFileSync(logFile, message + '\n');
}

// Clear previous log
if (fs.existsSync(logFile)) {
  fs.unlinkSync(logFile);
}

log('=== MongoDB Connection Test ===');
log('MongoDB URI: ' + (process.env.MONGO_URI ? 'Set' : 'Not set'));

if (process.env.MONGO_URI) {
  log('URI length: ' + process.env.MONGO_URI.length);
  log('URI contains cluster: ' + (process.env.MONGO_URI.includes('mongodb') ? 'Yes' : 'No'));
}

const mongoose = require('mongoose');

async function testConnection() {
  try {
    log('Attempting to connect...');
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });
    
    log('✅ SUCCESS: MongoDB connected!');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    log(`✅ Found ${collections.length} collections`);
    
    await mongoose.disconnect();
    log('✅ Disconnected');
    
  } catch (error) {
    log('❌ FAILED: ' + error.message);
    log('Error type: ' + error.name);
  }
}

testConnection().then(() => {
  log('=== Test Complete ===');
  process.exit(0);
});
