const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB Atlas connection options
const atlasOptions = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 1,
  retryWrites: true,
  w: 'majority'
};

async function connectToAtlas() {
  console.log('🔗 Connecting to MongoDB Atlas...');
  
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI not found in .env file');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, atlasOptions);
    console.log('✅ MongoDB Atlas connected successfully!');
    
    // Test the connection
    const db = mongoose.connection.db;
    await db.admin().ping();
    console.log('✅ Database ping successful');
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:');
    console.error(`   Error: ${error.message}`);
    
    // Provide specific solutions
    if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('\n🔧 Solutions:');
      console.error('   1. Check internet connection');
      console.error('   2. Verify cluster name: edusage.v61laga.mongodb.net');
      console.error('   3. Try using VPN if needed');
    }
    
    if (error.message.includes('auth') || error.code === 18) {
      console.error('\n🔧 Solutions:');
      console.error('   1. Verify credentials in MongoDB Atlas');
      console.error('   2. Check user permissions');
      console.error('   3. Ensure user has read/write access');
    }
    
    if (error.message.includes('IP') || error.code === 13) {
      console.error('\n🔧 Solutions:');
      console.error('   1. Add your IP to Atlas whitelist');
      console.error('   2. Go to Atlas > Network Access > Add IP');
      console.error('   3. Or add 0.0.0.0/0 for development');
    }
    
    return false;
  }
}

module.exports = { connectToAtlas };
