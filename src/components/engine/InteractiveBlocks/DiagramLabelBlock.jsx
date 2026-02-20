import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import './DiagramLabelBlock.css';

/**
 * DiagramLabelBlock - IELTS Type 10: Diagram Label Completion
 * 
 * Complete labels on a diagram based on text description.
 * Word limit applies (e.g., "NO MORE THAN TWO WORDS AND/OR A NUMBER")
 */
const DiagramLabelBlock = ({ 
  data, 
  userAnswers = {}, 
  onUpdate, 
  isReviewMode = false 
}) => {
  const { 
    diagram, 
    labels = [], 
    wordLimit = 2,
    instruction = `Write NO MORE THAN ${wordLimit} WORDS AND/OR A NUMBER for each answer.`
  } = data;

  // Word count validation
  const countWords = (text) => {
    if (!text) return 0;
    // Split by whitespace, filter empty strings
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    return words.length;
  };

  const isOverLimit = (text) => {
    return countWords(text) > wordLimit;
  };

  // Normalize answer for comparison
  const normalizeAnswer = (text) => {
    if (!text) return '';
    return text.trim().toLowerCase();
  };

  const handleInputChange = (labelId, value) => {
    if (isReviewMode) return;
    if (onUpdate) onUpdate(labelId, value);
  };

  // Render diagram image if provided
  const renderDiagram = () => {
    if (!diagram) return null;

    return (
      <div className="diagram-container">
        {diagram.src && (
          <img 
            src={diagram.src} 
            alt={diagram.alt || 'Diagram'} 
            className="diagram-image"
            style={{
              maxWidth: diagram.width || '100%',
              maxHeight: diagram.height || '400px',
              objectFit: 'contain'
            }}
          />
        )}
        {diagram.caption && (
          <p className="diagram-caption">
            {diagram.caption}
          </p>
        )}
      </div>
    );
  };

  // Render labels with input fields
  const renderLabels = () => {
    return (
      <div className="labels-container">
        {labels.map((label) => {
          const userAnswer = userAnswers[label.id] || '';
          const correctAnswer = label.answer || '';
          const isCorrect = normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);
          const isWrong = userAnswer && !isCorrect;
          const isMissing = isReviewMode && !userAnswer;
          const overLimit = isOverLimit(userAnswer);

          return (
            <div 
              key={label.id}
              className={`label-row ${isReviewMode ? (isCorrect ? 'row-correct' : 'row-incorrect') : ''} ${overLimit ? 'over-limit' : ''}`}
            >
              {/* Label Number/Badge */}
              <div className="label-number">
                {isReviewMode ? (
                  isCorrect ? <CheckCircle size={18} /> : <XCircle size={18} />
                ) : label.id}
              </div>

              {/* Label Description (optional) */}
              {label.description && (
                <span className="label-description">
                  {label.description}:
                </span>
              )}

              {/* Input Field */}
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => handleInputChange(label.id, e.target.value)}
                  disabled={isReviewMode}
                  placeholder={isReviewMode ? '' : `Max ${wordLimit} words...`}
                  className="label-input"
                />
              </div>

              {/* Word Count */}
              {!isReviewMode && (
                <span className={`label-word-count ${overLimit ? 'over-limit' : ''}`}>
                  {countWords(userAnswer)}/{wordLimit}
                </span>
              )}

              {/* Correct Answer (shown in review for wrong/missing) */}
              {isReviewMode && (isWrong || isMissing) && (
                <div className="correct-answer-hint">
                  Correct: {correctAnswer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="diagram-label-block">
      {/* Header */}
      <div className="diagram-label-header">
        <h3 className="diagram-label-title">
          Diagram Label Completion
        </h3>
        {isReviewMode && (
          <span className="diagram-label-badge">
            Review Mode
          </span>
        )}
      </div>

      {/* Instruction */}
      <div className="diagram-label-instruction">
        {instruction}
      </div>

      {/* Diagram */}
      {renderDiagram()}

      {/* Labels */}
      {renderLabels()}
    </div>
  );
};

export default DiagramLabelBlock;
