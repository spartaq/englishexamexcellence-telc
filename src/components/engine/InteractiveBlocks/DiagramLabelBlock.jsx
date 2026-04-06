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
  isReviewMode = false,
  hideInstruction = false
}) => {
  const { 
    diagram, 
    labels = [], 
    questions = [],
    wordLimit = 2,
    instruction = `Write NO MORE THAN ${wordLimit} WORDS AND/OR A NUMBER for each answer.`
  } = data;
  
  // Create a map of label to question ID
  const labelToQuestionMap = {};
  questions.forEach((q, index) => {
    if (labels[index]) {
      labelToQuestionMap[labels[index].id] = q.id;
    }
  });

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
        {diagram.text && (
          <p className="diagram-text">
            {diagram.text}
          </p>
        )}
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

  // Render labels with letter buttons
  const renderLabels = () => {
    // Get all available letters from data.options if available, otherwise from labels
    const availableLetters = data.options || labels.map(l => l.letter || l.id);
    
    return (
      <div className="labels-container">
        {labels.map((label) => {
          const userAnswer = userAnswers[label.id] || '';
          const correctAnswer = label.answer || '';
          const isCorrect = normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);
          const isWrong = userAnswer && !isCorrect;
          const isMissing = isReviewMode && !userAnswer;

          return (
            <div
              key={label.id}
              className={`label-row ${isReviewMode ? (isCorrect ? 'row-correct' : 'row-incorrect') : ''}`}
            >
              {/* Label Text with Question Number */}
              <div className="label-text-container">
                <span className="label-question-number">{labelToQuestionMap[label.id] || label.id}.</span>
                {isReviewMode && (
                  <span className="status-icon">
                    {isCorrect ? <CheckCircle size={18} color="#10b981" /> : <XCircle size={18} color="#ef4444" />}
                  </span>
                )}
              </div>

              {/* Letter Buttons */}
              <div className="letter-buttons-container">
                {availableLetters.map((letter) => {
                  const isSelected = userAnswer === letter;
                  const isCorrectLetter = correctAnswer === letter;
                  
                  let buttonClass = 'letter-button';
                  if (isReviewMode) {
                    if (isCorrectLetter) {
                      buttonClass += ' letter-correct';
                    } else if (isSelected && !isCorrectLetter) {
                      buttonClass += ' letter-incorrect';
                    }
                  } else if (isSelected) {
                    buttonClass += ' letter-selected';
                  }

                  return (
                    <button
                      key={letter}
                      className={buttonClass}
                      onClick={() => !isReviewMode && handleInputChange(label.id, letter)}
                      disabled={isReviewMode}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>

              {/* Correct Answer Hint (Review Mode) */}
              {isReviewMode && isMissing && (
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
      {!hideInstruction && (
      <div className="question-instruction">
        {instruction}
      </div>
      )}

      {/* Diagram */}
      {renderDiagram()}

      {/* Labels */}
      {renderLabels()}
    </div>
  );
};

export default DiagramLabelBlock;

