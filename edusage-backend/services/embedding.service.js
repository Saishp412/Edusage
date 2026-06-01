const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generate embeddings using OpenAI text-embedding-3-small.
 * Returns an array of float[] vectors, one per input text.
 * Mirrors the original embedding.service.js interface exactly.
 */
async function embedText(texts) {
  if (!texts || texts.length === 0) return [];

  // OpenAI accepts up to 2048 inputs per request; batch in 100s to be safe
  const BATCH_SIZE = 100;
  const allEmbeddings = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small", // 1536 dimensions, very cheap ($0.02/1M tokens)
      input: batch
    });
    // OpenAI returns results sorted by index
    const batchEmbeddings = response.data
      .sort((a, b) => a.index - b.index)
      .map(item => item.embedding);
    allEmbeddings.push(...batchEmbeddings);
  }

  return allEmbeddings;
}

module.exports = embedText;
