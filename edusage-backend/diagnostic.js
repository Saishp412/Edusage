// Quick MongoDB Atlas Diagnostic
require('dotenv').config();

console.log('=== MongoDB Atlas Quick Diagnostic ===');

// Check environment variables
console.log('1. Environment Variables:');
console.log('   MONGO_URI:', process.env.MONGO_URI ? '✅ Found' : '❌ Missing');

if (process.env.MONGO_URI) {
  const uri = process.env.MONGO_URI;
  console.log('   URI Length:', uri.length, 'characters');
  console.log('   Contains @:', uri.includes('@') ? '✅ Yes' : '❌ No');
  console.log('   Contains mongodb+:', uri.startsWith('mongodb+') ? '✅ Yes' : '❌ No');
  console.log('   Contains cluster:', uri.includes('edusage.v61laga') ? '✅ Yes' : '❌ No');
}

// Check network connectivity
console.log('\n2. Network Test:');
const dns = require('dns');
dns.lookup('edusage.v61laga.mongodb.net', (err, address) => {
  if (err) {
    console.log('   DNS Lookup: ❌ Failed -', err.message);
    console.log('   🔧 Check internet connection or cluster name');
  } else {
    console.log('   DNS Lookup: ✅ Success -', address);
  }
});

// Check mongoose
console.log('\n3. Dependencies:');
try {
  const mongoose = require('mongoose');
  console.log('   Mongoose: ✅ Installed -', mongoose.version);
} catch (err) {
  console.log('   Mongoose: ❌ Missing -', err.message);
  console.log('   🔧 Run: npm install mongoose');
}

console.log('\n4. Recommended Actions:');
console.log('   1. Run: node fix-atlas-connection.js');
console.log('   2. Check MongoDB Atlas dashboard');
console.log('   3. Verify Network Access settings');
console.log('   4. Test Database User permissions');

console.log('\n=== Diagnostic Complete ===');
