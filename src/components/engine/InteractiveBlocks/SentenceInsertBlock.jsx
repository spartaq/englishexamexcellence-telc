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
  const { instruction, options = [], answers = {} } = data;

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