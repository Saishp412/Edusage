/**
 * vectorStore.service.js
 *
 * Drop-in MongoDB replacement for ChromaDB.
 * Uses JS cosine similarity as the primary search method (reliable, zero config).
 * If a MongoDB Atlas Vector Search index named "vector_index" exists on the
 * "vectorchunks" collection, it will be used automatically for faster search.
 *
 * Schema: { collectionName, chunkId, text, embedding: [float], metadata: {} }
 */

const mongoose = require("mongoose");
const embedText = require("./embedding.service");

/* ─────────────── Mongoose Schema ─────────────── */
const chunkSchema = new mongoose.Schema(
  {
    collectionName: { type: String, required: true, index: true },
    chunkId:        { type: String, required: true },
    text:           { type: String, required: true },
    embedding:      { type: [Number], required: true },
    metadata:       { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

chunkSchema.index({ collectionName: 1, chunkId: 1 }, { unique: true });

const VectorChunk =
  mongoose.models.VectorChunk || mongoose.model("VectorChunk", chunkSchema);

/* ─────────────── Cosine Similarity ─────────────── */
function cosineSimilarity(a, b) {
  if (!a || !b || a.length !== b.length) return 0;
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot  += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  return magA === 0 || magB === 0 ? 0 : dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

/* ─────────────── VectorCollection Class ─────────────── */
class VectorCollection {
  constructor(name) {
    this.name = name;
  }

  /**
   * Store chunks.
   * ChromaDB signature: add({ ids, documents, embeddings?, metadatas? })
   * If embeddings are not provided, they are generated via OpenAI.
   */
  async add({ ids, documents, embeddings, metadatas }) {
    // Auto-generate embeddings if not provided
    let vecs = embeddings;
    if (!vecs || vecs.length === 0 || vecs[0] === undefined) {
      console.log(`[VectorStore] Auto-generating embeddings for ${ids.length} chunks in "${this.name}"`);
      vecs = await embedText(documents);
    }

    const ops = ids.map((id, i) => ({
      updateOne: {
        filter: { collectionName: this.name, chunkId: id },
        update: {
          $set: {
            collectionName: this.name,
            chunkId:        id,
            text:           documents[i],
            embedding:      vecs[i] || [],
            metadata:       metadatas ? (metadatas[i] || {}) : {}
          }
        },
        upsert: true
      }
    }));

    await VectorChunk.bulkWrite(ops);
    console.log(`[VectorStore] Stored ${ids.length} chunks in collection "${this.name}"`);
  }

  /**
   * Semantic similarity search.
   * ChromaDB signature: query({ queryEmbeddings, nResults, where? })
   * Returns: { documents: [[]], metadatas: [[]], distances: [[]] }
   */
  async query({ queryEmbeddings, nResults = 10, where }) {
    const queryVector = queryEmbeddings[0];

    // ── Try Atlas $vectorSearch first (fast, requires Atlas M10+ with index) ──
    try {
      const pipeline = [
        {
          $vectorSearch: {
            index:         "vector_index",
            path:          "embedding",
            queryVector:   queryVector,
            numCandidates: Math.max(nResults * 20, 200),
            limit:         Math.max(nResults * 4, 40) // over-fetch to allow post-filter
          }
        },
        {
          $match: { collectionName: this.name }  // filter after $vectorSearch
        },
        {
          $project: {
            _id:      0,
            chunkId:  1,
            text:     1,
            metadata: 1,
            score:    { $meta: "vectorSearchScore" }
          }
        },
        { $limit: nResults }
      ];

      const atlasResults = await VectorChunk.aggregate(pipeline);

      if (atlasResults && atlasResults.length > 0) {
        console.log(`[VectorStore] Atlas vector search: ${atlasResults.length} results`);
        let results = atlasResults;
        if (where) results = results.filter(r => this._matchesWhere(r.metadata, where));
        return this._format(results.slice(0, nResults));
      }
    } catch (_err) {
      // Atlas index not set up yet — fall through to JS cosine similarity
    }

    // ── JS cosine similarity fallback (always works) ──
    const filter = { collectionName: this.name };
    if (where) {
      Object.entries(where).forEach(([k, v]) => {
        filter[`metadata.${k}`] = v;
      });
    }

    const allDocs = await VectorChunk.find(filter).lean();
    console.log(`[VectorStore] Cosine search across ${allDocs.length} chunks in "${this.name}"`);

    const scored = allDocs
      .map(doc => ({
        chunkId:  doc.chunkId,
        text:     doc.text,
        metadata: doc.metadata,
        score:    cosineSimilarity(queryVector, doc.embedding)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, nResults);

    return this._format(scored);
  }

  /**
   * Fetch chunks by metadata filter.
   * ChromaDB signature: get({ where? })
   * Returns: { ids, documents, metadatas }
   */
  async get({ where } = {}) {
    const filter = { collectionName: this.name };
    if (where) {
      Object.entries(where).forEach(([k, v]) => {
        filter[`metadata.${k}`] = v;
      });
    }
    const docs = await VectorChunk.find(filter).lean();
    return {
      ids:       docs.map(d => d.chunkId),
      documents: docs.map(d => d.text),
      metadatas: docs.map(d => d.metadata)
    };
  }

  /**
   * Delete all chunks in this collection.
   */
  async delete() {
    const { deletedCount } = await VectorChunk.deleteMany({ collectionName: this.name });
    console.log(`[VectorStore] Deleted ${deletedCount} chunks from "${this.name}"`);
  }

  /* ── Private helpers ── */
  _matchesWhere(metadata, where) {
    return Object.entries(where).every(([k, v]) => metadata && metadata[k] === v);
  }

  _format(results) {
    return {
      documents: [results.map(r => r.text)],
      metadatas: [results.map(r => r.metadata)],
      distances: [results.map(r => 1 - (r.score || 0))]
    };
  }
}

/* ─────────────── Public API ─────────────── */
module.exports = {
  getOrCreateCollection: async ({ name }) => new VectorCollection(name),
  getCollection:         async ({ name }) => new VectorCollection(name),
  deleteCollection:      async ({ name }) => {
    await VectorChunk.deleteMany({ collectionName: name });
    console.log(`[VectorStore] Deleted collection "${name}"`);
  },
  listCollections: async () => {
    const names = await VectorChunk.distinct("collectionName");
    return names.map(n => ({ name: n }));
  }
};
