// Simple test to verify all dependencies load correctly
console.log('Testing dependency loading...');

try {
  // Test basic Node.js modules
  const fs = require('fs');
  const path = require('path');
  console.log('✅ Basic Node.js modules loaded');

  // Test existing dependencies
  const mongoose = require('mongoose');
  const pdfParse = require('pdf-parse');
  console.log('✅ Existing dependencies loaded');

  // Test new dependencies
  const pdfjsLib = require('pdfjs-dist');
  const sharp = require('sharp');
  console.log('✅ New PDF processing dependencies loaded (PDF.js v2.16.105)');

  // Test our services
  const advancedPDFExtractor = require('./services/advancedPDFExtractor.service');
  const spatialLinkingService = require('./services/spatialLinking.service');
  console.log('✅ Custom services loaded');

  // Test models
  const Diagram = require('./models/Diagram.model');
  console.log('✅ Models loaded');

  console.log('\n🎉 All dependencies loaded successfully!');
  console.log('The image extraction feature is ready to use.');

} catch (error) {
  console.error('❌ Dependency loading failed:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}
