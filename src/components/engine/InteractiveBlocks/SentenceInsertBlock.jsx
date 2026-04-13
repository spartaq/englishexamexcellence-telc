import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import './SentenceInsertBlock.css';

const SentenceInsertBlock = ({ 
  data, 
  userAnswers = {}, 
  onUpdate, 
  isReviewMode = false,
  passageContent // This is the content from the passage (array of paragraphs)
}) => {
  // Destructure data - the subTask object
  const { instruction, passage = '', options = [], answers = {} } = data;
  
  // passageContent comes from ReadingBlock - it's the passage's content array
  // data.content might not exist in the subTask - the content is in passageContent
  console.log('[SentenceInsertBlock] passageContent:', passageContent);
  const textContent = passageContent && passageContent.length > 0 ? passageContent : [];
  console.log('[SentenceInsertBlock] textContent length:', textContent.length);

  // Parse passage to find gap markers __(1)__ or ____(1)____
  const parseParts = (text) => {
    const regex = /(?:__+|(?:____+))\((\d+)\)(?:__+|(?:____+))/g;
    return text.split(regex);
  };

  // Handle selection for a gap
  const handleSelect = (gapIndex, optionId) => {
    if (isReviewMode) return;
    if (onUpdate) onUpdate(gapIndex, optionId);
  };

  // Get used options
  const usedOptions = Object.values(userAnswers).filter(Boolean);

  // Format option label (a, b, c, etc.)
  const getOptionLabel = (idx) => {
    return String.fromCharCode(97 + idx); // a, b, c, ...
  };

  // Render passage text with gaps
  const renderPassageWithGaps = (text) => {
    const parts = parseParts(text);
    
    return parts.map((part, index) => {
      // Even indices are text, odd indices are gap numbers
      if (index % 2 === 0) {
        return <span key={index} className="si-text">{part}</span>;
      }

      const gapIndex = parseInt(part);
      const userChoice = userAnswers[gapIndex];
      const correctChoice = answers[gapIndex];
      
      const isCorrect = isReviewMode && userChoice === correctChoice;
      const isIncorrect = isReviewMode && userChoice && userChoice !== correctChoice;
      const isMissing = isReviewMode && !userChoice;

      // Get the option text for display
      const getCorrectText = () => {
        if (!correctChoice) return '';
        const optIdx = correctChoice.charCodeAt(0) - 97;
        return options[optIdx]?.text || correctChoice;
      };

      return (
        <span
          key={index}
          className={`si-gap 
            ${userChoice ? 'filled' : ''} 
            ${isCorrect ? 'correct' : ''} 
            ${isIncorrect ? 'incorrect' : ''} 
            ${isMissing ? 'missing' : ''}
            ${isReviewMode ? 'review' : ''}
          `}
        >
          <span className="si-gap-number">{gapIndex}</span>
          
          {isReviewMode ? (
            <span className="si-gap-display">
              {userChoice || '○'}
              {isCorrect && <CheckCircle size={14} />}
              {isIncorrect && <XCircle size={14} />}
            </span>
          ) : (
            <select
              className="si-gap-select"
              value={userChoice || ''}
              onChange={(e) => handleSelect(gapIndex, e.target.value)}
            >
              <option value="">Select...</option>
              {options.map((opt, idx) => {
                const optId = getOptionLabel(idx);
                return (
                  <option key={idx} value={optId}>
                    {optId}. {opt.text || opt}
                  </option>
                );
              })}
            </select>
          )}
          
          {/* Show correct answer hint in review */}
          {(isIncorrect || isMissing) && (
            <span className="si-correct-hint">
              {getCorrectText()}
            </span>
          )}
        </span>
      );
    });
  };

  return (
    <div className="sentence-insert-container">
      {/* Instruction */}
      {instruction && (
        <div className="si-instruction">
          {instruction}
        </div>
      )}

      {/* Options List */}
      {options.length > 0 && (
        <div className="si-options-list">
          <h4 className="si-options-title">
            Sentences a–{getOptionLabel(options.length - 1)}
          </h4>
          {console.log('[SentenceInsertBlock] Rendering options, count:', options.length)}
          <div className="si-options-grid">
            {options.map((opt, idx) => {
              const optionId = getOptionLabel(idx);
              const isUsed = usedOptions.includes(optionId);
              
              return (
                <div 
                  key={idx} 
                  className={`si-option-card ${isUsed ? 'used' : ''}`}
                >
                  <span className="si-option-label">{optionId}.</span>
                  <span className="si-option-text">{opt.text || opt}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Gap selectors only - no passage text */}
      <div className="si-gaps-container">
        {Object.keys(answers).map(gapKey => {
          const gapIndex = parseInt(gapKey);
          const userChoice = userAnswers[gapIndex];
          const correctChoice = answers[gapIndex];
          
          const isCorrect = isReviewMode && userChoice === correctChoice;
          const isIncorrect = isReviewMode && userChoice && userChoice !== correctChoice;
          const isMissing = isReviewMode && !userChoice;

          return (
            <div 
              key={gapKey}
              className={`si-gap-row ${isCorrect ? 'correct' : ''} ${isIncorrect ? 'incorrect' : ''} ${isMissing ? 'missing' : ''}`}
            >
              <span className="si-gap-number">{gapIndex}</span>
              
              {isReviewMode ? (
                <span className="si-gap-display">
                  {userChoice || '○'}
                  {isCorrect && <CheckCircle size={14} />}
                  {isIncorrect && <XCircle size={14} />}
                </span>
              ) : (
                <select
                  className="si-gap-select"
                  value={userChoice || ''}
                  onChange={(e) => handleSelect(gapIndex, e.target.value)}
                >
                  <option value="">Select...</option>
                  {options.map((opt, idx) => {
                    const optId = getOptionLabel(idx);
                    return (
                      <option key={idx} value={optId}>
                        {optId}. {opt.text || opt}
                      </option>
                    );
                  })}
                </select>
              )}
              
              {/* Show correct answer hint in review */}
              {(isIncorrect || isMissing) && correctChoice && (
                <span className="si-correct-hint">
                  {correctChoice}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Review Legend */}
      {isReviewMode && (
        <div className="si-review-legend">
          <span className="legend-correct">✓ Correct</span>
          <span className="legend-incorrect">✗ Incorrect</span>
          <span className="legend-missing">○ Missing</span>
        </div>
      )}
    </div>
  );
};

export default SentenceInsertBlock;