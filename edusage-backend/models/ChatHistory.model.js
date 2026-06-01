const mongoose = require("mongoose");

const ChatHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    notebookId: { type: mongoose.Schema.Types.ObjectId, ref: "Notebook", required: true },
    messages: [{
      id: { type: String, required: true },
      role: { type: String, enum: ["user", "assistant"], required: true },
      content: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }],
  },
  { timestamps: true }
);

// Ensure one chat history per notebook per user
ChatHistorySchema.index({ userId: 1, notebookId: 1 }, { unique: true });

module.exports = mongoose.model("ChatHistory", ChatHistorySchema);
