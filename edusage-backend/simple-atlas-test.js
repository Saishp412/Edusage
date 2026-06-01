const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();

const logFile = 'atlas-test-results.txt';

// Clear previous log
if (fs.existsSync(logFile)) {
  fs.unlinkSync(logFile);
}

function log(message) {
  console.log(message);
  fs.appendFileSync(logFile, message + '\n');
}

log('=== MongoDB Atlas Test Results ===');

async function testConnection() {
  try {
    log('Testing MongoDB Atlas connection...');
    
    if (!process.env.MONGO_URI) {
      log('ERROR: MONGO_URI not found');
      return false;
    }
    
    log('MONGO_URI found: ' + process.env.MONGO_URI.substring(0, 50) + '...');
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    };
    
    log('Attempting connection...');
    await mongoose.connect(process.env.MONGO_URI, options);
    
    log('SUCCESS: Connected to MongoDB Atlas!');
    
    // Test ping
    const db = mongoose.connection.db;
    await db.admin().ping();
    log('SUCCESS: Database ping successful');
    
    await mongoose.disconnect();
    log('SUCCESS: Disconnected cleanly');
    
    return true;
    
  } catch (error) {
    log('ERROR: ' + error.message);
    log('ERROR CODE: ' + (error.code || 'N/A'));
    
    await mongoose.disconnect().catch(() => {});
    return false;
  }
}

testConnection().then(success => {
  log('=== Test Complete: ' + (success ? 'SUCCESS' : 'FAILED') + ' ===');
  process.exit(success ? 0 : 1);
});
