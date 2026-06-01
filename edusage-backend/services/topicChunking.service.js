// Topic-based chunking service for Phase 1 implementation
// Foundation for future NLP enhancements

class TopicClassifier {
  constructor() {
    // Software development models topic definitions
    this.topics = {
      'waterfall': {
        keywords: ['waterfall', 'sequential', 'linear', 'phases', 'requirements', 'design', 'implementation', 'testing', 'deployment', 'maintenance'],
        weight: 1.0,
        patterns: [/waterfall\s*model/gi, /sequential\s*development/gi, /linear\s*approach/gi]
      },
      'v-model': {
        keywords: ['v-model', 'v model', 'verification', 'validation', 'testing', 'unit testing', 'integration testing', 'system testing', 'acceptance testing'],
        weight: 1.0,
        patterns: [/v-?model/gi, /verification\s*and\s*validation/gi, /validation\s*model/gi]
      },
      'evolutionary': {
        keywords: ['evolutionary', 'evolution', 'incremental', 'iterative', 'prototype', 'feedback', 'cycles', 'user feedback', 'refinement'],
        weight: 1.0,
        patterns: [/evolutionary\s*model/gi, /incremental\s*development/gi, /iterative\s*approach/gi]
      },
      'spiral': {
        keywords: ['spiral', 'risk-driven', 'risk analysis', 'prototype', 'iteration', 'risk assessment', 'mitigation'],
        weight: 1.0,
        patterns: [/spiral\s*model/gi, /risk\s*driven/gi, /spiral\s*approach/gi]
      },
      'agile': {
        keywords: ['agile', 'scrum', 'sprint', 'iteration', 'user stories', 'backlog', 'daily standup', 'retrospective'],
        weight: 1.0,
        patterns: [/agile\s*methodology/gi, /scrum\s*framework/gi, /sprint\s*planning/gi]
      },
      'prototype': {
        keywords: ['prototype', 'prototyping', 'mock', 'throwaway', 'evolutionary prototype', 'interface'],
        weight: 1.0,
        patterns: [/prototype\s*model/gi, /prototyping\s*approach/gi, /mock\s*development/gi]
      },
      'rad': {
        keywords: ['rad', 'rapid application development', 'rapid', 'timebox', 'component', 'reuse'],
        weight: 1.0,
        patterns: [/rad\s*model/gi, /rapid\s*application\s*development/gi, /timebox/gi]
      }
    };
  }

  // Primary topic detection for Phase 1
  detectPrimaryTopic(text) {
    const textLower = text.toLowerCase();
    let bestTopic = null;
    let bestScore = 0;

    for (const [topicName, topicData] of Object.entries(this.topics)) {
      let score = 0;

      // Keyword matching
      topicData.keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = textLower.match(regex);
        if (matches) {
          score += matches.length * topicData.weight;
        }
      });

      // Pattern matching
      topicData.patterns.forEach(pattern => {
        const matches = text.match(pattern);
        if (matches) {
          score += matches.length * topicData.weight * 2; // Patterns get higher weight
        }
      });

      // Title/header bonus
      if (this.isInTitle(text, topicName)) {
        score += 5;
      }

      if (score > bestScore) {
        bestScore = score;
        bestTopic = topicName;
      }
    }

    return {
      topic: bestTopic,
      confidence: bestScore > 0 ? Math.min(bestScore / 10, 1.0) : 0,
      score: bestScore
    };
  }

  // Check if topic is mentioned in titles/headers
  isInTitle(text, topic) {
    const lines = text.split('\n').slice(0, 5); // Check first 5 lines for titles
    return lines.some(line => 
      line.toLowerCase().includes(topic) && 
      (line.length < 100 || line.match(/^\d+\./) || line.match(/^[A-Z][^.]*$/))
    );
  }

  // Extract keywords for enhanced metadata (Phase 2 preparation)
  extractKeywords(text, maxKeywords = 10) {
    if (!text || typeof text !== 'string') {
      return [];
    }
    
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !this.isStopWord(word));

    const wordFreq = {};
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    return Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, maxKeywords)
      .map(([word]) => word);
  }

  // Basic stop word list (Phase 1)
  isStopWord(word) {
    const stopWords = new Set([
      'the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 'as', 'are', 'was', 'were',
      'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
      'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these',
      'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'when', 'where',
      'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other',
      'some', 'such', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just'
    ]);
    return stopWords.has(word);
  }

  // Future NLP preparation: semantic similarity placeholder
  calculateSemanticSimilarity(text1, text2) {
    // Phase 2: Will implement with sentence-transformers or similar
    // For now, use simple keyword overlap
    const keywords1 = new Set(this.extractKeywords(text1, 20));
    const keywords2 = new Set(this.extractKeywords(text2, 20));
    
    const intersection = new Set([...keywords1].filter(x => keywords2.has(x)));
    const union = new Set([...keywords1, ...keywords2]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  }
}

