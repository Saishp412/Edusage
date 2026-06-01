/**
 * Fix existing diagram image paths in the database.
 * Some diagrams have been stored with incorrect paths like:
 *   /69cd6433.../filename.png  (missing /uploads/diagrams/)
 *   /uploads/69ce01af.../filename.png (missing /diagrams/)
 * This script normalizes them all to /uploads/diagrams/{notebookId}/{filename}
 */
require('dotenv').config();
const { connectToAtlas } = require('./database');
const Diagram = require('./models/Diagram.model');

async function fixDiagramPaths() {
  console.log('Connecting to database...');
  const connected = await connectToAtlas();
  if (!connected) {
    console.error('Failed to connect to database');
    process.exit(1);
  }

  console.log('Fetching all diagrams...');
  const diagrams = await Diagram.find({});
  console.log(`Found ${diagrams.length} diagrams`);

  let fixedCount = 0;
  for (const diagram of diagrams) {
    const oldPath = diagram.imagePath;
    const notebookId = diagram.notebookId.toString();
    
    // Extract just the filename from the path
    const parts = oldPath.split('/');
    const filename = parts[parts.length - 1];
    
    // Construct the correct path
    const correctPath = `/uploads/diagrams/${notebookId}/${filename}`;
    
    if (oldPath !== correctPath) {
      console.log(`  FIX: ${oldPath}`);
      console.log(`    -> ${correctPath}`);
      await Diagram.findByIdAndUpdate(diagram._id, { imagePath: correctPath });
      fixedCount++;
    } else {
      // Only log first few OK ones
      if (fixedCount === 0) {
        console.log(`  OK: ${oldPath}`);
      }
    }
  }

  console.log(`\nFixed ${fixedCount} diagram paths out of ${diagrams.length} total`);
  process.exit(0);
}

fixDiagramPaths().catch(err => {
  console.error('Error fixing diagram paths:', err);
  process.exit(1);
});
