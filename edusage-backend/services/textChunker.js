function chunkText(text, chunkSize = 500, overlap = 100) {
  console.log(`[DEBUG] Chunking text with size: ${chunkSize}, overlap: ${overlap}`);
  console.log(`[DEBUG] Original text length: ${text.length}`);
  
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    let end = start + chunkSize;

    // avoid cutting words - find the last space before the end
    if (end < text.length) {
      end = text.lastIndexOf(" ", end);
      if (end === start) { // if no space found, force cut at chunkSize
        end = start + chunkSize;
      }
    }

    const chunk = text.slice(start, end).trim();

    // ignore garbage chunks (too short)
    if (chunk.length > 50) {
      chunks.push(chunk);
    }

    start = end - overlap;
    if (start < 0) start = 0;
  }

  console.log(`[DEBUG] Created ${chunks.length} chunks`);
  console.log(`[DEBUG] Chunk sizes:`, chunks.map(c => c.length));
  
  return chunks;
}

module.exports = chunkText;
