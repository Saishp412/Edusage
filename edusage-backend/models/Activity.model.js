const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true }, // e.g. "notebook_created", "document_uploaded"
    title: { type: String },
    notebookId: { type: mongoose.Schema.Types.ObjectId, ref: "Notebook" },
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: "Document" },
    details: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", ActivitySchema);
