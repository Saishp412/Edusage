import React from 'react';
import './markdown-renderer.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className }) => {
  // Simple markdown parser for bold text and basic formatting
  const parseMarkdown = (text: string) => {
    if (!text || typeof text !== 'string') return '';
    
    // Replace **bold** with <strong>
    let parsed = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Replace *italic* with <em>
    parsed = parsed.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Handle headers
    parsed = parsed.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    parsed = parsed.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    parsed = parsed.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    
    // Replace newlines with <br>
    parsed = parsed.replace(/\n/g, '<br>');
    
    // Handle numbered lists
    parsed = parsed.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
    parsed = parsed.replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>');
    
    // Handle bullet points
    parsed = parsed.replace(/^[-•]\s+(.+)$/gm, '<li>$1</li>');
    
    return parsed;
  };

  return (
    <div 
      className={`markdown-renderer ${className || ''}`}
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  );
};

export default MarkdownRenderer;
