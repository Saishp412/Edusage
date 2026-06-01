console.log('Testing PDF.js v2.16.105 and Sharp dependencies...');

try {
  const pdfjsLib = require('pdfjs-dist');
  console.log('✅ PDF.js v2.16.105 loaded successfully');
  
  const sharp = require('sharp');
  console.log('✅ Sharp loaded successfully');
  
  // Test our service
  const advancedPDFExtractor = require('./services/advancedPDFExtractor.service');
  console.log('✅ Advanced PDF extractor service loaded (standard PDF.js)');
  
  console.log('\n🎉 All dependencies working correctly!');
  console.log('Ready for PDF image extraction with PDF.js v2.16.105.');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('Stack:', error.stack);
}