class HeaderDetector {
  constructor() {
    // Common header patterns in academic/technical documents
    this.headerPatterns = [
      /^\d+\.\s*[A-Z][^.]*$/g,           // "1. Introduction"
      /^\d+\.\d+\s*[A-Z][^.]*$/g,        // "1.1 Overview"
      /^[A-Z][A-Z\s]*$/g,                // "INTRODUCTION"
      /^[A-Z][a-z\s]+:$/g,               // "Overview:"
      /^#{1,6}\s*.+$/g,                  // Markdown headers
      /^[IVX]+\.\s*[A-Z][^.]*$/g,        // "I. Introduction"
      /^[A-Z][a-z\s]+\s*Model$/g         // "Waterfall Model"
    ];
  }

  extractHeaders(text) {
    const lines = text.split('\n');
    const headers = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      this.headerPatterns.forEach((pattern, patternIndex) => {
        if (pattern.test(trimmedLine)) {
          headers.push({
            text: trimmedLine,
            line: index,
            level: this.getHeaderLevel(trimmedLine, patternIndex),
            type: this.getHeaderType(trimmedLine)
          });
        }
      });
    });

    return headers.sort((a, b) => a.line - b.line);
  }

  getHeaderLevel(text, patternIndex) {
    if (text.match(/^#{1,6}/)) return text.match(/^#+/)[0].length;
    if (text.match(/^\d+\.\d+/)) return 2;
    if (text.match(/^\d+\./)) return 1;
    if (text.match(/^[IVX]+/)) return 1;
    if (text.match(/^[A-Z][A-Z\s]*$/)) return 1;
    return 2;
  }

  getHeaderType(text) {
    if (text.includes('Model')) return 'model';
    if (text.includes('Introduction') || text.includes('Overview')) return 'introduction';
    if (text.includes('Conclusion') || text.includes('Summary')) return 'conclusion';
    if (text.includes('Definition') || text.includes('What is')) return 'definition';
    return 'general';
  }
}

class TopicChunker {
  constructor() {
    this.topicClassifier = new TopicClassifier();
    this.headerDetector = new HeaderDetector();
  }

  // Main chunking function for Phase 1
  createTopicChunks(text, documentId) {
    console.log(`[TOPIC CHUNKER] Processing document: ${documentId}`);
    
    // Step 1: Extract structure
    const headers = this.headerDetector.extractHeaders(text);
    console.log(`[TOPIC CHUNKER] Found ${headers.length} headers`);

    // Step 2: Create initial sections based on headers
    const sections = this.createSectionsFromHeaders(text, headers);
    
    // Step 3: Classify each section by topic
    const classifiedSections = sections.map(section => ({
      ...section,
      topic: this.topicClassifier.detectPrimaryTopic(section.content),
      keywords: this.topicClassifier.extractKeywords(section.content)
    }));

    // Step 4: Create topic-focused chunks
    const chunks = this.createTopicBasedChunks(classifiedSections, documentId);
    
    console.log(`[TOPIC CHUNKER] Created ${chunks.length} topic chunks`);
    return chunks;
  }

  createSectionsFromHeaders(text, headers) {
    const lines = text.split('\n');
    const sections = [];

    if (headers.length === 0) {
      // No headers found, create sections by paragraph
      return this.createParagraphSections(text);
    }

    for (let i = 0; i < headers.length; i++) {
      const startHeader = headers[i];
      const endLine = i < headers.length - 1 ? headers[i + 1].line : lines.length;
      
      const sectionLines = lines.slice(startHeader.line + 1, endLine);
      const content = sectionLines.join('\n').trim();

      if (content.length > 50) { // Only include sections with meaningful content
        sections.push({
          id: `section_${i}`,
          title: startHeader.text,
          content: content,
          startLine: startHeader.line,
          endLine: endLine - 1,
          level: startHeader.level,
          type: startHeader.type
        });
      }
    }

    return sections;
  }

  createParagraphSections(text) {
    const paragraphs = text.split('\n\n').filter(p => p.trim().length > 50);
    
    return paragraphs.map((paragraph, index) => ({
      id: `paragraph_${index}`,
      title: `Paragraph ${index + 1}`,
      content: paragraph.trim(),
      startLine: index * 2,
      endLine: index * 2 + 1,
      level: 2,
      type: 'paragraph'
    }));
  }

  createTopicBasedChunks(sections, documentId) {
    const chunks = [];
    const topicGroups = this.groupSectionsByTopic(sections);

    for (const [topicName, topicSections] of Object.entries(topicGroups)) {
      if (topicName === 'unknown') continue; // Skip unknown topics for now

      // Create dedicated topic chunk
      const dedicatedChunk = this.createDedicatedTopicChunk(topicName, topicSections, documentId);
      if (dedicatedChunk) chunks.push(dedicatedChunk);

      // Create sub-topic chunks if sections are large
      const subChunks = this.createSubTopicChunks(topicName, topicSections, documentId);
      chunks.push(...subChunks);
    }

    return chunks;
  }

  groupSectionsByTopic(sections) {
    const groups = {};
    
    sections.forEach(section => {
      const topic = section.topic.confidence > 0.3 ? section.topic.topic : 'unknown';
      
      if (!groups[topic]) {
        groups[topic] = [];
      }
      
      groups[topic].push(section);
    });

    return groups;
  }

  createDedicatedTopicChunk(topicName, sections, documentId) {
    const relevantSections = sections.filter(s => s.topic.confidence > 0.5);
    
    if (relevantSections.length === 0) return null;

    const content = relevantSections
      .map(s => `## ${s.title}\n${s.content}`)
      .join('\n\n');

    return {
      id: `${documentId}_${topicName}_complete`,
      content: content,
      topic: topicName,
      type: 'dedicated_topic',
      confidence: Math.max(...relevantSections.map(s => s.topic.confidence)),
      metadata: {
        documentId,
        sections: relevantSections.map(s => s.id),
        keywords: this.extractCombinedKeywords(relevantSections),
        chunkType: 'complete_topic',
        createdAt: new Date().toISOString()
      }
    };
  }

  createSubTopicChunks(topicName, sections, documentId) {
    const subChunks = [];
    
    sections.forEach(section => {
      if (section.content.length > 1000 && section.topic.confidence > 0.7) {
        // Large section with high confidence - create sub-chunk
        subChunks.push({
          id: `${documentId}_${topicName}_${section.id}`,
          content: `## ${section.title}\n${section.content}`,
          topic: topicName,
          type: 'sub_topic',
          confidence: section.topic.confidence,
          metadata: {
            documentId,
            parentSection: section.id,
            keywords: section.keywords,
            chunkType: 'sub_topic',
            createdAt: new Date().toISOString()
          }
        });
      }
    });

    return subChunks;
  }

  extractCombinedKeywords(sections) {
    const allKeywords = sections.flatMap(s => s.keywords);
    const keywordFreq = {};
    
    allKeywords.forEach(keyword => {
      keywordFreq[keyword] = (keywordFreq[keyword] || 0) + 1;
    });

    return Object.entries(keywordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 15)
      .map(([keyword]) => keyword);
  }
}

module.exports = {
  TopicClassifier,
  HeaderDetector,
  TopicChunker
};
