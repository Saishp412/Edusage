const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  notebookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Notebook",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  filename: String,
  fileType: String,
  textContent: String
}, { timestamps: true });

module.exports = mongoose.model("Document", DocumentSchema);
