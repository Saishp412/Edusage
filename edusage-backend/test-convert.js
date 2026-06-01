const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

async function testConvertCommand() {
  console.log("🧪 Testing ImageMagick convert command syntax...");
  
  const convertPath = '"C:\\Program Files\\ImageMagick-7.1.2-Q16-HDRI\\magick.exe"';
  
  // Test the exact syntax used in the code
  const testCommand = `${convertPath} -version`;
  
  try {
    console.log("⚡ Executing:", testCommand);
    const result = await execPromise(testCommand);
    console.log("✅ Success!");
    console.log(result.stdout);
    
    // Now test a simple conversion (if you have a PDF)
    console.log("\n📄 If you have a test.pdf, the conversion command would be:");
    console.log(`${convertPath} -density 150 -quality 90 "test.pdf[0]" "test-output.png"`);
    
  } catch (err) {
    console.error("❌ Failed:", err.message);
  }
}

testConvertCommand();
