const mongoose = require("mongoose");

const WebSourceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    notebookId: { type: mongoose.Schema.Types.ObjectId, ref: "Notebook", required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    snippet: { type: String },
    searchQuery: { type: String },
    sourceType: { type: String, default: "web" }, // Can be 'web', 'pdf', 'doc', etc.
  },
  { timestamps: true }
);

module.exports = mongoose.model("WebSource", WebSourceSchema);
