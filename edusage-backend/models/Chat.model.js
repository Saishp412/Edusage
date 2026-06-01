const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notebookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notebook',
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relevantImages: [{
    id: String,
    heading: String,
    pageNumber: Number,
    imageUrl: String,
    imageType: String,
    confidence: Number,
    relevanceScore: Number
  }],
  accuracyMetrics: {
    pdfGrounding: { type: Number, default: null },
    answerCompleteness: { type: Number, default: null },
    contextRelevance: { type: Number, default: null },
    retrievalConfidence: { type: Number, default: null },
    hallucinationRisk: { type: Number, default: null },
    overallScore: { type: Number, default: null },
    modelUsed: { type: String, default: null },
    chunksRetrieved: { type: Number, default: null },
    avgChunkDistance: { type: Number, default: null },
    evaluatedAt: { type: Date, default: null }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
chatSchema.index({ userId: 1, notebookId: 1, createdAt: 1 });

module.exports = mongoose.model('Chat', chatSchema);
