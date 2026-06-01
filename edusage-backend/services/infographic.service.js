const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Document = require('../models/Document.model');
const Notebook = require('../models/Notebook.model');
const synthesizeAnswer = require('./answerSynthesizer.service');

// Color palette for the PDF
const COLORS = {
  primary: '#1a365d',      // Dark blue for headings
  secondary: '#2b6cb0',    // Medium blue for subheadings
  accent: '#4299e1',       // Light blue for accents
  text: '#1a202c',         // Dark text
  lightText: '#4a5568',    // Gray text
  background: '#ebf8ff',   // Light blue background
  white: '#ffffff',
  divider: '#cbd5e0',      // Light gray divider
  bullet: '#e53e3e',       // Red bullet dots
  highlight: '#fefcbf',    // Yellow highlight
  sectionBg: '#edf2f7',    // Section background
};

/**
 * Generate comprehensive exam preparation notes PDF from all notebook documents.
 */
async function generateInfographic(notebookId) {
  console.log(`[INFOGRAPHIC] Starting generation for notebook: ${notebookId}`);
  
  // 1. Fetch notebook info
  const notebook = await Notebook.findById(notebookId);
  if (!notebook) {
    throw new Error('Notebook not found');
  }
  
  // 2. Fetch ALL documents for this notebook
  const documents = await Document.find({ notebookId }).select('filename textContent');
  console.log(`[INFOGRAPHIC] Found ${documents.length} documents`);
  
  if (documents.length === 0) {
    throw new Error('No documents found in this notebook. Please upload documents first.');
  }
  
  // 3. Collect full text from all documents
  let fullText = '';
  const docNames = [];
  
  for (const doc of documents) {
    if (doc.textContent && doc.textContent.trim().length > 0) {
      fullText += doc.textContent + '\n\n';
      docNames.push(doc.filename || 'Untitled Document');
    }
  }
  
  if (fullText.trim().length === 0) {
    throw new Error('No text content found in documents. The uploaded files may not contain extractable text.');
  }
  
  console.log(`[INFOGRAPHIC] Total text length: ${fullText.length} chars from ${docNames.length} documents`);
  
  // 4. Split text into manageable sections for the LLM
  const sections = splitTextIntoSections(fullText);
  console.log(`[INFOGRAPHIC] Split into ${sections.length} sections for processing`);
  
  // 5. Generate exam-prep notes for each section using the LLM
  const noteSections = [];
  
  for (let i = 0; i < sections.length; i++) {
    console.log(`[INFOGRAPHIC] Processing section ${i + 1}/${sections.length} (${sections[i].length} chars)`);
    
    try {
      const sectionNotes = await generateSectionNotes(sections[i], i + 1, sections.length);
      if (sectionNotes && sectionNotes.trim().length > 0) {
        noteSections.push(sectionNotes);
      }
    } catch (err) {
      console.error(`[INFOGRAPHIC] Error processing section ${i + 1}:`, err.message);
      // Continue with other sections even if one fails
    }
  }
  
  if (noteSections.length === 0) {
    throw new Error('Failed to generate notes from the document content.');
  }
  
  console.log(`[INFOGRAPHIC] Generated notes for ${noteSections.length} sections`);
  
  // 6. Combine all section notes
  const combinedNotes = noteSections.join('\n\n---\n\n');
  
  // 7. Generate PDF
  const outputDir = path.join(__dirname, '..', 'uploads', 'infographics', notebookId);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const pdfFilename = `study_notes_${Date.now()}.pdf`;
  const pdfPath = path.join(outputDir, pdfFilename);
  
  console.log(`[INFOGRAPHIC] Generating PDF at: ${pdfPath}`);
  
  await generatePDF({
    outputPath: pdfPath,
    title: notebook.title || 'Study Notes',
    subtitle: `Exam Preparation Notes`,
    docNames,
    notes: combinedNotes,
    noteSections
  });
  
  const downloadUrl = `/uploads/infographics/${notebookId}/${pdfFilename}`;
  console.log(`[INFOGRAPHIC] PDF generated successfully: ${downloadUrl}`);
  
  return {
    success: true,
    content: combinedNotes,
    downloadUrl,
    sources: documents.length,
    sectionsProcessed: noteSections.length
  };
}

/**
 * Split full text into manageable sections (~2500 chars each).
 * Tries to split on paragraph boundaries.
 */
