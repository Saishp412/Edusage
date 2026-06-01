require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');
console.log('MongoDB URI:', process.env.MONGO_URI ? 'Set' : 'Not set');

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };
    
    await mongoose.connect(process.env.MONGO_URI, options);
    console.log('✅ MongoDB connected successfully!');
    
    // Test a simple operation
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(`✅ Found ${collections.length} collections`);
    
    await mongoose.disconnect();
    console.log('✅ Disconnected successfully');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.error('💡 Solution: Check your internet connection and MongoDB URI');
    } else if (error.message.includes('auth')) {
      console.error('💡 Solution: Check username/password in MongoDB URI');
    } else if (error.message.includes('timeout')) {
      console.error('💡 Solution: Check network connectivity or try different server');
    }
  }
}

testConnection();
