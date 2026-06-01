/**
 * Backfill contextText for existing diagrams in the database.
 * For each diagram, find the text chunks on the same page and store 
 * them as contextText for keyword matching during queries.
 */
require('dotenv').config();
const { connectToAtlas } = require('./database');
const Diagram = require('./models/Diagram.model');
const Document = require('./models/Document.model');

async function backfillContextText() {
  console.log('Connecting to database...');
  const connected = await connectToAtlas();
  if (!connected) {
    console.error('Failed to connect to database');
    process.exit(1);
  }

  console.log('Fetching all diagrams...');
  const diagrams = await Diagram.find({});
  console.log(`Found ${diagrams.length} diagrams`);

  let updatedCount = 0;
  
  // Group diagrams by document
  const diagramsByDoc = {};
  for (const diagram of diagrams) {
    const docId = diagram.documentId?.toString();
    if (!docId) continue;
    if (!diagramsByDoc[docId]) diagramsByDoc[docId] = [];
    diagramsByDoc[docId].push(diagram);
  }

  // Process each document
  for (const [docId, docDiagrams] of Object.entries(diagramsByDoc)) {
    try {
      const doc = await Document.findById(docId).select('textContent filename');
      if (!doc || !doc.textContent) {
        console.log(`  Skip doc ${docId} - no text content`);
        continue;
      }

      // Simple page estimation: split text into rough pages
      // (roughly 3000 chars per page is a common heuristic)
      const fullText = doc.textContent;
      const charsPerPage = 3000;
      const totalPages = Math.max(1, Math.ceil(fullText.length / charsPerPage));
      
      for (const diagram of docDiagrams) {
        if (diagram.contextText && diagram.contextText.length > 10) {
          // Already has context text
          continue;
        }

        const pageNum = diagram.pageNumber || 1;
        
        // Extract approximate text for this page
        const startIdx = (pageNum - 1) * charsPerPage;
        const endIdx = Math.min(pageNum * charsPerPage, fullText.length);
        const pageText = fullText.substring(startIdx, endIdx);
        
        if (pageText.trim().length > 0) {
          const contextText = pageText.trim().substring(0, 2000);
          
          // Also try to derive a better heading from the page text
          let heading = diagram.heading;
          if (heading.includes(' - Page ') && heading.includes(', Image ')) {
            // Generic heading, try to find a better one from page text
            // Look for lines that look like headings (short, possibly uppercase)
            const lines = contextText.split('\n').map(l => l.trim()).filter(l => l.length > 3);
            for (const line of lines) {
              // Headings are typically short (< 80 chars) and might be uppercase or title case
              if (line.length >= 5 && line.length <= 80) {
                const uppercaseRatio = (line.match(/[A-Z]/g) || []).length / line.length;
                if (uppercaseRatio > 0.3 || line.length <= 50) {
                  heading = line;
                  break;
                }
              }
            }
          }
          
          await Diagram.findByIdAndUpdate(diagram._id, { 
            contextText,
            heading
          });
          console.log(`  Updated diagram "${heading}" (page ${pageNum}) with ${contextText.length} chars of context`);
          updatedCount++;
        }
      }
    } catch (err) {
      console.error(`  Error processing doc ${docId}:`, err.message);
    }
  }

  console.log(`\nUpdated ${updatedCount} diagrams with context text`);
  process.exit(0);
}

backfillContextText().catch(err => {
  console.error('Error backfilling context text:', err);
  process.exit(1);
});
