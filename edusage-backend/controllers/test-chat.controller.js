const Chat = require("../models/Chat.model");

// Test chat functionality
exports.testChat = async (req, res) => {
  try {
    console.log("[TEST] Testing chat save functionality");
    console.log("[TEST] userId:", req.userId);
    
    // Test saving a message
    const testMessage = await Chat.create({
      notebookId: "64a7b8c9d0e1f2a3b4c5d6e7", // test notebook ID
      userId: req.userId,
      role: "user",
      message: "Test message - " + new Date().toISOString()
    });
    
    console.log("[TEST] Saved test message:", testMessage._id);
    
    // Test retrieving messages
    const messages = await Chat.find({
      notebookId: "64a7b8c9d0e1f2a3b4c5d6e7",
      userId: req.userId
    }).sort({ createdAt: -1 });
    
    console.log("[TEST] Retrieved messages:", messages.length);
    
    res.json({
      success: true,
      testMessage: testMessage,
      messageCount: messages.length,
      messages: messages
    });
  } catch (error) {
    console.error("[TEST] Chat test failed:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
