import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import './SentenceCompleteBlock.css';

const SentenceCompleteBlock = ({ 
  data, 
  userAnswers = {},
  onUpdate = () => {},
  showWordBankOnly = false,
  isReviewMode = false
}) => {
  // Support both formats:
  // 1. Old: content with __(1)__ markers, options, answers
  // 2. New: questions array (like other blocks)
  const questions = data.questions || (data.text ? [data] : []);
  const instruction = data.instruction;
  
  // Legacy props for backward compatibility
  const wordBankOptions = data.options || [];
  const answers = data.answers || [];

  // Handle new format: questions array
  if (questions.length > 0 && !data.content) {
    return (
      <div className="sentence-complete-container">
        {instruction && (
          <div className="question-instruction">
            {instruction}
          </div>
        )}
        
        {questions.map((q, idx) => {
          const qId = q.id || `q-${idx}`;
          const userAnswer = userAnswers[qId] || '';
          const correctAnswer = q.answer;
          const wordLimit = q.wordLimit || 2;
          
          const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer?.trim().toLowerCase();
          
          return (
            <div key={qId} className="sentence-complete-question">
              <h4 className="sentence-question-label">
                <span className="question-label">{String(qId).replace(/^q/, '')}.</span>
                {q.text}
                {isReviewMode && (
                  <span className="status-icon" style={{ marginLeft: '8px' }}>
                    {isCorrect ? <CheckCircle size={18} color="#10b981" /> : <XCircle size={18} color="#ef4444" />}
                  </span>
                )}
              </h4>
              
              <div className="sentence-input-container">
                <input
                  type="text"
                  className={`answer-input ${isReviewMode ? (isCorrect ? 'correct' : 'incorrect') : ''}`}
                  placeholder={isReviewMode ? "" : "Type answer here..."}
                  value={userAnswer}
                  onChange={(e) => onUpdate(qId, e.target.value)}
                  disabled={isReviewMode}
                />
                {!isReviewMode && wordLimit && (
                  <span className="word-limit-hint">Max {wordLimit} words</span>
                )}
                {isReviewMode && !isCorrect && (
                  <div className="correct-answer-hint">
                    Correct: {correctAnswer}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Legacy: Old format with content and word bank
  const [selections, setSelections] = useState({});
  const [activeGap, setActiveGap] = useState(null);

  // Find all gap markers and their positions
  const gapMarkerRegex = /__+\((\d+)\)__+/g;
  const content = data.content || '';
  
  // Split content by gap markers while keeping them in the result
  const parts = content.split(gapMarkerRegex);
  
  // The split regex with capture groups results in:
  // [text, gap1Index, text, gap2Index, text, ...]
  // So odd indices are gap indices, even indices are text parts

  // Handle gap click - set active gap
  const handleGapClick = (gapIndex) => {
    if (isReviewMode) return;
    setActiveGap(gapIndex);
  };

  // Handle word selection - fills the active gap
  const handleWordSelect = (word) => {
    if (isReviewMode) return;
    
    // If there's an active gap, fill it
    if (activeGap) {
      setSelections(prev => ({
        ...prev,
        [activeGap]: word
      }));
      setActiveGap(null);
      return;
    }
    
    // Otherwise, find first empty gap
    const gapMarkerRegex = /__+\((\d+)\)__+/g;
    const matches = [...content.matchAll(gapMarkerRegex)];
    
    for (const match of matches) {
      const gapIndex = match[1];
      if (!selections[gapIndex]) {
        setSelections(prev => ({
          ...prev,
          [gapIndex]: word
        }));
        return;
      }
    }
  };

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
        const isActive = activeGap === gapIndex;
        
        // Review Logic
        const correctAnswer = answers[parseInt(gapIndex) - 1];
        
        // Use .trim().toLowerCase() for resilient checking
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
            onClick={() => handleGapClick(gapIndex)}
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

            {/* Ensure the correct answer shows up if the user was wrong */}
            {isIncorrect && (
              <span className="correct-answer-hint">
                {correctAnswer}
              </span>
            )}
            {isMissing && (
               <span className="correct-answer-hint">
                {correctAnswer}
              </span>
            )}
          </motion.span>
        );

        // Skip the gap index part in next iteration
        i++;
      }
    }
    
    return <div className="sentence-complete-text">{elements}</div>;
  };

  // Render word bank
  const renderWordBank = () => {
    const usedWords = Object.values(selections);
    return (
      <div className="sentence-complete-wordbank">
        <p className="wordbank-label">Select the correct words:</p>
        <div className="word-bank">
          {wordBankOptions.map((word) => (
            <button
              key={word}
              className={`word-pill ${usedWords.includes(word) ? 'used' : ''} ${isReviewMode ? 'review-disabled' : ''}`}
              onClick={() => handleWordSelect(word)}
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
    <div className="sentence-complete-container">
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

export default SentenceCompleteBlock;
