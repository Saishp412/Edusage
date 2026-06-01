const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

async function testImageMagick() {
  console.log("🧪 Testing ImageMagick installation...");
  
  const possiblePaths = [
    '"C:\\Program Files\\ImageMagick-7.1.2-Q16-HDRI\\convert.exe"',
    '"C:\\Program Files\\ImageMagick-7.1.2-Q16-HDRI\\magick.exe"',
    'convert',
    'magick'
  ];
  
  for (const convertPath of possiblePaths) {
    console.log(`🔧 Testing path: ${convertPath}`);
    try {
      const result = await execPromise(`${convertPath} -version`);
      console.log(`✅ Success with ${convertPath}:`);
      console.log(result.stdout);
      return convertPath;
    } catch (err) {
      console.log(`❌ Failed with ${convertPath}: ${err.message}`);
    }
  }
  
  throw new Error("No working ImageMagick installation found");
}

async function testPdfConversion() {
  console.log("🧪 Testing PDF conversion...");
  
  // Create a test PDF path (you'll need to provide an actual PDF)
  const testPdf = "test.pdf"; // You need to place a test PDF here
  const outputPath = "test-output.png";
  
  if (!fs.existsSync(testPdf)) {
    console.log("❌ Test PDF not found. Please place a PDF file named 'test.pdf' in the backend directory.");
    return;
  }
  
  const workingPath = await testImageMagick();
  
  try {
    const command = `${workingPath} -density 150 -quality 90 "${testPdf}[0]" "${outputPath}"`;
    console.log("⚡ Executing:", command);
    
    await execPromise(command);
    
    if (fs.existsSync(outputPath)) {
      console.log("✅ PDF conversion successful!");
      console.log("📁 Output file:", outputPath);
    } else {
      console.log("❌ Output file was not created");
    }
  } catch (err) {
    console.error("💥 PDF conversion failed:", err.message);
  }
}

// Run tests
testImageMagick()
  .then(() => testPdfConversion())
  .catch(console.error);
