const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const { connectToAtlas } = require("./database");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const notebookRoutes = require("./routes/notebook.routes");
const documentRoutes = require("./routes/document.routes");
const queryRoutes = require("./routes/query.routes");
const userRoutes = require("./routes/user.routes");
const activityRoutes = require("./routes/activity.routes");
const chatRoutes = require("./routes/chat.routes");
const webSearchRoutes = require("./routes/websearch.routes");
const studioRoutes = require("./routes/studio.routes");
// Topic-based routes
const topicQueryRoutes = require("./routes/topicQuery.routes");
const topicDocumentRoutes = require("./routes/topicDocument.routes");



const app = express();
app.use(cors());
app.use(express.json());

// serve uploaded files (including extracted diagrams)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/notebooks", notebookRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/query", queryRoutes);
app.use("/api/user", userRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/websearch", webSearchRoutes);
app.use("/api/studio", studioRoutes);
// Topic-based endpoints
app.use("/api/topic-query", topicQueryRoutes);
app.use("/api/topic-documents", topicDocumentRoutes);



// Start server first
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Then connect to MongoDB Atlas
connectToAtlas().then(connected => {
  if (connected) {
    console.log("✅ Full functionality available with MongoDB Atlas");
  } else {
    console.log("❌ MongoDB Atlas connection failed");
    console.log("⚠️  Server running in limited mode (no database)");
  }
});