function splitTextIntoSections(text) {
  const MAX_SECTION_SIZE = 2500;
  const sections = [];
  
  // First, split by double newlines (paragraphs)
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 20);
  
  let currentSection = '';
  
  for (const para of paragraphs) {
    if (currentSection.length + para.length > MAX_SECTION_SIZE && currentSection.length > 200) {
      sections.push(currentSection.trim());
      currentSection = para;
    } else {
      currentSection += '\n\n' + para;
    }
  }
  
  if (currentSection.trim().length > 50) {
    sections.push(currentSection.trim());
  }
  
  // If we ended up with no sections, just split by max size
  if (sections.length === 0 && text.trim().length > 0) {
    for (let i = 0; i < text.length; i += MAX_SECTION_SIZE) {
      const chunk = text.substring(i, i + MAX_SECTION_SIZE).trim();
      if (chunk.length > 50) {
        sections.push(chunk);
      }
    }
  }
  
  return sections;
}

/**
 * Send a section of text to the LLM to generate exam-prep notes.
 */
async function generateSectionNotes(sectionText, sectionNumber, totalSections) {
  const prompt = `You are creating EXAM PREPARATION NOTES from study material. 

STUDY MATERIAL (Section ${sectionNumber} of ${totalSections}):
${sectionText}

Create comprehensive, well-organized exam preparation notes from the above content. Follow these rules:

1. Identify ALL topics, concepts, definitions, and key terms in this section
2. For each topic, provide:
   - A clear heading (use ## for main topics)
   - Definition or explanation in 1-2 concise sentences
   - Key points as bullet points (use - for bullets)
   - Important terms in **bold**
   - Any formulas, models, or frameworks mentioned
3. Be thorough — cover EVERY concept mentioned, don't skip anything
4. Use clear, exam-ready language that's easy to revise from
5. Include any diagrams/models descriptions if mentioned
6. Keep bullet points concise but complete

Format the output as clean markdown with proper headings and bullet points. Do NOT add any introduction or conclusion — just the notes content.`;

  const notes = await synthesizeAnswer({
    question: prompt,
    context: sectionText
  });
  
  return notes;
}

/**
 * Generate a beautifully formatted PDF from the notes.
 */
function generatePDF({ outputPath, title, subtitle, docNames, notes, noteSections }) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 60, bottom: 60, left: 55, right: 55 },
        bufferPages: true,
        info: {
          Title: title,
          Author: 'EduSage AI',
          Subject: 'Exam Preparation Notes',
          Creator: 'EduSage Studio'
        }
      });

      const writeStream = fs.createWriteStream(outputPath);
      doc.pipe(writeStream);

      // ============ COVER PAGE ============
      renderCoverPage(doc, title, subtitle, docNames);

      // ============ NOTES CONTENT ============
      doc.addPage();
      let pageNum = 2;

      // Render the combined notes
      const allNotes = noteSections.join('\n\n');
      renderMarkdownContent(doc, allNotes);

      // ============ PAGE NUMBERS ============
      const totalPages = doc.bufferedPageRange().count;
      for (let i = 0; i < totalPages; i++) {
        doc.switchToPage(i);
        
        // Skip page number on cover
        if (i === 0) continue;
        
        // Footer
        doc.save();
        doc.fontSize(8)
          .fillColor(COLORS.lightText)
          .text(
            `Page ${i} of ${totalPages - 1}`,
            55,
            doc.page.height - 40,
            { align: 'center', width: doc.page.width - 110 }
          );
        
        // Header line on content pages
        doc.moveTo(55, 45)
          .lineTo(doc.page.width - 55, 45)
          .strokeColor(COLORS.divider)
          .lineWidth(0.5)
          .stroke();
        
        doc.fontSize(7)
          .fillColor(COLORS.lightText)
          .text('EduSage • Exam Preparation Notes', 55, 32, { align: 'right', width: doc.page.width - 110 });
        
        doc.restore();
      }

      doc.end();
      
      writeStream.on('finish', () => {
        console.log(`[INFOGRAPHIC] PDF written successfully to ${outputPath}`);
        resolve();
      });
      
      writeStream.on('error', reject);
      
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Render the cover page with title, subtitle, and source documents.
 */
