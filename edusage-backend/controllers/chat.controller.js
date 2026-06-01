const Chat = require("../models/Chat.model");

// Get chat history for a specific notebook
exports.getChatHistory = async (req, res) => {
  try {
    const { notebookId } = req.params;
    
    const chatHistory = await Chat.find({
      userId: req.userId,
      notebookId: notebookId
    })
    .sort({ createdAt: 1 })
    .select('_id role message relevantImages accuracyMetrics createdAt');

    res.json({ 
      success: true,
      messages: chatHistory 
    });
  } catch (err) {
    console.error("Error fetching chat history:", err);
    res.status(500).json({ message: "Failed to fetch chat history" });
  }
};

// Save a chat message
exports.saveChatMessage = async (notebookId, userId, role, message) => {
  try {
    const chatMessage = await Chat.create({
      notebookId,
      userId,
      role,
      message
    });
    
    return chatMessage;
  } catch (error) {
    console.error('Error saving chat message:', error);
    throw error;
  }
};

// Save chat message via API (for frontend compatibility)
exports.saveChatMessageAPI = async (req, res) => {
  try {
    const { notebookId } = req.params;
    const { role, message, relevantImages } = req.body;

    if (!role || !message) {
      return res.status(400).json({ message: "Role and message are required" });
    }

    const chatData = {
      notebookId,
      userId: req.userId,
      role,
      message
    };

    // Include relevantImages if provided (for assistant messages with diagrams)
    if (relevantImages && Array.isArray(relevantImages) && relevantImages.length > 0) {
      chatData.relevantImages = relevantImages;
    }

    const chatMessage = await Chat.create(chatData);

    res.json({ 
      success: true, 
      message: "Chat message saved successfully",
      data: chatMessage
    });
  } catch (err) {
    console.error("Error saving chat message:", err);
    res.status(500).json({ message: "Failed to save chat message" });
  }
};

// Clear chat history for a notebook
exports.clearChatHistory = async (req, res) => {
  try {
    const { notebookId } = req.params;
    
    await Chat.deleteMany({
      userId: req.userId,
      notebookId: notebookId
    });

    res.json({ success: true, message: "Chat history cleared successfully" });
  } catch (err) {
    console.error("Error clearing chat history:", err);
    res.status(500).json({ message: "Failed to clear chat history" });
  }
};
