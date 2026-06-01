// Simple MongoDB connection test
require('dotenv').config();

console.log('Environment variables loaded:');
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);

if (process.env.MONGO_URI) {
  console.log('MONGO_URI length:', process.env.MONGO_URI.length);
  console.log('MONGO_URI starts with mongodb:', process.env.MONGO_URI.startsWith('mongodb'));
}

try {
  const mongoose = require('mongoose');
  console.log('Mongoose imported successfully');
  
  // Test connection
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('SUCCESS: Connected to MongoDB');
      process.exit(0);
    })
    .catch(err => {
      console.log('ERROR:', err.message);
      process.exit(1);
    });
} catch (err) {
  console.log('IMPORT ERROR:', err.message);
  process.exit(1);
}