function renderCoverPage(doc, title, subtitle, docNames) {
  // Background accent bar at top
  doc.rect(0, 0, doc.page.width, 8).fill(COLORS.secondary);
  
  // Title section
  const centerY = doc.page.height / 2 - 120;
  
  // Decorative line above title
  doc.moveTo(doc.page.width / 2 - 80, centerY - 20)
    .lineTo(doc.page.width / 2 + 80, centerY - 20)
    .strokeColor(COLORS.accent)
    .lineWidth(2)
    .stroke();
  
  // Main title
  doc.fontSize(32)
    .fillColor(COLORS.primary)
    .text(title, 55, centerY, { 
      align: 'center',
      width: doc.page.width - 110
    });
  
  // Subtitle
  doc.moveDown(0.5);
  doc.fontSize(16)
    .fillColor(COLORS.secondary)
    .text(subtitle, { align: 'center', width: doc.page.width - 110 });
  
  // Decorative line below subtitle
  const afterSubtitle = doc.y + 15;
  doc.moveTo(doc.page.width / 2 - 80, afterSubtitle)
    .lineTo(doc.page.width / 2 + 80, afterSubtitle)
    .strokeColor(COLORS.accent)
    .lineWidth(2)
    .stroke();
  
  // Generated by
  doc.moveDown(3);
  doc.fontSize(11)
    .fillColor(COLORS.lightText)
    .text('Generated by EduSage AI Studio', { align: 'center', width: doc.page.width - 110 });
  
  // Date
  doc.moveDown(0.5);
  doc.fontSize(10)
    .fillColor(COLORS.lightText)
    .text(new Date().toLocaleDateString('en-US', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    }), { align: 'center', width: doc.page.width - 110 });
  
  // Source documents section
  if (docNames.length > 0) {
    doc.moveDown(3);
    
    // Source docs box
    const boxY = doc.y;
    const boxWidth = 300;
    const boxX = (doc.page.width - boxWidth) / 2;
    
    doc.fontSize(10)
      .fillColor(COLORS.secondary)
      .text('Source Documents:', boxX, boxY, { align: 'center', width: boxWidth });
    
    doc.moveDown(0.5);
    
    docNames.forEach(name => {
      doc.fontSize(9)
        .fillColor(COLORS.lightText)
        .text(`• ${name}`, boxX + 20, doc.y, { width: boxWidth - 40 });
      doc.moveDown(0.3);
    });
  }
  
  // Bottom accent bar
  doc.rect(0, doc.page.height - 8, doc.page.width, 8).fill(COLORS.secondary);
}

/**
 * Render markdown-formatted notes into the PDF with proper styling.
 */
