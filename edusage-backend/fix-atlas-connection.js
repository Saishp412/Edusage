// MongoDB Atlas Connection Fix Script
const mongoose = require('mongoose');
require('dotenv').config();

console.log('=== MongoDB Atlas Connection Fix ===');

// Check if we have the required environment variables
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI not found in .env file');
  console.log('\n🔧 Fix: Add your MongoDB Atlas URI to .env file:');
  console.log('MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority');
  process.exit(1);
}

// Enhanced connection options for MongoDB Atlas
const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 15000, // Increased timeout
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 1,
  maxIdleTimeMS: 30000,
  retryWrites: true,
  w: 'majority',
  bufferCommands: false,
  bufferMaxEntries: 0
};

async function connectWithDetailedErrorHandling() {
  try {
    console.log('🔗 Connecting to MongoDB Atlas...');
    console.log('📍 Cluster: edusage.v61laga.mongodb.net');
    
    await mongoose.connect(process.env.MONGO_URI, connectionOptions);
    
    console.log('✅ MongoDB Atlas connected successfully!');
    
    // Verify connection with admin command
    const admin = mongoose.connection.db.admin();
    const result = await admin.ping();
    console.log('✅ Database verified with ping:', result);
    
    // Get server info
    const serverStatus = await admin.serverStatus();
    console.log(`✅ MongoDB version: ${serverStatus.version}`);
    
    return true;
    
  } catch (error) {
    console.error('❌ MongoDB Atlas Connection Failed');
    console.error(`\n📝 Error Details:`);
    console.error(`   Message: ${error.message}`);
    console.error(`   Code: ${error.code || 'N/A'}`);
    console.error(`   Name: ${error.name}`);
    
    // Specific error solutions
    console.error(`\n🔧 Solutions for "${error.message}":`);
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('   1. Check your internet connection');
      console.error('   2. Verify cluster name: edusage.v61laga.mongodb.net');
      console.error('   3. Try accessing MongoDB Atlas dashboard');
      console.error('   4. Check if DNS is working (try ping edusage.v61laga.mongodb.net)');
    }
    
    if (error.message.includes('auth') || error.code === 18 || error.code === 8000) {
      console.error('   1. Verify username: saish');
      console.error('   2. Check password in the URI');
      console.error('   3. Go to MongoDB Atlas > Database Access > Edit user');
      console.error('   4. Ensure user has read/write permissions on database');
    }
    
    if (error.message.includes('IP') || error.code === 13 || error.message.includes('not authorized')) {
      console.error('   1. Add your IP to MongoDB Atlas whitelist');
      console.error('   2. Go to Atlas > Network Access > Add IP Address');
      console.error('   3. Click "Add Current IP" or add 0.0.0.0/0 for any IP');
      console.error('   4. Wait 2-3 minutes for IP whitelist to update');
    }
    
    if (error.message.includes('timeout') || error.code === 89) {
      console.error('   1. Check network connectivity');
      console.error('   2. Verify firewall isn\'t blocking MongoDB ports');
      console.error('   3. Try from different network');
      console.error('   4. Check if MongoDB Atlas cluster is running');
    }
    
    if (error.message.includes('cluster') || error.message.includes('tenant')) {
      console.error('   1. Verify cluster name is correct: edusage.v61laga');
      console.error('   2. Check cluster is active in MongoDB Atlas');
      console.error('   3. Verify project and cluster names match URI');
    }
    
    console.error('\n📋 Quick Fix Checklist:');
    console.error('☐ Internet connection working');
    console.error('☐ MongoDB Atlas cluster active');
    console.error('☐ IP address whitelisted');
    console.error('☐ Database user has permissions');
    console.error('☐ URI format is correct');
    console.error('☐ Password is correct');
    
    return false;
  }
}

// Run the connection test
connectWithDetailedErrorHandling().then(success => {
  if (success) {
    console.log('\n🎉 MongoDB Atlas is ready!');
    console.log('You can now start your server with: npm run dev');
  } else {
    console.log('\n⚠️  Fix the issues above before starting the server');
  }
  
  // Close connection if it was established
  if (mongoose.connection.readyState === 1) {
    mongoose.disconnect();
  }
  
  process.exit(success ? 0 : 1);
});
