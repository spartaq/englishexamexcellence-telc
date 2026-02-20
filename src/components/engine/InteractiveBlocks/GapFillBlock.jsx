import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import './GapFillBlock.css';

const GapFillBlock = ({ 
  data, 
  showWordBankOnly = false,
  selections = {},
  activeGap = null,
  onWordSelect,
  onGapClick,
  isReviewMode = false
}) => {
  const wordBankOptions = data.options || [];

  // Find all gap markers and their positions
  const gapMarkerRegex = /__+\((\d+)\)__+/g;
  const content = data.content || '';
  
  // Split content by gap markers while keeping them in the result
  const parts = content.split(gapMarkerRegex);
  
  // The split regex with capture groups results in:
  // [text, gap1Index, text, gap2Index, text, ...]
  // So odd indices are gap indices, even indices are text parts

  // Render interactive text with gaps
  const renderInteractiveText = () => {
    const elements = [];
    
    for (let i = 0; i < parts.length; i++) {
      // Add text part
      if (parts[i]) {
        elements.push(
          <span key={`text-${i}`} className="passage-text-fragment">
            {parts[i]}
          </span>
        );
      }
      
      // Check if next part is a gap marker (odd indices after split with capture group)
      
      
      
      
      
      
      
      
      const nextPart = parts[i + 1];
      if (nextPart !== undefined) {
        const gapIndex = nextPart;
        const isFilled = selections[gapIndex];
        
        // FIX: Compare with the gapId property since activeGap is an object in App.jsx
        const isActive = activeGap?.parentId === data.id && activeGap?.gapId === gapIndex;
        
        // Review Logic
        const correctAnswer = data.answers?.[parseInt(gapIndex) - 1];
        
        // FIX: Use .trim().toLowerCase() for resilient checking
        const isCorrect = isReviewMode && isFilled && 
                          isFilled.trim().toLowerCase() === correctAnswer?.trim().toLowerCase();
                          
        const isIncorrect = isReviewMode && isFilled && 
                            isFilled.trim().toLowerCase() !== correctAnswer?.trim().toLowerCase();
                            
        const isMissing = isReviewMode && !isFilled;

        elements.push(
          <motion.span
            key={`gap-${gapIndex}`}
            whileTap={!isReviewMode ? { scale: 0.95 } : {}}
            className={`interactive-gap 
              ${isFilled ? 'filled' : ''} 
              ${isActive ? 'active' : ''} 
              ${isCorrect ? 'correct' : ''}
              ${isIncorrect ? 'incorrect' : ''}
              ${isMissing ? 'missing' : ''}
              ${isReviewMode ? 'review-mode' : ''}
            `}
            onClick={() => !isReviewMode && onGapClick && onGapClick(gapIndex)}
            style={{ cursor: isReviewMode ? 'default' : 'pointer' }}
          >
            <span className="gap-index-badge">
              {isCorrect ? <CheckCircle size={10} /> : isIncorrect ? <XCircle size={10} /> : gapIndex}
            </span>
            
            <AnimatePresence mode="wait">
              <motion.span
                key={(isReviewMode ? 'review-' : 'input-') + (isFilled || 'empty')}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="gap-text"
              >
                {isFilled || (isReviewMode ? "Empty" : "tap to fill")}
              </motion.span>
            </AnimatePresence>

            {/* FIX: Ensure the correct answer shows up if the user was wrong */}
            {isIncorrect && (
              <span className="correct-answer-hint">
                {correctAnswer}
              </span>
            )}
            {isMissing && (
               <span className="correct-answer-hint">
                Ans: {correctAnswer}
              </span>
            )}
          </motion.span>
        );







        
        // Skip the gap index part in next iteration
        i++;
      }
    }
    
    return <div className="gap-fill-text">{elements}</div>;
  };

  // Handle word selection - automatically fills first empty gap
  const handleWordClick = (word) => {
    if (isReviewMode) return;
    
    // Find first empty gap
    const gapMarkerRegex = /__+\((\d+)\)__+/g;
    const matches = [...content.matchAll(gapMarkerRegex)];
    
    for (const match of matches) {
      const gapIndex = match[1];
      if (!selections[gapIndex]) {
        onGapClick(gapIndex);
        setTimeout(() => onWordSelect(word), 0);
        return;
      }
    }
    
    if (onWordSelect) {
      onWordSelect(word);
    }
  };

  // Render word bank
  const renderWordBank = () => {
    const usedWords = Object.values(selections);
    return (
      <div className="gap-fill-wordbank">
        <p className="wordbank-label">Select the correct words:</p>
        <div className="word-bank">
          {wordBankOptions.map((word) => (
            <button
              key={word}
              className={`word-pill ${usedWords.includes(word) ? 'used' : ''} ${isReviewMode ? 'review-disabled' : ''}`}
              onClick={() => handleWordClick(word)}
              disabled={usedWords.includes(word) || isReviewMode}
            >
              {word}
            </button>
          ))}
        </div>
        {isReviewMode && (
          <div className="review-legend">
            Review mode active. Changes are disabled.
          </div>
        )}
      </div>
    );
  };

  // Case 1: Show only word bank (for separate word bank pane)
  if (showWordBankOnly) {
    return renderWordBank();
  }

  // Case 2: Show container with text and word bank below
  return (
    <div className="gap-fill-container">
      {data.id && (
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 800, color: 'var(--lab-indigo)' }}>
          {data.id}.
        </h4>
      )}
      {renderInteractiveText()}
      {wordBankOptions.length > 0 && renderWordBank()}
    </div>
  );
};

export default GapFillBlock;