function renderMarkdownContent(doc, markdown) {
  const lines = markdown.split('\n');
  let inBulletList = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Skip empty lines but add spacing
    if (trimmed === '' || trimmed === '---') {
      if (inBulletList) {
        doc.moveDown(0.3);
        inBulletList = false;
      } else {
        doc.moveDown(0.4);
      }
      continue;
    }
    
    // Check if we need a new page (leave room for footer)
    if (doc.y > doc.page.height - 100) {
      doc.addPage();
      doc.y = 65; // Account for header
    }
    
    // ## Main Heading
    if (trimmed.startsWith('## ')) {
      const headingText = trimmed.replace(/^##\s*/, '').replace(/\*\*/g, '');
      inBulletList = false;
      
      doc.moveDown(0.8);
      
      // Check page break for headings
      if (doc.y > doc.page.height - 140) {
        doc.addPage();
        doc.y = 65;
      }
      
      // Colored background band for section headings
      const headingY = doc.y;
      doc.rect(45, headingY - 4, doc.page.width - 90, 24)
        .fill(COLORS.primary);
      
      doc.fontSize(13)
        .fillColor(COLORS.white)
        .text(headingText, 55, headingY, { 
          width: doc.page.width - 120,
          lineGap: 2
        });
      
      doc.moveDown(0.6);
      continue;
    }
    
    // ### Sub Heading
    if (trimmed.startsWith('### ')) {
      const subHeadingText = trimmed.replace(/^###\s*/, '').replace(/\*\*/g, '');
      inBulletList = false;
      
      doc.moveDown(0.5);
      
      doc.fontSize(11)
        .fillColor(COLORS.secondary)
        .text(subHeadingText, 55, doc.y, {
          width: doc.page.width - 120,
          underline: true
        });
      
      doc.moveDown(0.4);
      continue;
    }
    
    // # Top-level heading (rare, but handle it)
    if (trimmed.startsWith('# ') && !trimmed.startsWith('## ')) {
      const topHeadingText = trimmed.replace(/^#\s*/, '').replace(/\*\*/g, '');
      inBulletList = false;
      
      doc.moveDown(1);
      
      if (doc.y > doc.page.height - 140) {
        doc.addPage();
        doc.y = 65;
      }
      
      doc.fontSize(16)
        .fillColor(COLORS.primary)
        .text(topHeadingText, 55, doc.y, {
          width: doc.page.width - 120
        });
      
      // Underline
      doc.moveDown(0.2);
      doc.moveTo(55, doc.y)
        .lineTo(doc.page.width - 55, doc.y)
        .strokeColor(COLORS.accent)
        .lineWidth(1.5)
        .stroke();
      
      doc.moveDown(0.5);
      continue;
    }
    
    // Bullet points (- or * or •)
    if (trimmed.match(/^[-*•]\s+/)) {
      const bulletText = trimmed.replace(/^[-*•]\s+/, '');
      inBulletList = true;
      
      // Red bullet dot
      const bulletY = doc.y + 4;
      doc.circle(65, bulletY, 2.5).fill(COLORS.bullet);
      
      // Render bullet text with bold support
      renderTextWithBold(doc, bulletText, 75, doc.y, {
        fontSize: 10,
        width: doc.page.width - 140,
        color: COLORS.text,
        lineGap: 2
      });
      
      doc.moveDown(0.2);
      continue;
    }
    
    // Numbered items (1., 2., etc.)
    if (trimmed.match(/^\d+[\.\)]\s+/)) {
      const numMatch = trimmed.match(/^(\d+[\.\)])\s+(.*)/);
      if (numMatch) {
        inBulletList = true;
        
        // Number
        doc.fontSize(10)
          .fillColor(COLORS.secondary)
          .text(numMatch[1], 60, doc.y, { continued: false, width: 20 });
        
        // Move back up to same line
        doc.y -= doc.currentLineHeight() + 2;
        
        // Text
        renderTextWithBold(doc, numMatch[2], 80, doc.y, {
          fontSize: 10,
          width: doc.page.width - 145,
          color: COLORS.text,
          lineGap: 2
        });
        
        doc.moveDown(0.2);
        continue;
      }
    }
    
    // Regular paragraph text
    inBulletList = false;
    renderTextWithBold(doc, trimmed, 55, doc.y, {
      fontSize: 10,
      width: doc.page.width - 110,
      color: COLORS.text,
      lineGap: 3
    });
    
    doc.moveDown(0.2);
  }
}

/**
 * Render text with **bold** markdown support (inline).
 * PDFKit doesn't support mixed fonts in a single text() call natively,
 * so we use the continued option to chain segments.
 */
function renderTextWithBold(doc, text, x, y, options = {}) {
  const { fontSize = 10, width = 400, color = COLORS.text, lineGap = 2 } = options;
  
  // Split text by **bold** markers
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  
  if (parts.length <= 1 || !text.includes('**')) {
    // No bold markers, render as plain text
    const cleanText = text.replace(/\*\*/g, '');
    doc.font('Helvetica')
      .fontSize(fontSize)
      .fillColor(color)
      .text(cleanText, x, y, { width, lineGap });
    return;
  }
  
  // Render with mixed bold/regular
  let isFirst = true;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (!part) continue;
    
    const isBold = part.startsWith('**') && part.endsWith('**');
    const cleanPart = part.replace(/\*\*/g, '');
    if (!cleanPart) continue;
    
    const isLast = i === parts.length - 1 || parts.slice(i + 1).every(p => !p || p.replace(/\*\*/g, '').trim() === '');
    
    doc.font(isBold ? 'Helvetica-Bold' : 'Helvetica')
      .fontSize(fontSize)
      .fillColor(isBold ? COLORS.primary : color);
    
    if (isFirst) {
      doc.text(cleanPart, x, y, { 
        width, 
        lineGap, 
        continued: !isLast 
      });
      isFirst = false;
    } else {
      doc.text(cleanPart, { 
        width, 
        lineGap, 
        continued: !isLast 
      });
    }
  }
}

module.exports = { generateInfographic };
