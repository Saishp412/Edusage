const OpenAI = require("openai");

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async function synthesizeAnswer({
  question,
  context
}) {
  console.log(`[RAG] Synthesizing answer for question: "${question}"`);
  console.log(`[RAG] Context length: ${context.length} characters`);

  const prompt = `You are EduSage, an AI assistant that answers questions based only on the provided study material.

Context:
${context}

Question:
${question}

Provide a clear explanation using the context above. Keep your answer concise but comprehensive.

Answer:`;

  try {
    console.log(`[RAG] Calling OpenAI API with gpt-3.5-turbo model`);
    console.log(`[RAG] API Key exists:`, !!process.env.OPENAI_API_KEY);
    console.log(`[RAG] API Key length:`, process.env.OPENAI_API_KEY?.length);
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('OpenAI API timeout after 30 seconds')), 30000);
    });
    
    const apiCall = openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are EduSage, an expert AI assistant that answers questions EXCLUSIVELY based on the provided study material. Every claim in your answer must be directly traceable to the study material. Create well-structured, comprehensive answers covering ALL relevant points from the material. Use proper formatting with bullet points, numbered lists, or paragraphs where appropriate. **Bold all key terms, headings, and main points using double asterisks.** CRITICAL: Do NOT add information beyond what is in the study material. Stay strictly within the provided content. If the material covers the topic well, provide a thorough answer covering every aspect mentioned in it. Never mention that you are using provided context."
        },
        {
          role: "user",
          content: `Using STRICTLY and ONLY this study material, provide a complete and well-structured answer. Cover ALL relevant points from the study material thoroughly. Do not invent or add external information.

--- STUDY MATERIAL ---
${context}
--- END STUDY MATERIAL ---

Question: ${question}

Instructions:
1. Answer ONLY using information found in the study material above
2. Cover every relevant point from the material as completely as possible
3. Use the same terminology and definitions as the study material
4. Structure the answer clearly with headings and bullet points
5. **Bold all important terms and key concepts**
6. If the material covers multiple aspects of the topic, address ALL of them`
        }
      ],
      max_tokens: 1200,
      temperature: 0.1,
    });
    
    const response = await Promise.race([apiCall, timeoutPromise]);

    const answer = response.choices[0].message.content;
    console.log(`[RAG] ✅ OpenAI API call successful!`);
    console.log(`[RAG] Generated answer length: ${answer.length}`);
    console.log(`[RAG] Answer preview:`, answer.substring(0, 150) + "...");
    
    return answer.trim();
  } catch (error) {
    console.error(`[RAG ERROR] OpenAI API call failed:`);
    console.error(`[RAG ERROR] Error message:`, error.message);
    console.error(`[RAG ERROR] Error status:`, error.status);
    console.error(`[RAG ERROR] Error code:`, error.code);
    console.error(`[RAG ERROR] Full error:`, error);
    
    // Check for quota exceeded error specifically
    if (error.code === 'insufficient_quota' || error.status === 429) {
      console.error(`[RAG ERROR] OpenAI API quota exceeded. Please check your billing.`);
      return `I apologize, but I'm currently unable to generate enhanced answers due to API quota limitations. However, I can still provide you with relevant information from your documents based on your question: "${question}"

${context.substring(0, 1000)}...

Please note: To get AI-generated answers, you may need to check your OpenAI account billing or upgrade your plan.`;
    }
    
    // Smart fallback: build a coherent answer from context
    console.log(`[RAG FALLBACK] Building answer from context for: "${question}"`);
    
    // Extract the main topic from the question
    const questionLower = question.toLowerCase();
    let mainTopic = '';
    
    // Identify the main topic based on question content
    if (questionLower.includes('evolutionary')) {
      mainTopic = 'evolutionary';
    } else if (questionLower.includes('waterfall')) {
      mainTopic = 'waterfall';
    } else if (questionLower.includes('v-model') || questionLower.includes('v model')) {
      mainTopic = 'v-model';
    } else if (questionLower.includes('spiral')) {
      mainTopic = 'spiral';
    } else if (questionLower.includes('agile')) {
      mainTopic = 'agile';
    } else if (questionLower.includes('prototype')) {
      mainTopic = 'prototype';
    } else {
      // Extract first meaningful word as fallback
      const words = questionLower.split(' ').filter(w => w.length > 2);
      mainTopic = words[0] || '';
    }
    
    console.log(`[RAG FALLBACK] Main topic identified: "${mainTopic}"`);
    
    // Find complete content sections by looking for topic boundaries
    const findTopicSections = (text) => {
      const sections = [];
      const lines = text.split('\n');
      let currentSection = [];
      let inTopicSection = false;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Detect start of relevant content
        if (line.toLowerCase().includes(mainTopic) && 
            (line.toLowerCase().includes('model') || line.toLowerCase().includes('development'))) {
          inTopicSection = true;
          currentSection = [line];
          continue;
        }
        
        // Continue collecting content if in topic section
        if (inTopicSection) {
          // Stop at clear topic boundaries
          const nextTopicPatterns = [
            /\d+\.\s*\w*(?:model|approach|method)/i,
            /\w*\s*(?:model|approach|method)\s*:/i,
            /what\s+is\s+the\s+\w*\s*model/i,
            /explain\s+\w*\s*model/i
          ];
          
          const isNextTopic = nextTopicPatterns.some(pattern => pattern.test(line)) &&
                            !line.toLowerCase().includes(mainTopic);
          
          if (isNextTopic || (line.length === 0 && currentSection.length > 0)) {
            // End current section
            if (currentSection.length > 2) {
              sections.push(currentSection.join('\n'));
            }
            currentSection = [];
            inTopicSection = false;
          } else {
            currentSection.push(line);
          }
        }
      }
      
      // Add final section if it exists
      if (currentSection.length > 2) {
        sections.push(currentSection.join('\n'));
      }
      
      return sections;
    };
    
    // Get topic sections from context
    const topicSections = findTopicSections(context);
    console.log(`[RAG FALLBACK] Found ${topicSections.length} topic sections`);
    
    // Also get paragraphs as backup
    const paragraphs = context.split('\n\n').filter(para => para.trim().length > 50);
    
    // Content filtering function
    const isRelevantContent = (text) => {
      const textLower = text.toLowerCase();
      
      // Must contain the main topic or related terms
      const topicKeywords = {
        'evolutionary': ['evolutionary', 'evolution', 'incremental', 'iterative'],
        'waterfall': ['waterfall', 'sequential', 'linear'],
        'v-model': ['v-model', 'v model', 'verification', 'validation'],
        'spiral': ['spiral', 'risk-driven', 'iterative'],
        'agile': ['agile', 'scrum', 'sprint'],
        'prototype': ['prototype', 'prototyping', 'mock']
      };
      
      const relevantKeywords = topicKeywords[mainTopic] || [mainTopic];
      const hasRelevantKeyword = relevantKeywords.some(keyword => textLower.includes(keyword));
      
      // Strict rejection of unrelated topics
      const forbiddenPatterns = [
        'cocomo', 'constructive cost', 'abstraction', 'software design concepts',
        'cost constructive', 'hide irrelevant data', 'individual modules',
        'ensuring that they work together', 'delivering your system in a big bang',
        'some initial requirements and architecture'
      ];
      
      const hasForbiddenPattern = forbiddenPatterns.some(pattern => 
        textLower.includes(pattern)
      );
      
      // Reject content that seems to be headers or questions only
      const isHeaderOnly = (textLower.match(/^what\s+is\s+the/i) || 
                           textLower.match(/^explain\s+/i)) && 
                           textLower.length < 100;
      
      return hasRelevantKeyword && !hasForbiddenPattern && !isHeaderOnly;
    };
    
    // Process topic sections first (they're most complete)
    let candidateContent = [];
    
    // Add complete topic sections
    topicSections
      .filter(isRelevantContent)
      .forEach(section => candidateContent.push({
        text: section.trim(),
        type: 'complete_section',
        length: section.length
      }));
    
    // Add relevant paragraphs as backup
    paragraphs
      .filter(isRelevantContent)
      .forEach(para => candidateContent.push({
        text: para.trim(),
        type: 'paragraph',
        length: para.length
      }));
    
    // Sort by content type and length (prefer complete sections)
    candidateContent.sort((a, b) => {
      if (a.type === 'complete_section' && b.type !== 'complete_section') return -1;
      if (a.type !== 'complete_section' && b.type === 'complete_section') return 1;
      return b.length - a.length; // Longer content preferred
    });
    
    console.log(`[RAG FALLBACK] Processing ${candidateContent.length} candidate content pieces`);
    
    // Build answer from best content
    if (candidateContent.length > 0) {
      // Take the best content piece
      let bestContent = candidateContent[0].text;
      
      // If it's too short, try to combine with next best piece
      if (bestContent.length < 300 && candidateContent.length > 1) {
        const secondBest = candidateContent[1].text;
        bestContent = bestContent + '\n\n' + secondBest;
      }
      
      // Format the answer with bold headings and emphasize key terms
      let finalAnswer = bestContent
        .replace(/\n\s*\d+\.\s*/g, '\n') // Remove numbered prefixes if they cause fragmentation
        .replace(/\n{3,}/g, '\n\n') // Clean up excessive line breaks
        .replace(/\b(sequential|linear|waterfall|v-model|verification|validation|testing|phases|features|characteristics|advantages|disadvantages)\b/gi, '**$1**') // Bold key terms
        .replace(/\b(key\s+features\s+are\s+as\s+follows|important\s+characteristics|main\s+features|key\s+points)\b/gi, '**$1**') // Bold important phrases
        .trim();
      
      // Ensure proper ending
      if (!finalAnswer.match(/[.!?]$/)) {
        finalAnswer += '.';
      }
      
      return `**${question.charAt(0).toUpperCase() + question.slice(1)}**\n\n${finalAnswer}\n\n*Note: This response was generated from your document content. For more detailed answers, the AI processing service may be temporarily limited.*`;
    }
    
    // If no good content found, provide a helpful response
    return `I found information about "${mainTopic}" in your documents, but the content appears to be incomplete or scattered. For a complete answer about the ${mainTopic} model, you may want to check if there are more comprehensive sections in your study materials.`;
  }
};
