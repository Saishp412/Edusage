// Test your new MongoDB Atlas connection
const mongoose = require('mongoose');
require('dotenv').config();

console.log('=== Testing New MongoDB Atlas Connection ===');
console.log('New Cluster: cluster0.gzxvvvp.mongodb.net');
console.log('User: saishp0412_db_user');

async function testNewConnection() {
  try {
    console.log('\n🔗 Connecting to your new cluster...');
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      retryWrites: true,
      w: 'majority'
    });
    
    console.log('✅ SUCCESS: Connected to new MongoDB Atlas cluster!');
    
    // Test the connection
    const db = mongoose.connection.db;
    const admin = db.admin();
    
    // Ping the database
    const pingResult = await admin.ping();
    console.log('✅ Database ping successful:', pingResult);
    
    // Get server info
    const serverStatus = await admin.serverStatus();
    console.log(`✅ MongoDB version: ${serverStatus.version}`);
    console.log(`✅ Server host: ${serverStatus.host}`);
    
    // List databases
    const databases = await admin.listDatabases();
    console.log(`✅ Available databases: ${databases.databases.length}`);
    
    console.log('\n🎉 Your new MongoDB Atlas connection is working perfectly!');
    
    await mongoose.disconnect();
    return true;
    
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error('Error:', error.message);
    console.error('Code:', error.code || 'N/A');
    
    // Specific solutions for your new cluster
    if (error.message.includes('IP') || error.code === 13) {
      console.error('\n🔧 IP Whitelist Solution:');
      console.error('1. Go to MongoDB Atlas Dashboard');
      console.error('2. Click "Network Access" in left menu');
      console.error('3. Click "Add IP Address"');
      console.error('4. Add your current IP or use 0.0.0.0/0');
      console.error('5. Wait 2-3 minutes for changes');
    }
    
    if (error.message.includes('auth') || error.code === 18) {
      console.error('\n🔧 Authentication Solution:');
      console.error('1. Verify user: saishp0412_db_user');
      console.error('2. Check password in URI');
      console.error('3. Go to Database Access > Edit user');
      console.error('4. Ensure user has read/write permissions');
    }
    
    await mongoose.disconnect().catch(() => {});
    return false;
  }
}

testNewConnection().then(success => {
  if (success) {
    console.log('\n✅ Ready to start your server!');
    console.log('Run: npm run dev');
  } else {
    console.log('\n❌ Fix the above issues first');
  }
  process.exit(success ? 0 : 1);
});
