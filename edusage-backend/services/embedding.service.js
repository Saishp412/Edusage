const axios = require("axios");

async function embedText(texts) {
  const url = process.env.EMBEDDING_SERVICE_URL || "http://127.0.0.1:8001";
  const response = await axios.post(
    `${url}/embed`,
    { texts }
  );

  return response.data.embeddings;
}

module.exports = embedText;
