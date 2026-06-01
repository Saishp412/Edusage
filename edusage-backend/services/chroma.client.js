let chroma;

try {
  const { ChromaClient } = require("chromadb");
  chroma = new ChromaClient({
    path: process.env.CHROMA_URL || "http://localhost:8000"
  });
} catch (error) {
  console.warn("ChromaDB not available. Vector search features will be disabled.");
  chroma = null;
}

// Embedding function for ChromaDB
const embeddingFunction = {
  generate: async function(texts) {
    const embedText = require("./embedding.service");
    if (Array.isArray(texts)) {
      return await embedText(texts);
    } else {
      const [embedding] = await embedText([texts]);
      return embedding;
    }
  }
};

module.exports = {
  getCollection: async ({ name }) => {
    if (!chroma) throw new Error("ChromaDB not available");
    return await chroma.getCollection({
      name,
      embeddingFunction
    });
  },

  getOrCreateCollection: async ({ name }) => {
    if (!chroma) throw new Error("ChromaDB not available");
    return await chroma.getOrCreateCollection({
      name,
      embeddingFunction
    });
  },

  deleteCollection: (opts) => {
    if (!chroma) throw new Error("ChromaDB not available");
    return chroma.deleteCollection(opts);
  }
};
