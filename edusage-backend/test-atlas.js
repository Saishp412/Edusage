const mongoose = require('mongoose');
require('dotenv').config();

console.log('=== MongoDB Atlas Connection Test ===');
console.log('Testing connection to MongoDB Atlas...');

// Updated connection options for MongoDB Atlas
const atlasOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 1,
  maxIdleTimeMS: 30000,
  retryWrites: true,
  w: 'majority'
};

async function testAtlasConnection() {
  try {
    console.log('1. Testing environment variables...');
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI not found in .env file');
    }
    console.log('   ✓ MONGO_URI found');

    console.log('2. Testing mongoose import...');
    console.log('   ✓ Mongoose imported successfully');

    console.log('3. Attempting MongoDB Atlas connection...');
    console.log('   Connecting to: mongodb+srv://[hidden]@[cluster]/[database]');

    await mongoose.connect(process.env.MONGO_URI, atlasOptions);
    
    console.log('✅ SUCCESS: MongoDB Atlas connected successfully!');
    
    // Test database operations
    console.log('4. Testing database operations...');
    const db = mongoose.connection.db;
    const admin = db.admin();
    
    // Test server status
    const serverStatus = await admin.serverStatus();
    console.log(`   ✓ Server version: ${serverStatus.version}`);
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log(`   ✓ Found ${collections.length} collections`);
    
    if (collections.length > 0) {
      console.log('   Collections:', collections.map(c => c.name).join(', '));
    }

    console.log('5. Connection test completed successfully!');
    return true;

  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:');
    console.error(`   Error: ${error.message}`);
    console.error(`   Error Code: ${error.code || 'N/A'}`);
    
    // Specific error handling
    if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('\n🔧 DNS Resolution Issue:');
      console.error('   • Check your internet connection');
      console.error('   • Verify the cluster name in the URI');
      console.error('   • Try using a VPN if there are network restrictions');
    }
    
    if (error.message.includes('auth') || error.code === 18) {
      console.error('\n🔧 Authentication Issue:');
      console.error('   • Verify username: saish');
      console.error('   • Check password in the URI');
      console.error('   • Ensure user has database access permissions');
    }
    
    if (error.message.includes('IP') || error.code === 13) {
      console.error('\n🔧 IP Access Issue:');
      console.error('   • Add your IP to MongoDB Atlas whitelist');
      console.error('   • Or use 0.0.0.0/0 for any IP (development only)');
    }
    
    if (error.message.includes('timeout')) {
      console.error('\n🔧 Timeout Issue:');
      console.error('   • Check network connectivity');
      console.error('   • Verify firewall settings');
      console.error('   • Try connecting from a different network');
    }

    return false;
  } finally {
    // Close connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('   ✓ Connection closed');
    }
  }
}

// Run the test
testAtlasConnection().then(success => {
  if (success) {
    console.log('\n🎉 MongoDB Atlas is ready for use!');
  } else {
    console.log('\n⚠️  Please fix the issues above before starting the server');
  }
  process.exit(success ? 0 : 1);
});
