import React from 'react';
import { CheckCircle, XCircle, ArrowRight, ArrowDown } from 'lucide-react';
import './FlowChartCompletionBlock.css';

/**
 * FlowChartCompletionBlock - IELTS Type 9: Flow-Chart Completion
 * 
 * Complete a flow-chart (series of boxes/steps linked by arrows).
 * Word limit applies (e.g., "NO MORE THAN TWO WORDS AND/OR A NUMBER")
 */
const FlowChartCompletionBlock = ({ 
  data, 
  userAnswers = {}, 
  onUpdate, 
  isReviewMode = false 
}) => {
  const { 
    title,
    steps = [], 
    wordLimit = 2,
    wordList = null, // If provided, uses dropdown instead of text input
    instruction = `Complete the flow-chart. Write NO MORE THAN ${wordLimit} WORDS AND/OR A NUMBER for each answer.`,
    direction = 'horizontal' // 'horizontal' or 'vertical'
  } = data;

  // Word count validation
  const countWords = (text) => {
    if (!text) return 0;
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

  const handleInputChange = (stepId, value) => {
    if (isReviewMode) return;
    if (onUpdate) onUpdate(stepId, value);
  };

  // Render a single step
  const renderStep = (step, index, isLast) => {
    const isGap = step.type === 'gap';
    const userAnswer = userAnswers[step.id] || '';
    const correctAnswer = step.answer || '';
    const isCorrect = normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);
    const isWrong = userAnswer && !isCorrect;
    const isMissing = isReviewMode && !userAnswer;
    const overLimit = isOverLimit(userAnswer);

    // Build class name for the step
    let stepClassName = 'flow-step';
    if (isGap) stepClassName += ' is-gap';
    if (overLimit) stepClassName += ' over-limit';
    if (isReviewMode) stepClassName += isCorrect ? ' row-correct' : ' row-incorrect';
    if (direction === 'vertical') stepClassName += ' vertical';

    return (
      <React.Fragment key={step.id}>
        <div className={stepClassName}>
          {/* Question number badge - only show for gaps */}
          {isGap && (
            <div className="step-badge step-badge-number">
              {step.id}
            </div>
          )}
          {/* Step label for non-gap steps */}
          {!isGap && (
            <div className="step-badge step-label">
              Step
            </div>
          )}

          {/* Step content */}
          <div className="step-content">
            {isGap ? (
              /* Gap input */
              <div>
                {wordList ? (
                  /* Dropdown mode */
                  <div className="flow-input-container">
                    <select
                      value={userAnswer}
                      onChange={(e) => handleInputChange(step.id, e.target.value)}
                      disabled={isReviewMode}
                      className="flow-select"
                    >
                      <option value="">Select...</option>
                      {wordList.map((word, idx) => (
                        <option key={idx} value={word}>{word}</option>
                      ))}
                    </select>
                    {isReviewMode && (
                      <span>
                        {isCorrect ? 
                          <CheckCircle size={18} color="#10b981" /> : 
                          <XCircle size={18} color="#ef4444" />
                        }
                      </span>
                    )}
                  </div>
                ) : (
                  /* Text input mode */
                  <div>
                    <div className="flow-input-container">
                      <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => handleInputChange(step.id, e.target.value)}
                        disabled={isReviewMode}
                        placeholder={isReviewMode ? '' : `${wordLimit} words max`}
                        className="flow-input"
                      />
                      {isReviewMode && (
                        <span>
                          {isCorrect ? 
                            <CheckCircle size={18} color="#10b981" /> : 
                            <XCircle size={18} color="#ef4444" />
                          }
                        </span>
                      )}
                    </div>
                    {/* Word count */}
                    {!isReviewMode && (
                      <div className={`flow-word-count ${overLimit ? 'over-limit' : ''}`}>
                        {countWords(userAnswer)}/{wordLimit} words
                      </div>
                    )}
                  </div>
                )}

                {/* Correct answer hint */}
                {isReviewMode && (isWrong || isMissing) && (
                  <div className="flowchart-hint">
                    Correct: {correctAnswer}
                  </div>
                )}
              </div>
            ) : (
              /* Static text */
              <p className="step-text">
                {step.text}
              </p>
            )}
          </div>
        </div>

        {/* Arrow connector */}
        {!isLast && (
          <div className={`flow-arrow ${direction === 'vertical' ? 'vertical' : ''}`}>
            {direction === 'horizontal' ? (
              <ArrowRight size={24} color="#94a3b8" />
            ) : (
              <ArrowDown size={24} color="#94a3b8" />
            )}
          </div>
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="flowchart-completion-block">
      {/* Header */}
      <div className="flowchart-header">
        <h3 className="flowchart-title">
          {title || 'Flow-Chart Completion'}
        </h3>
        {isReviewMode && (
          <span className="flowchart-badge">
            Review Mode
          </span>
        )}
      </div>

      {/* Instruction */}
      <div className="flowchart-instruction">
        {instruction}
      </div>

      {/* Word List (if provided) */}
      {wordList && (
        <div className="flowchart-word-list">
          <p className="word-list-label">
            Word List
          </p>
          <div className="word-list-items">
            {wordList.map((word, idx) => (
              <span 
                key={idx}
                className="word-list-item"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Flow Chart */}
      <div className={`flow-chart ${direction === 'vertical' ? 'vertical' : ''}`}>
        {steps.map((step, index) => 
          renderStep(step, index, index === steps.length - 1)
        )}
      </div>
    </div>
  );
};

export default FlowChartCompletionBlock;
