const mongoose = require("mongoose");

const DiagramSchema = new mongoose.Schema(
  {
    notebookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notebook",
      required: true,
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    heading: {
      type: String,
    },
    pageNumber: {
      type: Number,
      required: true,
    },
    imagePath: {
      type: String,
      default: ''
    },
    imageData: {
      type: String,  // base64 encoded PNG — stored in MongoDB, no disk needed
      default: ''
    },
    boundingBox: {
      x0: Number,
      y0: Number,
      x1: Number,
      y1: Number,
      width: Number,
      height: Number,
    },
    imageType: {
      type: String,
      enum: ['diagram', 'chart', 'table', 'illustration', 'screenshot', 'other'],
      default: 'other',
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.5,
    },
    extractedAt: {
      type: Date,
      default: Date.now,
    },
    linkedChunks: [String],
    contextText: {
      type: String,
      default: '',
    },
    spatialProximity: {
      nearbyTextChunks: [String],
      textDensity: Number,
      positionOnPage: {
        type: String,
        enum: ['top-left', 'top-center', 'top-right', 'middle-left', 'middle-center', 'middle-right', 'bottom-left', 'bottom-center', 'bottom-right'],
        default: 'middle-center'
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Diagram", DiagramSchema);
