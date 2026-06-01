const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();

const resultFile = 'connection-test-results.txt';

// Clear previous results
if (fs.existsSync(resultFile)) {
  fs.unlinkSync(resultFile);
}

function log(message) {
  console.log(message);
  fs.appendFileSync(resultFile, message + '\n');
}

log('=== MongoDB Atlas Connection Test Results ===');
log('New Cluster: cluster0.gzxvvvp.mongodb.net');
log('User: saishp0412_db_user');
log('');

async function testConnection() {
  try {
    log('Testing MongoDB Atlas connection...');
    
    if (!process.env.MONGO_URI) {
      log('ERROR: MONGO_URI not found in .env');
      return false;
    }
    
    log('URI found: ' + process.env.MONGO_URI.substring(0, 60) + '...');
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });
    
    log('SUCCESS: Connected to MongoDB Atlas!');
    
    // Test ping
    const db = mongoose.connection.db;
    await db.admin().ping();
    log('SUCCESS: Database ping successful');
    
    // Get server info
    const admin = db.admin();
    const serverStatus = await admin.serverStatus();
    log('MongoDB version: ' + serverStatus.version);
    log('Server host: ' + serverStatus.host);
    
    await mongoose.disconnect();
    log('SUCCESS: Disconnected cleanly');
    
    log('');
    log('🎉 Your new MongoDB Atlas connection is working!');
    log('You can now start your server with: npm run dev');
    
    return true;
    
  } catch (error) {
    log('ERROR: ' + error.message);
    log('ERROR CODE: ' + (error.code || 'N/A'));
    
    if (error.message.includes('IP') || error.code === 13) {
      log('');
      log('🔧 SOLUTION: Add your IP to MongoDB Atlas whitelist');
      log('1. Go to MongoDB Atlas Dashboard');
      log('2. Click Network Access > Add IP Address');
      log('3. Add your current IP or 0.0.0.0/0');
      log('4. Wait 2-3 minutes');
    }
    
    if (error.message.includes('auth') || error.code === 18) {
      log('');
      log('🔧 SOLUTION: Check authentication');
      log('1. Verify user: saishp0412_db_user');
      log('2. Check password in URI');
      log('3. Go to Database Access in Atlas');
    }
    
    await mongoose.disconnect().catch(() => {});
    return false;
  }
}

testConnection().then(success => {
  log('=== FINAL RESULT: ' + (success ? 'SUCCESS' : 'FAILED') + ' ===');
  process.exit(success ? 0 : 1);
});
