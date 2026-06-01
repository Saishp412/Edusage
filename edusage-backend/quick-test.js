// Simple connection test for your new MongoDB Atlas
const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing new MongoDB Atlas connection...');
console.log('Cluster: cluster0.gzxvvvp.mongodb.net');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
})
.then(() => {
  console.log('✅ SUCCESS: Connected to MongoDB Atlas!');
  
  // Quick test
  mongoose.connection.db.admin().ping()
  .then(() => {
    console.log('✅ Database ping successful');
    console.log('🎉 Your new MongoDB Atlas is working!');
    mongoose.disconnect();
    process.exit(0);
  })
  .catch(err => {
    console.log('❌ Ping failed:', err.message);
    mongoose.disconnect();
    process.exit(1);
  });
})
.catch(err => {
  console.log('❌ Connection failed:', err.message);
  
  if (err.message.includes('IP')) {
    console.log('🔧 Add your IP to MongoDB Atlas whitelist');
  }
  if (err.message.includes('auth')) {
    console.log('🔧 Check username/password in Atlas');
  }
  
  process.exit(1);
});
