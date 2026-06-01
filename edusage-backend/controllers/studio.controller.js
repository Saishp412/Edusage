const { generateStudioContent } = require("../services/studio.service");

exports.generateContent = async (req, res) => {
  const { type, notebookId, query } = req.body;

  console.log(`[STUDIO CONTROLLER] Received request:`, { type, notebookId, query });

  // Validate request
  if (!type || !notebookId) {
    return res.status(400).json({
      success: false,
      message: "Type and notebookId are required"
    });
  }

  // Validate type
  const validTypes = [
    'audio', 'video', 'mindmap', 'report', 
    'flashcards', 'quiz', 'infographic', 
    'slides', 'table'
  ];

  if (!validTypes.includes(type)) {
    return res.status(400).json({
      success: false,
      message: `Invalid type. Must be one of: ${validTypes.join(', ')}`
    });
  }

  try {
    console.log(`[STUDIO CONTROLLER] Generating ${type} for notebook ${notebookId}`);
    
    const result = await generateStudioContent(type, notebookId, query);
    
    console.log(`[STUDIO CONTROLLER] Generated ${type} content, success: ${result.success}`);
    
    res.json(result);

  } catch (error) {
    console.error(`[STUDIO CONTROLLER] Error generating ${type} content:`, error);
    res.status(500).json({
      success: false,
      message: `Failed to generate ${type} content`,
      error: error.message
    });
  }
};
