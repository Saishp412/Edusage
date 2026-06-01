/**
 * chroma.client.js
 *
 * Previously connected to ChromaDB. Now delegates to vectorStore.service.js
 * which uses MongoDB Atlas for vector storage.
 *
 * All existing callers (document.controller, query.controller, etc.)
 * continue to work without any changes because the API surface is identical.
 */
module.exports = require("./vectorStore.service");
