/**
 * vectorStore.service.js
 *
 * A drop-in adapter that replaces ChromaDB with MongoDB Atlas Vector Search.
 * Exposes the same API surface that chroma.client.js used to expose:
 *   - getOrCreateCollection({ name })
 *   - getCollection({ name })
 *   - deleteCollection({ name })
 *
 * Each "collection" is a VectorCollection instance that exposes:
 *   - add({ ids, documents, embeddings, metadatas })
 *   - query({ queryEmbeddings, nResults, where })
 *   - get({ where })
 *   - delete() (deletes all docs in the collection)
 *
 * MongoDB schema per document:
 *   { _id, collectionName, chunkId, text, embedding: [float], metadata: {} }
 *
 * Atlas Vector Search index (must be created once in Atlas UI):
 *   Collection: edusage.vectorchunks
 *   Field: embedding
 *   Dimensions: 1536 (matches text-embedding-3-small)
 *   Similarity: cosine
 */

const mongoose = require("mongoose");
const embedText = require("./embedding.service");

/* ───────────────── Mongoose Schema ───────────────── */
const chunkSchema = new mongoose.Schema({
  collectionName: { type: String, required: true, index: true },
  chunkId:        { type: String, required: true },
  text:           { type: String, required: true },
  embedding:      { type: [Number], required: true },
  metadata:       { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

// Compound index for fast per-collection lookups
chunkSchema.index({ collectionName: 1, chunkId: 1 }, { unique: true });

const VectorChunk = mongoose.models.VectorChunk
  || mongoose.model("VectorChunk", chunkSchema);

/* ───────────────── Collection Class ───────────────── */
class VectorCollection {
  constructor(name) {
    this.name = name;
  }

  /**
   * Add chunks to the collection.
   * ChromaDB signature: add({ ids, documents, embeddings, metadatas })
   */
  async add({ ids, documents, embeddings, metadatas }) {
    const ops = ids.map((id, i) => ({
      updateOne: {
        filter: { collectionName: this.name, chunkId: id },
        update: {
          $set: {
            collectionName: this.name,
            chunkId: id,
            text: documents[i],
            embedding: embeddings[i],
            metadata: metadatas ? metadatas[i] : {}
          }
        },
        upsert: true
      }
    }));
    await VectorChunk.bulkWrite(ops);
  }

  /**
   * Vector similarity search.
   * ChromaDB signature: query({ queryEmbeddings, nResults, where })
   * Returns: { documents: [[...]], metadatas: [[...]], distances: [[...]] }
   */
  async query({ queryEmbeddings, nResults = 10, where }) {
    const queryVector = queryEmbeddings[0];

    // Build aggregation pipeline using Atlas $vectorSearch
    const pipeline = [
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: queryVector,
          numCandidates: Math.max(nResults * 10, 100),
          limit: nResults,
          filter: this._buildAtlasFilter(where)
        }
      },
      {
        $project: {
          _id: 0,
          chunkId: 1,
          text: 1,
          metadata: 1,
          score: { $meta: "vectorSearchScore" }
        }
      }
    ];

    // Remove undefined filter
    if (!pipeline[0].$vectorSearch.filter) {
      delete pipeline[0].$vectorSearch.filter;
    }

    // Pre-filter by collectionName using $match before vector search
    // Atlas $vectorSearch filter only supports simple equality on indexed scalar fields
    // So we filter post-query by collectionName (or use pre-filter if you've indexed collectionName)
    const allInCollection = await VectorChunk.aggregate([
      { $match: { collectionName: this.name } },
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: queryVector,
          numCandidates: Math.max(nResults * 10, 100),
          limit: nResults
        }
      },
      {
        $project: {
          _id: 0,
          chunkId: 1,
          text: 1,
          metadata: 1,
          score: { $meta: "vectorSearchScore" }
        }
      }
    ]).catch(() => []);

    // Fallback: if $vectorSearch is not available (e.g., Atlas Free M0 without vector search),
    // do a keyword-based cosine similarity in JS
    let results = allInCollection;
    if (results.length === 0) {
      results = await this._fallbackCosineSimilarity(queryVector, nResults, where);
    }

    // Apply 'where' metadata filter post-query
    if (where && Object.keys(where).length > 0) {
      results = results.filter(r => this._matchesFilter(r.metadata, where));
    }

    // Limit to nResults
    results = results.slice(0, nResults);

    return {
      documents: [results.map(r => r.text)],
      metadatas: [results.map(r => r.metadata)],
      distances: [results.map(r => 1 - (r.score || 0))] // convert similarity → distance
    };
  }

  /**
   * Get chunks by metadata filter.
   * ChromaDB signature: get({ where })
   * Returns: { ids, documents, metadatas }
   */
  async get({ where } = {}) {
    const filter = { collectionName: this.name };
    if (where) {
      Object.entries(where).forEach(([key, value]) => {
        filter[`metadata.${key}`] = value;
      });
    }
    const docs = await VectorChunk.find(filter).lean();
    return {
      ids: docs.map(d => d.chunkId),
      documents: docs.map(d => d.text),
      metadatas: docs.map(d => d.metadata)
    };
  }

  /**
   * Delete all chunks in this collection.
   */
  async delete() {
    await VectorChunk.deleteMany({ collectionName: this.name });
  }

  /* ── Private helpers ── */

  _buildAtlasFilter(where) {
    if (!where || Object.keys(where).length === 0) return undefined;
    // Atlas Vector Search filter supports simple equality on pre-indexed fields
    // For simplicity, we handle post-query in JS (see query() above)
    return undefined;
  }

  _matchesFilter(metadata, where) {
    return Object.entries(where).every(([key, value]) => {
      return metadata && metadata[key] === value;
    });
  }

  /**
   * Pure-JS cosine similarity fallback when Atlas Vector Search index isn't set up yet.
   * This is slower but works immediately without any Atlas configuration.
   */
  async _fallbackCosineSimilarity(queryVector, nResults, where) {
    const filter = { collectionName: this.name };
    if (where) {
      Object.entries(where).forEach(([key, value]) => {
        filter[`metadata.${key}`] = value;
      });
    }
    const allDocs = await VectorChunk.find(filter).lean();

    const scored = allDocs.map(doc => ({
      chunkId: doc.chunkId,
      text: doc.text,
      metadata: doc.metadata,
      score: cosineSimilarity(queryVector, doc.embedding)
    }));

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, nResults);
  }
}

/* ───────────────── Cosine Similarity ───────────────── */
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    magA += vecA[i] * vecA[i];
    magB += vecB[i] * vecB[i];
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

/* ───────────────── Public API ───────────────── */
module.exports = {
  getOrCreateCollection: async ({ name }) => new VectorCollection(name),
  getCollection:         async ({ name }) => new VectorCollection(name),
  deleteCollection:      async ({ name }) => {
    await VectorChunk.deleteMany({ collectionName: name });
  },
  listCollections: async () => {
    const names = await VectorChunk.distinct("collectionName");
    return names.map(n => ({ name: n }));
  }
};
