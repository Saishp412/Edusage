const chroma = require("../services/chroma.client");
const embedText = require("../services/embedding.service");
const synthesizeAnswer = require("../services/answerSynthesizer.service");
const { generateInfographic } = require("../services/infographic.service");

// Prompt templates for each feature
const PROMPT_TEMPLATES = {
  audio: `Create an audio script that summarizes the key points from the document. The script should:
- Start with a friendly introduction
- Cover the main topics in a conversational tone
- Be suitable for audio narration (clear, easy to follow)
- Include transitions between topics
- End with a brief summary
- Be approximately 300-500 words for a 2-3 minute audio`,

  video: `Create a video script with scenes that explains the topic visually. The script should:
- Include scene descriptions and visual elements
- Have clear narration for each scene
- Break down complex concepts into visual steps
- Include transitions between scenes
- Be suitable for educational video content
- Format: [SCENE] followed by narration and visual descriptions`,

  mindmap: `Create a hierarchical mind map structure. The output should:
- Start with the main topic as the central node
- Include primary branches for main concepts
- Add sub-branches for supporting details
- Use indentation to show hierarchy
- Be organized and easy to convert to visual mind map
- Format: Main Topic -> Subtopic -> Detail`,

  report: `Generate a comprehensive structured report. The report should:
- Have a clear title and introduction
- Include numbered sections with headings
- Provide detailed explanations for each section
- Use professional academic tone
- Include a conclusion section
- Be well-structured and educational`,

  flashcards: `Generate Q&A flashcards for study. Create:
- 10-15 flashcard pairs
- Clear questions on one side
- Concise answers on the other side
- Cover key concepts from the material
- Format each as: Q: [Question] A: [Answer]
- Ensure answers are accurate and based on the content`,

  quiz: `Generate a comprehensive quiz. The quiz should:
- Include 10 multiple choice questions
- Have 4 options for each question (A, B, C, D)
- Mark the correct answer clearly
- Cover various difficulty levels
- Include questions on key concepts
- Format: Question, Options, Correct Answer`,

  infographic: `Create content suitable for an infographic. The content should:
- Present key facts and statistics
- Use bullet points for easy reading
- Include impressive numbers or data points
- Be visually oriented
- Have clear sections with headers
- Be concise but informative`,

  slides: `Create presentation slides. The slides should:
- Have a title slide
- Include 5-8 content slides
- Each slide with clear title and 3-4 bullet points
- Have a conclusion slide
- Flow logically from introduction to conclusion
- Format: Slide X: [Title] followed by bullet points`,

  table: `Extract and organize data in table format. The table should:
- Identify key data points from the content
- Organize information in rows and columns
- Include clear headers
- Present comparative information
- Be structured and easy to read
- Use markdown table format`
};

// Generate structured content based on type
async function generateStudioContent(type, notebookId, query = "") {
  console.log(`[STUDIO] Generating ${type} content for notebook: ${notebookId}, query: ${query}`);
  
  // Special handling for infographic — uses dedicated service
  if (type === 'infographic') {
    console.log(`[STUDIO] Delegating to infographic service for comprehensive PDF generation`);
    return await generateInfographic(notebookId);
  }
  
  try {
    // Get notebook collection with error handling
    let collection;
    let documents = [];
    
    try {
      collection = await chroma.getOrCreateCollection({
        name: `notebook_${notebookId}`
      });
      
      // Create search query
      const searchQuery = query || `Generate ${type} content from the document`;
      const [queryEmbedding] = await embedText([searchQuery]);

      // Retrieve relevant documents
      const results = await collection.query({
        queryEmbeddings: [queryEmbedding],
        nResults: 8 // Get more context for generation
      });

      documents = results.documents?.[0] || [];
      console.log(`[STUDIO] Retrieved ${documents.length} chunks from notebook_${notebookId}`);
      
    } catch (collectionError) {
      console.error(`[STUDIO] Error accessing notebook collection:`, collectionError);
      
      // Try to get documents from document collections as fallback
      try {
        // Try to get any document collections for this notebook
        const documentCollections = await chroma.listCollections();
        const notebookCollections = documentCollections.filter(col => 
          col.name.includes(notebookId) || col.name.includes('document')
        );
        
        console.log(`[STUDIO] Found ${notebookCollections.length} document collections`);
        
        if (notebookCollections.length > 0) {
          // Try the first available collection
          const fallbackCollection = await chroma.getCollection({
            name: notebookCollections[0].name
          });
          
          const [queryEmbedding] = await embedText([searchQuery || `Generate ${type} content`]);
          const results = await fallbackCollection.query({
            queryEmbeddings: [queryEmbedding],
            nResults: 5
          });
          
          documents = results.documents?.[0] || [];
          console.log(`[STUDIO] Retrieved ${documents.length} chunks from fallback collection`);
        }
      } catch (fallbackError) {
        console.error(`[STUDIO] Fallback collection access failed:`, fallbackError);
      }
    }

    const context = documents.join("\n\n");
    console.log(`[STUDIO] Context length: ${context.length} characters`);

    if (context.length === 0) {
      console.log(`[STUDIO] No content found for ${type} generation`);
      return {
        success: false,
        type: type,
        content: `No content found in the notebook to generate ${type} content. Please upload some documents first.`,
        sources: 0
      };
    }

    // Build prompt with specific template
    const prompt = `You are EduSage, an AI assistant that creates educational content based only on provided study materials.

Context:
${context}

${query ? `Specific Focus: ${query}` : ''}

${PROMPT_TEMPLATES[type]}

Generate the content based on the context above. Ensure it is well-structured, educational, and based only on the provided materials.`;

    console.log(`[STUDIO] Generating ${type} content with prompt length: ${prompt.length}`);

    // Generate content using existing LLM service
    const content = await synthesizeAnswer({
      question: prompt,
      context: context
    });

    console.log(`[STUDIO] Generated ${type} content length: ${content.length}`);
    
    return {
      success: true,
      type: type,
      content: content,
      sources: documents.length
    };

  } catch (error) {
    console.error(`[STUDIO ERROR] Failed to generate ${type} content:`, error);
    
    return {
      success: false,
      type: type,
      content: `Failed to generate ${type} content. Error: ${error.message}. Please try again or check if documents are uploaded.`,
      sources: 0,
      error: error.message
    };
  }
}

module.exports = {
  generateStudioContent,
  PROMPT_TEMPLATES
};
