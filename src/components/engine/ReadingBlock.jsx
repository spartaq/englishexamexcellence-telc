import React from 'react';
import './engine.css';

const ReadingBlock = ({ content, isMiniTest = false }) => {
  const renderContent = () => {
    // CASE 1: Single String (Now supports HTML inside the string)
    if (typeof content === 'string') {
      return (
        <div 
          className="passage-text" 
          dangerouslySetInnerHTML={{ __html: content }} 
          style={{ whiteSpace: 'pre-line' }} // Honors \n if HTML isn't used
        />
      );
    }

    if (Array.isArray(content)) {
      // Check if the array contains Objects (Matching Info format) or Strings (HTML format)
      const isObjectFormat = typeof content[0] === 'object' && content[0] !== null;

      if (isObjectFormat) {
        // CASE 2: Matching Info format (Objects with id and text)
        return content.map((paragraph) => (
          <div key={paragraph.id} style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
            <span style={{ fontWeight: 800, color: 'var(--lab-indigo)', fontSize: '14px' }}>
              {paragraph.id}
            </span>
            <p className="passage-text" style={{ margin: 0 }}>
              {paragraph.text}
            </p>
          </div>
        ));
      } else {
        // CASE 3: New HTML Array format (Array of strings like the Enron/Theranos example)
        return content.map((htmlSnippet, index) => (
          <div 
            key={index} 
            className="passage-text"
            style={{ marginBottom: '20px' }}
            dangerouslySetInnerHTML={{ __html: htmlSnippet }} 
          />
        ));
      }
    }
    return null;
  };

  return (
    <div className="reading-passage" style={{ marginBottom: '24px' }}>
      {renderContent()}
    </div>
  );
};

export default ReadingBlock;